
"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  CheckCircle2,
  MessageCircle,
  Users,
  LoaderCircle,
} from "lucide-react";

import { invitation } from "../lib/invitation";

export default function RSVP() {
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<
    "Hadir" | "Tidak dapat hadir"
  >("Hadir");

  const [guestCount, setGuestCount] = useState("1");
  const [website, setWebsite] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // Validasi nama
    const name = guestName.trim();

    if (!name || name.length > 100) {
      setErrorMessage(
        "Nama wajib diisi dan maksimal 100 karakter."
      );
      return;
    }

    // Validasi jumlah orang
    const count =
      attendance === "Hadir" ? Number(guestCount) : 0;

    if (
      attendance === "Hadir" &&
      (!Number.isInteger(count) || count < 1 || count > 10)
    ) {
      setErrorMessage(
        "Jumlah orang harus antara 1 sampai 10."
      );
      return;
    }

    // Periksa konfigurasi
    if (
      !invitation.googleScriptUrl ||
      !invitation.googleScriptUrl.includes("/exec") ||
      !invitation.whatsappNumber
    ) {
      setErrorMessage(
        "Konfigurasi Google Apps Script atau WhatsApp belum benar."
      );
      return;
    }

    // Honeypot anti-spam
    if (website) {
      setErrorMessage("Permintaan tidak dapat diproses.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Siapkan pesan WhatsApp
      const whatsappMessage = [
        "Assalamu'alaikum.",
        "",
        "Saya ingin mengonfirmasi undangan Silaturahmi Keluarga sekaligus Syukuran Milad Azka ke-2 Tahun.",
        "",
        `Nama: ${name}`,
        `Konfirmasi: ${attendance}`,
        attendance === "Hadir"
          ? `Jumlah tamu: ${count} orang`
          : "",
        "",
        "Terima kasih atas undangannya.",
        "Wassalamu'alaikum.",
      ]
        .filter(Boolean)
        .join("\n");

      const whatsappUrl =
        `https://wa.me/${invitation.whatsappNumber}` +
        `?text=${encodeURIComponent(whatsappMessage)}`;

      // 2. Buat iframe tersembunyi
      const iframe = document.createElement("iframe");

      const iframeName =
        "rsvp-frame-" + Date.now();

      iframe.name = iframeName;
      iframe.style.display = "none";
      iframe.title = "Pengiriman data RSVP";

      // 3. Buat form POST
      const form = document.createElement("form");

      form.method = "POST";
      form.action = invitation.googleScriptUrl;
      form.target = iframeName;
      form.style.display = "none";

      // 4. Siapkan data yang dikirim ke Google Sheets
      const fields: Record<string, string> = {
        name: name,
        attendance: attendance,
        guestCount: String(count),
        website: "",
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = value;

        form.appendChild(input);
      });

      // 5. Masukkan iframe dan form ke halaman
      document.body.appendChild(iframe);
      document.body.appendChild(form);

      // 6. Kirim data ke Google Apps Script
      form.submit();

      // 7. Buka WhatsApp setelah jeda
      window.setTimeout(() => {
        form.remove();
        iframe.remove();

        window.location.href = whatsappUrl;
      }, 2500);

    } catch (error) {
      console.error("Gagal mengirim RSVP:", error);

      setErrorMessage(
        "Terjadi kesalahan saat mengirim data. Silakan coba lagi."
      );

      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="bg-[#f1ede3] px-5 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#879b83]">
            RSVP
          </p>

          <h2 className="font-serif text-3xl text-[#343c35] sm:text-4xl">
            Konfirmasi Kehadiran
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-[#bd9b65]" />

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#77766f]">
            Merupakan suatu kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara berkenan hadir. Mohon konfirmasi
            kehadiran melalui formulir berikut.
          </p>
        </div>

        {/* Form RSVP */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-[#e5dfd1] bg-white p-6 shadow-sm sm:p-8"
        >

          {/* Honeypot anti-spam */}
          <input
            type="text"
            value={website}
            onChange={(event) =>
              setWebsite(event.target.value)
            }
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px opacity-0"
          />

          {/* Nama tamu */}
          <div>
            <label
              htmlFor="guestName"
              className="mb-2 block text-sm font-medium text-[#343c35]"
            >
              Nama tamu
            </label>

            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(event) =>
                setGuestName(event.target.value)
              }
              placeholder="Masukkan nama Anda"
              maxLength={100}
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#e5dfd1] bg-[#fdfcf9] px-4 py-3 text-sm text-[#343c35] outline-none transition focus:border-[#879b83] focus:ring-2 focus:ring-[#879b83]/20 disabled:opacity-60"
            />
          </div>

          {/* Status kehadiran */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-[#343c35]">
              Konfirmasi kehadiran
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setAttendance("Hadir")}
                aria-pressed={attendance === "Hadir"}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                  attendance === "Hadir"
                    ? "border-[#879b83] bg-[#eaf0e7] text-[#52694f]"
                    : "border-[#e5dfd1] bg-white text-[#77766f]"
                }`}
              >
                <CheckCircle2 size={17} />
                Ya, saya hadir
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  setAttendance("Tidak dapat hadir")
                }
                aria-pressed={
                  attendance === "Tidak dapat hadir"
                }
                className={`rounded-xl border px-4 py-3 text-sm transition ${
                  attendance === "Tidak dapat hadir"
                    ? "border-[#bd9b65] bg-[#f7f0e5] text-[#8c7047]"
                    : "border-[#e5dfd1] bg-white text-[#77766f]"
                }`}
              >
                Tidak dapat hadir
              </button>

            </div>
          </div>

          {/* Jumlah tamu */}
          {attendance === "Hadir" && (
            <div className="mt-6">
              <label
                htmlFor="guestCount"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-[#343c35]"
              >
                <Users size={16} />
                Jumlah orang yang hadir
              </label>

              <select
                id="guestCount"
                value={guestCount}
                onChange={(event) =>
                  setGuestCount(event.target.value)
                }
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#e5dfd1] bg-[#fdfcf9] px-4 py-3 text-sm text-[#343c35] outline-none focus:border-[#879b83] disabled:opacity-60"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                  (number) => (
                    <option key={number} value={number}>
                      {number} orang
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Pesan error */}
          {errorMessage && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          {/* Tombol kirim */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#879b83] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#71876e] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  size={19}
                  className="animate-spin"
                />
                Mengirim konfirmasi...
              </>
            ) : (
              <>
                <MessageCircle size={19} />
                Kirim Konfirmasi WhatsApp
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-[#99958b]">
            Data konfirmasi akan dikirim ke Google Sheets.
            WhatsApp akan dibuka untuk mengirim pesan.
          </p>

        </form>
      </div>
    </section>
  );
}
