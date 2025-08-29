"use server";
import { type NextRequest, NextResponse } from "next/server";
import { logError } from "../../../lib/utils/logging-utils";
import { callGeminiAPIForTitle } from "../../../lib/providers/gemini-provider";
import { logger } from "../../../lib/utils/logger";
import { createClient as createSupabaseServerClient } from "../../../utils/supabase/server";
import { buildRateKey, checkRateLimit } from "../../../lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Authn: require Supabase user
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ title: "Unauthorized" }, { status: 401 });
    }

    // Basic per-user/IP rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown-ip";
    const rateKey = buildRateKey(["ai-title", user.id, ip]);
    const rl = checkRateLimit(rateKey, { capacity: 10, refillRatePerSec: 0.2 });
    if (!rl.allowed) {
      return NextResponse.json(
        { title: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const { userMsg } = await request.json();
    logger.debug("--------------getting title--------------");
    try {
      const apiResponseForTitle = await callGeminiAPIForTitle(userMsg);
      logger.debug("apiResponseForTitle", apiResponseForTitle);
      logger.debug("--------------title generated--------------");
      return NextResponse.json({ title: apiResponseForTitle });
    } catch (error) {
      logger.error("server error in generating AI title", error);
      return NextResponse.json({ title: "Error generating title" });
    }
  } catch (error) {
    logError(error, "AI title");
    return NextResponse.json(
      { title: "Error generating title" },
      { status: 500 }
    );
  }
}
