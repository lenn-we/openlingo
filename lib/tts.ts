const ELEVENLABS_VOICE_ID = "d3l4f3HgkE3P6Fo91lYA";

export async function generateSpeech(
  text: string,
  _language: string,
): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY must be set");
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
     text,
     model_id: "eleven_flash_v2_5",
     language_code: "hr", // Auf oberster Ebene platziert
     voice_settings: {
      stability: 0.9,
      similarity_boost: 0.75
  }
}),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `ElevenLabs TTS failed with status ${response.status}: ${errorText}`,
    );
  }

  return Buffer.from(await response.arrayBuffer());
}
