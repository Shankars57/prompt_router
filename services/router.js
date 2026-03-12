import { config } from "../config/config.js";
import { SYSTEM_PROMPTS } from "../prompts/prompts.js";
import { generateWithGemini } from "./geminiClient.js";

export const CLARIFICATION_MESSAGE =
  "I'm not sure what you need. Are you asking about coding, data analysis, writing improvement, or career advice?";

export async function routeAndRespond(message, intent, confidence = 1) {
  const normalizedIntent = (intent || "unclear").toLowerCase();

  if (normalizedIntent === "unclear" || confidence < config.confidenceThreshold) {
    return CLARIFICATION_MESSAGE;
  }

  const systemPrompt = SYSTEM_PROMPTS[normalizedIntent];
  if (!systemPrompt) {
    return CLARIFICATION_MESSAGE;
  }

  return generateWithGemini(systemPrompt, message);
}
