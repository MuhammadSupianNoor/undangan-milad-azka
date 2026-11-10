
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Images,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const photos = [
  "/images/azka-1.jpg",
  "/images/azka-2.jpg",
  "/images/azka-3.jpg",
  "/images/azka-4.jpg",
  "/images/azka-5.jpg",
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Menutup foto
  const closePhoto = () => {
    setActiveIndex(null);
  };

  // Foto sebelumnya
  const showPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return null;

      return (current - 1 + photos.length) % photos.length;
    });
  };

  // Foto berikutnya
  const showNext = () => {
    setActiveIndex((current) => {
      if (current === null) return null;

      return (current + 1) % photos.length;
    });
  };

  // Navigasi keyboard
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  // Mendeteksi sentuhan awal di HP
  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current = event.touches[0].clientX;
  };

  // Mendeteksi gerakan swipe
  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        showNext();
      } else {
        showPrevious();
      }
    }

    touchStartX.current = null;
  };

  return (
    <section
      id="galeri"
      className="bg-[#faf9f6] px-5 py-20"
    >
      <div className="mx-auto max-w-5xl">

        {/* Judul Galeri */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 25 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <div className="mb-3 flex justify-center text-[#879b83]">
            <Images size={30} strokeWidth={1.4} />
          </div>

          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#879b83]">
            Kenangan Kecil
          </p>

          <h2 className="font-serif text-3xl text-[#343c35] md:text-4xl">
            Galeri Azka
          </h2>

          <p className="mt-3 text-sm text-[#777]">
            Beberapa momen indah perjalanan kecil Azka.
          </p>
        </motion.div>

        {/* Daftar Foto */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {photos.map((photo, index) => (
            <motion.div
              key={photo}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 25,
                      scale: 0.97,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: shouldReduceMotion ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={
                index === 0
                  ? "md:col-span-2 md:row-span-2"
                  : ""
              }
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Lihat foto Azka ${index + 1}`}
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-[#e8e9e2]"
              >
                <Image
                  src={photo}
                  alt={`Foto Azka ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Efek saat hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
                  <span className="rounded-full bg-white/90 p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                    <Images
                      size={20}
                      className="text-[#596b58]"
                    />
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-[#999]">
          Ketuk foto untuk melihat ukuran lebih besar.
        </p>
      </div>

      {/* Lightbox / Foto Ukuran Besar */}
      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto Azka"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={closePhoto}
        >
          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={closePhoto}
            aria-label="Tutup galeri"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/30"
          >
            <X size={24} />
          </button>

          {/* Tombol Sebelumnya */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Foto sebelumnya"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/30 md:left-8"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Foto Besar */}
          <div
            className="relative h-[75vh] w-full max-w-5xl touch-pan-y"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              key={photos[activeIndex]}
              src={photos[activeIndex]}
              alt={`Foto Azka ${activeIndex + 1}`}
              fill
              sizes="100vw"
              priority
              className="object-contain"
            />
          </div>

          {/* Tombol Berikutnya */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Foto berikutnya"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/30 md:right-8"
          >
            <ChevronRight size={28} />
          </button>

          {/* Nomor Foto */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-2 text-sm text-white">
            {activeIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  );
}
