import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, language } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    if (!language || typeof language !== "string") {
      return NextResponse.json({ error: "language is required" }, { status: 400 });
    }
    if (text.length > 4096) {
      return NextResponse.json({ error: "text must be under 4096 characters" }, { status: 400 });
    }

    const { generateSpeech } = await import("@/lib/tts");
    const buffer = await generateSpeech(text, language);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("TTS generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TTS generation failed" },
      { status: 500 },
    );
  }
}
