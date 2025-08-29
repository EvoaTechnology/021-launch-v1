import { API_ENDPOINTS, GENERATION_CONFIG } from "../config/api-config";
import { buildSystemPrompt } from "../services/personaDescription-service";
import { logger } from "../utils/logger";

/**
 * ✅ Local type for provider messages
 */
import type { ProviderMessage } from "../../types/shared";
type ProviderRole = "user" | "assistant" | "system";

function toGeminiRole(role: ProviderRole): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

function stripScoringArtifacts(responseText: string): string {
  return responseText
    .replace(
      /(Total Score:\s*\d+\s*\/\s*\d+|Score Awarded:\s*[+-]?\d+\s*points?)/gi,
      ""
    )
    .trim();
}

/**
 * Main Gemini chat call
 */
export async function callGeminiAPI(
  messages: ProviderMessage[],
  apiKey: string,
  isBusinessRelated: boolean,
  activeRole: string
): Promise<{ cleaned: string }> {
  const systemInstructionText = buildSystemPrompt(activeRole);

  // ✅ Normalize messages
  const safeMessages = (messages || [])
    .map((m) => ({
      role: m?.role ?? "user",
      content:
        typeof m?.content === "string" ? m.content : String(m?.content ?? ""),
      roleContext:
        typeof m?.roleContext === "string" && m.roleContext.trim().length > 0
          ? m.roleContext.trim()
          : undefined,
    }))
    .filter((m) => m.content.trim().length > 0);

  // ✅ Map messages for Gemini
  const contentsPayload = safeMessages.map((msg) => {
    const geminiRole = toGeminiRole(msg.role);
    return {
      role: geminiRole,
      parts: [{ text: msg.content }],
    };
  });

  // ✅ Request body
  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstructionText }],
    },
    contents: contentsPayload,
    generationConfig: GENERATION_CONFIG.gemini,
  };

  // 🚀 DETAILED REQUEST LOGGING
  logger.info("📤 [GEMINI] API REQUEST DETAILS:", {
    endpoint: `${API_ENDPOINTS.gemini}?key=${apiKey.substring(0, 8)}...`,
    systemInstructionLength: systemInstructionText.length,
    systemInstructionPreview: systemInstructionText.substring(0, 200) + "...",
    messageCount: contentsPayload.length,
    messageBreakdown: {
      user: contentsPayload.filter((m) => m.role === "user").length,
      model: contentsPayload.filter((m) => m.role === "model").length,
    },
    generationConfig: GENERATION_CONFIG.gemini,
    estimatedTokens: Math.ceil(
      (systemInstructionText.length +
        contentsPayload.reduce((sum, m) => sum + m.parts[0].text.length, 0)) /
        4
    ),
  });

  // Log individual message details
  logger.info("💬 [GEMINI] MESSAGE DETAILS:", {
    messages: contentsPayload.map((msg, i) => ({
      index: i,
      role: msg.role,
      contentLength: msg.parts[0].text.length,
      contentPreview: msg.parts[0].text.substring(0, 150) + "...",
      isSummary: i < safeMessages.length && safeMessages[i].role === "system",
    })),
  });

  // ✅ Call Gemini API
  const response = await fetch(`${API_ENDPOINTS.gemini}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error("❌ [GEMINI] API ERROR:", {
      status: response.status,
      statusText: response.statusText,
      errorText: errorText.substring(0, 500),
      requestBody: {
        systemInstructionLength: systemInstructionText.length,
        messageCount: contentsPayload.length,
        totalContentLength: contentsPayload.reduce(
          (sum, m) => sum + m.parts[0].text.length,
          0
        ),
      },
    });
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  const raw =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data ??
    "";

  if (typeof raw !== "string" || raw.trim().length === 0) {
    logger.error("❌ [GEMINI] INVALID RESPONSE:", {
      responseData: data,
      candidates: data?.candidates,
      firstCandidate: data?.candidates?.[0],
    });
    throw new Error("Invalid Gemini API response: No text content found.");
  }

  // 🚀 DETAILED RESPONSE LOGGING
  logger.info("📥 [GEMINI] API RESPONSE RECEIVED:", {
    responseLength: raw.length,
    responsePreview: raw.substring(0, 200) + "...",
    hasProgressScore: /\[progress_score:\s*\d+\]/i.test(raw),
    responseStructure: {
      hasCandidates: !!data?.candidates,
      candidateCount: data?.candidates?.length || 0,
      hasContent: !!data?.candidates?.[0]?.content,
      hasParts: !!data?.candidates?.[0]?.content?.parts,
    },
  });

  const aiRaw = raw
    .replace(/^[^\S\n]+/gm, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\n+$/g, "")
    .replace(/\[HISTORY\]/gi, "")
    .replace(/\[CURRENT\]/gi, "")
    .trim();

  const cleaned = stripScoringArtifacts(aiRaw);

  // 🚀 FINAL PROCESSED RESPONSE LOGGING
  logger.info("✨ [GEMINI] FINAL PROCESSED RESPONSE:", {
    originalLength: raw.length,
    cleanedLength: cleaned.length,
    removedLength: raw.length - cleaned.length,
    cleaningApplied: {
      whitespaceRemoved: raw.length !== raw.trim().length,
      newlinesNormalized: /\n{2,}/.test(raw),
      historyTagsRemoved: /\[HISTORY\]/i.test(raw),
      currentTagsRemoved: /\[CURRENT\]/i.test(raw),
    },
  });

  return { cleaned };
}

/**
 * Gemini title generator (2–3 words)
 */
export async function callGeminiAPIForTitle(userMsg: string) {
  const systemInstructionText =
    "You are a helpful assistant that generates a chat title. Title should be 2 to 3 words, meaningful. If greetings only → 'Greeting'.";

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstructionText }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userMsg }],
      },
    ],
    generationConfig: GENERATION_CONFIG.gemini,
  };

  logger.info("📤 [GEMINI] TITLE GENERATION REQUEST:", {
    userMessage: userMsg,
    systemInstruction: systemInstructionText,
    requestBody: requestBody,
  });

  const response = await fetch(
    `${API_ENDPOINTS.gemini}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();

  const raw =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data ??
    "";

  if (typeof raw !== "string" || raw.trim().length === 0) {
    logger.error("❌ [GEMINI] TITLE GENERATION FAILED:", {
      responseData: data,
      userMessage: userMsg,
    });
    throw new Error("Invalid Gemini API response: No title found.");
  }

  const title = raw.trim();
  logger.info("✅ [GEMINI] TITLE GENERATED:", {
    userMessage: userMsg,
    generatedTitle: title,
  });

  return title;
}
