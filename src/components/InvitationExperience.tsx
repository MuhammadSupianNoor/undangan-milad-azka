
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Music2, Pause, Play, Mail } from "lucide-react";
import type { ReactNode } from "react";

type InvitationExperienceProps = {
  children: ReactNode;
};

export default function InvitationExperience({
  children,
}: InvitationExperienceProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mengunci scroll selama amplop belum dibuka
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  // Membuka amplop sekaligus memulai musik
  const handleOpenInvitation = () => {
    if (isOpening || isOpened) return;

    const audio = audioRef.current;

    // Memanggil play langsung dari interaksi klik pengguna
    if (audio) {
      audio.volume = 0.35;

      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.warn("Musik belum dapat diputar:", error);
          setIsPlaying(false);
        });
    }

    setIsOpening(true);

    // Memberi waktu untuk animasi amplop
    window.setTimeout(() => {
      setIsOpened(true);
    }, 1100);
  };

  // Play dan Pause musik
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
      {/* Musik latar */}
      <audio
        ref={audioRef}
        src="/audio/backsound.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Isi halaman undangan */}
      {children}

      {/* Tombol musik setelah undangan dibuka */}
      {isOpened && (
        <>
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
      )}

      {/* Layar pembuka amplop */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="invitation-cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#f1ede3] px-5"
          >
            {/* Dekorasi latar */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#dce5d7]/60 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#e6d8bd]/60 blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">

              {/* Judul */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#879b83]">
                  Undangan Silaturahmi Keluarga
                </p>

                <h1 className="font-serif text-4xl text-[#343c35]">
                  Milad Azka
                </h1>

                <p className="mt-2 text-sm tracking-widest text-[#879b83]">
                  Yang Ke-2 Tahun
                </p>

                <div className="mx-auto mt-5 h-px w-16 bg-[#bd9b65]" />
              </motion.div>

              {/* Amplop */}
              <div
                className="relative mb-12 h-56 w-full max-w-[310px]"
                style={{ perspective: "1000px" }}
              >
                {/* Badan amplop */}
                <motion.div
                  animate={
                    isOpening
                      ? { y: 30, scale: 0.95 }
                      : { y: 0, scale: 1 }
                  }
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="absolute inset-0 overflow-hidden rounded-xl bg-[#879b83] shadow-2xl"
                >
                  {/* Kertas undangan */}
                  <motion.div
                    animate={
                      isOpening
                        ? { y: -115, opacity: 1 }
                        : { y: 12, opacity: 1 }
                    }
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute left-[10%] top-0 z-10 flex h-[90%] w-[80%] flex-col items-center justify-center rounded-md border border-[#e8e2d5] bg-[#fffdf8] shadow-md"
                  >
                    <Mail
                      size={27}
                      strokeWidth={1.2}
                      className="mb-3 text-[#879b83]"
                    />

                    <p className="font-serif text-2xl text-[#343c35]">
                      Azka
                    </p>

                    <p className="mt-1 text-xs tracking-widest text-[#879b83]">
                      2nd Birthday
                    </p>
                  </motion.div>

                  {/* Lipatan bawah amplop */}
                  <div
                    className="absolute inset-0 z-20"
                    style={{
                      background: "#71876e",
                      clipPath: "polygon(0 100%, 50% 48%, 100% 100%)",
                    }}
                  />

                  {/* Sisi kiri dan kanan amplop */}
                  <div
                    className="absolute inset-0 z-20"
                    style={{
                      background: "#81967d",
                      clipPath: "polygon(0 0, 50% 48%, 0 100%)",
                    }}
                  />

                  <div
                    className="absolute inset-0 z-20"
                    style={{
                      background: "#91a58c",
                      clipPath: "polygon(100% 0, 50% 48%, 100% 100%)",
                    }}
                  />

                  {/* Tutup amplop */}
                  <motion.div
                    animate={
                      isOpening
                        ? { rotateX: 180 }
                        : { rotateX: 0 }
                    }
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformOrigin: "top center",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                    className="absolute inset-0 z-30"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "#a2b39b",
                        clipPath: "polygon(0 0, 100% 0, 50% 55%)",
                      }}
                    />
                  </motion.div>

                  {/* Segel amplop */}
                  {!isOpening && (
                    <motion.div
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute left-1/2 top-[47%] z-40 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f4e8cc] bg-[#bd9b65] text-white shadow-lg"
                    >
                      <span className="font-serif text-lg">A</span>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Tombol buka undangan */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <p className="mb-5 text-sm text-[#77766f]">
                  Dengan penuh kebahagiaan, kami mengundang Anda
                  untuk hadir dalam acara keluarga kami.
                </p>

                <button
                  type="button"
                  onClick={handleOpenInvitation}
                  disabled={isOpening}
                  className="inline-flex items-center gap-2 rounded-full bg-[#879b83] px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#71876e] disabled:cursor-wait disabled:opacity-70"
                >
                  <Mail size={17} />
                  {isOpening ? "Membuka Undangan..." : "Buka Undangan"}
                </button>

                <p className="mt-5 text-[10px] tracking-widest text-[#aaa49a]">
                  MOHON DOA RESTU DAN KEHADIRANNYA
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
