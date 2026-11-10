
"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";

type MusicPlayerProps = {
  startMusic: boolean;
};

export default function MusicPlayer({
  startMusic,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!startMusic || !audioRef.current) return;

    const audio = audioRef.current;

    audio.play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        console.warn("Browser belum mengizinkan autoplay:", error);
        setIsPlaying(false);
      });
  }, [startMusic]);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Musik gagal diputar:", error);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/backsound.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
        aria-pressed={isPlaying}
        className="fixed bottom-5 right-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#879b83] text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-[#71876e]"
      >
        {isPlaying ? (
          <Pause size={21} fill="currentColor" />
        ) : (
          <Play size={21} fill="currentColor" />
        )}
      </button>

      {isPlaying && (
        <div className="pointer-events-none fixed bottom-[78px] right-5 z-[90] rounded-full bg-white/95 px-3 py-1.5 text-xs text-[#596b58] shadow-md">
          <span className="flex items-center gap-2">
            <Music2 size={14} />
            Musik diputar
          </span>
        </div>
      )}
    </>
  );
}
