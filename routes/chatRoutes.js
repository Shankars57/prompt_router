import express from "express";
import { classifyIntent } from "../services/classifier.js";
import { routeAndRespond } from "../services/router.js";
import { logRoute } from "../utils/logger.js";

const router = express.Router();
const OVERRIDES = ["code", "data", "writing", "career"];

function parseManualOverride(rawMessage) {
  const message = String(rawMessage || "").trim();
  const match = message.match(/^@(code|data|writing|career)\b/i);

  if (!match) {
    return null;
  }

  const intent = match[1].toLowerCase();
  const cleanedMessage = message.replace(/^@(code|data|writing|career)\b\s*/i, "").trim();

  return {
    intent,
    confidence: 1.0,
    message: cleanedMessage || message
  };
}

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const manual = parseManualOverride(message);
    let intent = "unclear";
    let confidence = 0.0;
    let contentToRoute = message.trim();

    // Step 1: Manual override (if present) bypasses classification.
    if (manual && OVERRIDES.includes(manual.intent)) {
      intent = manual.intent;
      confidence = manual.confidence;
      contentToRoute = manual.message;
    } else {
      // Step 2: Classify intent with Gemini.
      const classified = await classifyIntent(contentToRoute);
      intent = classified.intent;
      confidence = classified.confidence;
    }

    // Step 3: Route message to selected expert prompt and generate response.
    const response = await routeAndRespond(contentToRoute, intent, confidence);

    await logRoute({
      message: contentToRoute,
      intent,
      confidence,
      response
    });

    return res.json({
      intent,
      confidence,
      response
    });
  } catch (error) {
    console.error("Chat route error:", error.message);
    return res.status(500).json({
      error: "Failed to process request."
    });
  }
});

export default router;
