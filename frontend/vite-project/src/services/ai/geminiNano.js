import { SURAKSHA_SYSTEM_PROMPT } from "./prompts.js";

/**
 * Tier 1: On-Device AI via Chrome Built-in AI (Gemini Nano / LanguageModel API)
 * Supports both the modern global `LanguageModel` API and legacy `window.ai.languageModel`.
 * Returns { source: "ON-DEVICE", badgeClass: "badge-ondevice", badgeText: "ON-DEVICE • AI", text }
 */
export async function askGeminiNano(query) {
  if (typeof window === "undefined" && typeof self === "undefined") {
    throw new Error("Browser environment not available for on-device AI");
  }

  let session = null;

  try {
    // 1. Modern Chrome Prompt API (global LanguageModel)
    const LM =
      typeof globalThis !== "undefined" && globalThis.LanguageModel
        ? globalThis.LanguageModel
        : null;

    if (LM) {
      const availability =
        typeof LM.availability === "function"
          ? await LM.availability()
          : (await LM.capabilities?.())?.available;

      if (availability === "unavailable" || availability === "no") {
        throw new Error("Gemini Nano model not available on this device");
      }

      session = await LM.create({
        initialPrompts: [{ role: "system", content: SURAKSHA_SYSTEM_PROMPT }]
      });

      const text = await session.prompt(query);
      return {
        source: "ON-DEVICE",
        badgeClass: "badge-ondevice",
        badgeText: "ON-DEVICE • AI",
        text
      };
    }

    // 2. Legacy Chrome Canary Prompt API (window.ai.languageModel)
    const aiObj =
      (typeof window !== "undefined" && window.ai) ||
      (typeof self !== "undefined" && self.ai) ||
      null;

    if (!aiObj || !aiObj.languageModel) {
      throw new Error("Gemini Nano / LanguageModel API not supported on this browser");
    }

    const capabilities = await aiObj.languageModel.capabilities();
    if (capabilities.available === "no") {
      throw new Error("Gemini Nano model not downloaded or not available on device");
    }

    session = await aiObj.languageModel.create({
      systemPrompt: SURAKSHA_SYSTEM_PROMPT
    });

    const text = await session.prompt(query);
    return {
      source: "ON-DEVICE",
      badgeClass: "badge-ondevice",
      badgeText: "ON-DEVICE • AI",
      text
    };
  } finally {
    if (session && typeof session.destroy === "function") {
      try {
        session.destroy();
      } catch {}
    }
  }
}
