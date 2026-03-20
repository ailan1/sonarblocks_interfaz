import { useRef } from "react";

export const useAudioSimple = () => {
  const audioRef = useRef(new Audio());

  const hablar = (src) => {
    if (!src) return;

    const audio = audioRef.current;

    audio.pause();            // corta cualquier audio anterior
    audio.currentTime = 0;    // reinicia
    audio.src = src;

    audio.play().catch(() => {
      console.warn("⚠️ No se pudo reproducir:", src);
    });
  };

  return { hablar };
};