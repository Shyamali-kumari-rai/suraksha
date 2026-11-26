import { SURAKSHA_SYSTEM_PROMPT } from "./prompts.js";

/**
 * Tier 1: On-Device AI via Chrome Built-in AI (LanguageModel API / window.ai)
 * Returns { source: "ON-DEVICE", badgeClass: "badge-ondevice", badgeText: "ON-DEVICE • AI", text }
 */
export async function askGeminiNano(query) {
  if (typeof window === "undefined") {
    throw new Error("Window not available for on-device AI");
  }

  // Check for window.ai.languageModel or self.ai.languageModel
  const aiObj = window.ai || (typeof self !== "undefined" ? self.ai : null);
  if (!aiObj || !aiObj.languageModel) {
    throw new Error("Gemini Nano / LanguageModel API not supported on this browser");
  }

  const capabilities = await aiObj.languageModel.capabilities();
  if (capabilities.available === "no") {
    throw new Error("Gemini Nano model not downloaded or not available on device");
  }

  const session = await aiObj.languageModel.create({
    systemPrompt: SURAKSHA_SYSTEM_PROMPT
  });

  const text = await session.prompt(query);
  session.destroy();

  return {
    source: "ON-DEVICE",
    badgeClass: "badge-ondevice",
    badgeText: "ON-DEVICE • AI",
    text
  };
}
