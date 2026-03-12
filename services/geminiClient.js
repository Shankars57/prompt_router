import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/config.js";

let client = null;
const FALLBACK_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro"];

function getClient() {
  if (!config.geminiApiKey) {
    throw new Error(
      "Missing Gemini API key. Set GEMINI_API_KEY (env) or GEMINI_API_KEY_FILE (secret file path)."
    );
  }

  if (!client) {
    client = new GoogleGenerativeAI(config.geminiApiKey);
  }

  return client;
}

function buildRequest(userPrompt, options) {
  if (!options?.generationConfig) {
    return userPrompt;
  }

  return {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: options.generationConfig
  };
}

export async function generateWithGemini(systemPrompt, userPrompt, options = {}) {
  const genAI = getClient();
  const modelsToTry = [config.geminiModel, ...FALLBACK_MODELS].filter(
    (value, index, array) => value && array.indexOf(value) === index
  );

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt
      });

      const result = await model.generateContent(buildRequest(userPrompt, options));
      const response = result.response;
      return response.text().trim();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gemini request failed.");
}
