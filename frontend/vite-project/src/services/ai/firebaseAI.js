import { getAI, GoogleAIBackend, getGenerativeModel } from "firebase/ai";
import { app } from "./firebaseConfig.js";
import { SURAKSHA_SYSTEM_PROMPT } from "./prompts.js";

/**
 * Tier 2: Cloud AI via firebase/ai, GoogleAIBackend, and gemini-2.5-flash
 * Runs when navigator.onLine is true
 * Returns { source: "CLOUD", badgeClass: "badge-cloud", badgeText: "CLOUD • GEMINI", text }
 */
export async function askFirebaseAI(query) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("Network offline: Cloud AI cannot be reached");
  }

  try {
    const ai = getAI(app, { backend: new GoogleAIBackend() });
    const model = getGenerativeModel(ai, {
      model: "gemini-2.5-flash",
      systemInstruction: SURAKSHA_SYSTEM_PROMPT
    });

    const result = await model.generateContent(query);
    const text = result.response.text();

    return {
      source: "CLOUD",
      badgeClass: "badge-cloud",
      badgeText: "CLOUD • GEMINI",
      text
    };
  } catch (err) {
    console.warn("Firebase Cloud AI error:", err);
    throw err;
  }
}
