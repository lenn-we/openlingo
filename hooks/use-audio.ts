"use client";

import { useRef, useCallback, useState } from "react";

export function useAudio() {
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const nonceRef = useRef(0);
  const [loading, setLoading] = useState(false);

  const stop = useCallback(() => {
    nonceRef.current++;
    setLoading(false);
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }
  }, []);

  const play = useCallback(async (text: string, language: string) => {
    stop();
    const nonce = nonceRef.current;

    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        body: JSON.stringify({ text, language }),
      });

      if (!res.ok) throw new Error(`TTS failed with status ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (nonce !== nonceRef.current) return;

      const audio = new Audio(url);
      currentAudio.current = audio;
      audio.play();
    } catch {
      // silently ignore
    } finally {
      if (nonce === nonceRef.current) setLoading(false);
    }
  }, [stop]);

  const prefetch = useCallback((_texts: string[], _language: string) => {
    // no-op
  }, []);

  return { play, stop, prefetch, loading };
}
