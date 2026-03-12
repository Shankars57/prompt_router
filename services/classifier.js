import { CLASSIFIER_PROMPT, VALID_INTENTS } from "../prompts/prompts.js";
import { generateWithGemini } from "./geminiClient.js";

function fallbackIntent() {
  return { intent: "unclear", confidence: 0.0 };
}

function normalizeIntent(raw) {
  if (typeof raw !== "string") {
    return "unclear";
  }
  const normalized = raw.trim().toLowerCase();
  return VALID_INTENTS.includes(normalized) ? normalized : "unclear";
}

function parseClassifierResponse(text) {
  // Handle common model formatting like fenced JSON blocks.
  const cleaned = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (_error) {
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!objectMatch) {
      throw new Error("Classifier response did not contain JSON.");
    }
    parsed = JSON.parse(objectMatch[0]);
  }

  const intent = normalizeIntent(parsed.intent);
  const confidenceValue = Number(parsed.confidence);
  const confidence = Number.isFinite(confidenceValue)
    ? Math.max(0, Math.min(1, confidenceValue))
    : 0;

  return { intent, confidence };
}

export async function classifyIntent(message) {
  try {
    const classifierInput = `Classify this message:\n${message}`;
    const modelOutput = await generateWithGemini(CLASSIFIER_PROMPT, classifierInput, {
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0
      }
    });
    return parseClassifierResponse(modelOutput);
  } catch (error) {
    console.error("Intent classification failed:", error.message);
    return fallbackIntent();
  }
}
