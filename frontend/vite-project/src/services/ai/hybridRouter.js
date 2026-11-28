import { askGeminiNano } from "./geminiNano.js";
import { askFirebaseAI } from "./firebaseAI.js";
import { findBestMatches, hasDevanagari } from "../../utils/voiceMatcher.js";
import { SURAKSHA_GUIDES } from "../../utils/data.js";

/**
 * Hybrid AI Router:
 * Tier 1: Gemini Nano (On-Device via LanguageModel API)
 * Tier 2: Cloud AI (firebase/ai GoogleAIBackend gemini-2.5-flash)
 * Tier 3: Verified On-Device First-Aid Dataset Fallback
 *
 * Always returns:
 * { source: "ON-DEVICE" | "CLOUD", badgeClass: string, badgeText: string, text: string }
 */
export async function askSurakshaHybrid(query) {
  if (!query || !query.trim()) {
    return {
      source: "ON-DEVICE",
      badgeClass: "badge-ondevice",
      badgeText: "ON-DEVICE • AI",
      text: "Please describe what happened or the injury you need help with. In a serious emergency, call 112 immediately."
    };
  }

  // Tier 1: Try Gemini Nano (On-Device)
  try {
    const nanoRes = await askGeminiNano(query);
    if (nanoRes && nanoRes.text) {
      return nanoRes;
    }
  } catch (nanoErr) {
    console.info("Tier 1 Gemini Nano not available on this device:", nanoErr.message);
  }

  // Tier 2: Try Firebase Cloud AI (gemini-2.5-flash) if online
  const isOnline = typeof navigator === "undefined" || navigator.onLine !== false;
  if (isOnline) {
    try {
      const cloudRes = await askFirebaseAI(query);
      if (cloudRes && cloudRes.text) {
        return cloudRes;
      }
    } catch (cloudErr) {
      console.warn("Tier 2 Firebase Cloud AI failed or unavailable, falling back to on-device protocols:", cloudErr.message);
    }
  }

  // Tier 3: Verified Offline Rule-Based Fallback
  const matches = findBestMatches(query, SURAKSHA_GUIDES);
  const isHi = hasDevanagari(query);

  if (matches.length > 0) {
    const top = matches[0];
    const title = isHi ? top.hi : top.en;
    const steps = (isHi ? (top.hiSteps || top.stepsHi) : (top.enSteps || top.steps)) || [];

    const formattedSteps = steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n");
    const responseText = `${title}\n\n${formattedSteps}\n\nIn a serious emergency, call 112 immediately.`;

    return {
      source: "ON-DEVICE",
      badgeClass: "badge-ondevice",
      badgeText: "ON-DEVICE • AI",
      text: responseText
    };
  }

  // General Emergency Fallback
  const fallbackText = isHi
    ? "1. व्यक्ति को सुरक्षित और शांत स्थिति में रखें।\n2. सांस और प्रतिक्रिया की जांच करें।\n3. चोट या घाव पर दबाव न डालें।\n\nIn a serious emergency, call 112 immediately."
    : "1. Keep the patient calm and in a safe position.\n2. Check for breathing and responsiveness.\n3. Do not cause unnecessary movement or pressure.\n\nIn a serious emergency, call 112 immediately.";

  return {
    source: "ON-DEVICE",
    badgeClass: "badge-ondevice",
    badgeText: "ON-DEVICE • AI",
    text: fallbackText
  };
}

export default askSurakshaHybrid;
