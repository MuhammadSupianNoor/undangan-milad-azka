
"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { invitation } from "../lib/invitation";

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

export default function Countdown() {
  const [timeLeft, setTimeLeft] =
    useState<CountdownValue | null>(null);

  useEffect(() => {
    if (!invitation.eventDate) return;

    const targetDate = new Date(
      invitation.eventDate
    ).getTime();

    if (Number.isNaN(targetDate)) return;

    function updateCountdown() {
      const difference = targetDate - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
          (difference / 1000) % 60
        ),
        expired: false,
      });
    }

    updateCountdown();

    const timer = setInterval(
      updateCountdown,
      1000
    );

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#faf9f6] px-5 py-20">
      <div className="mx-auto max-w-xl text-center">

        <Clock
          size={30}
          className="mx-auto mb-5 text-[#bd9b65]"
        />

        <p className="text-xs uppercase tracking-[0.3em] text-[#879b83]">
          Save The Date
        </p>

        <h2 className="mt-3 font-serif text-3xl text-[#596b56]">
          Menuju Hari Bahagia
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-500">
          Kami menantikan momen kebersamaan
          bersama keluarga tercinta.
        </p>

        {!invitation.eventDate ? (
          <div className="mt-8 rounded-2xl border border-[#e7e0d3] bg-white p-6">
            <p className="text-sm text-[#879b83]">
              Tanggal acara akan diumumkan
            </p>
          </div>
        ) : timeLeft ? (
          <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-4">

            {[
              { label: "Hari", value: timeLeft.days },
              { label: "Jam", value: timeLeft.hours },
              { label: "Menit", value: timeLeft.minutes },
              { label: "Detik", value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#e7e0d3] bg-white px-2 py-5 shadow-sm"
              >
                <p className="text-2xl font-semibold text-[#596b56] sm:text-3xl">
                  {String(item.value).padStart(2, "0")}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {item.label}
                </p>
              </div>
            ))}

          </div>
        ) : (
          <p className="mt-8 text-sm text-gray-500">
            Memuat hitung mundur...
          </p>
        )}

        {timeLeft?.expired && (
          <p className="mt-5 text-sm text-[#879b83]">
            Waktu yang dinantikan telah tiba!
          </p>
        )}

      </div>
    </section>
  );
}
