import { API_ENDPOINTS, GENERATION_CONFIG } from "../config/api-config";
import { logger } from "../utils/logger";

export type OAIRole = "system" | "user" | "assistant";

export interface OAIMessage {
  role: OAIRole;
  content: string;
}

export interface ReportChunkRequest {
  systemInstruction: string;
  payloadMessages: OAIMessage[];
  partialReport?: string;
  model?: string;
}

/**
 * Build a compact system message that guides the model to fill a fixed report.
 * It supports incremental fills when partialReport is provided.
 */
export function buildReportSystemMessage(
  baseInstruction: string,
  partialReport?: string
): string {
  const incremental = partialReport
    ? `You are receiving the report incrementally. Merge new insights into the existing partial report without duplicating sections. Preserve structure and tags strictly.`
    : `Generate the complete report strictly following the provided structure and tags.`;
  return `${baseInstruction}\n\n${incremental}\n\nRules:\n- Only output the report body.\n- Preserve tags, headings, and JSON keys exactly.\n- No prose outside the report.\n- If information is missing, leave placeholders clearly marked TODO.`;
}

/**
 * Call OpenAI with a system instruction plus payload messages.
 */
export async function callOpenAIForReport(
  apiKey: string,
  req: ReportChunkRequest
): Promise<string> {
  if (!apiKey) throw new Error("Missing OpenAI API key.");

  const model = req.model || "gpt-4o-mini"; // lightweight model
  const messages = [
    { role: "system", content: req.systemInstruction },
    ...(req.partialReport
      ? [
          {
            role: "assistant",
            content: req.partialReport,
          },
        ]
      : []),
    ...req.payloadMessages,
  ];

  const body = {
    model,
    messages,
    ...GENERATION_CONFIG.openai,
  } as const;

  logger.info("📤 [OPENAI] REPORT REQUEST", {
    model,
    systemLen: req.systemInstruction.length,
    payloadCount: req.payloadMessages.length,
    hasPartial: !!req.partialReport,
  });

  const resp = await fetch(API_ENDPOINTS.openai, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    logger.error("❌ [OPENAI] REPORT ERROR", { status: resp.status, text });
    throw new Error(`OpenAI error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const content =
    data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.delta?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenAI returned empty content");
  }
  return content.trim();
}

/**
 * Split messages into N roughly equal chunks.
 */
export function chunkMessages(
  items: OAIMessage[],
  parts: number
): OAIMessage[][] {
  if (parts <= 1) return [items];
  const size = Math.ceil(items.length / parts);
  const chunks: OAIMessage[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Drive the chunked flow. If messages exceed threshold, break, call sequentially, feeding partial report each time.
 */
export async function generateReportWithChunking(params: {
  apiKey: string;
  baseInstruction: string;
  fullMessages: Array<{ role: "user" | "assistant"; content: string }>;
  thresholdCount?: number;
  maxParts?: number;
  model?: string;
}): Promise<string> {
  const thresholdCount = params.thresholdCount ?? 60;
  const maxParts = params.maxParts ?? 4;

  const normalized: OAIMessage[] = (params.fullMessages || [])
    .filter((m) => typeof m?.content === "string" && m.content.trim().length)
    .map((m) => ({ role: m.role, content: m.content.trim() }));

  let partialReport: string | undefined = undefined;

  if (normalized.length > thresholdCount) {
    const parts = Math.min(
      maxParts,
      normalized.length > thresholdCount * 3
        ? 4
        : normalized.length > thresholdCount * 2
        ? 3
        : 2
    );
    const chunks = chunkMessages(normalized, parts);
    for (let i = 0; i < chunks.length; i++) {
      const systemInstruction = buildReportSystemMessage(
        params.baseInstruction,
        partialReport
      );
      const result = await callOpenAIForReport(params.apiKey, {
        systemInstruction,
        payloadMessages: chunks[i],
        partialReport,
        model: params.model,
      });
      partialReport = result;
    }
    return partialReport || "";
  } else {
    const systemInstruction = buildReportSystemMessage(params.baseInstruction);
    return await callOpenAIForReport(params.apiKey, {
      systemInstruction,
      payloadMessages: normalized,
      model: params.model,
    });
  }
}
