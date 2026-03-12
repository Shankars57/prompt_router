import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

function readSecretFromFile(filePath) {
  if (!filePath) {
    return "";
  }

  try {
    return readFileSync(filePath, "utf8").trim();
  } catch (_error) {
    return "";
  }
}

const secretFromFile = readSecretFromFile(process.env.GEMINI_API_KEY_FILE);

export const config = {
  port: Number(process.env.PORT) || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY || secretFromFile || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  confidenceThreshold: 0.7
};
