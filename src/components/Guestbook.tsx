
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Heart, Send, LoaderCircle, RefreshCw } from "lucide-react";
import { invitation } from "../lib/invitation";

type Comment = {
  date: string;
  name: string;
  message: string;
};

type GuestbookResponse = {
  success: boolean;
  comments: Comment[];
  message?: string;
};

declare global {
  interface Window {
    azkaGuestbookCallback?: (data: GuestbookResponse) => void;
  }
}

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export default function Guestbook() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadComments = useCallback((): Promise<Comment[]> => {
    return new Promise((resolve, reject) => {
      if (!invitation.googleScriptUrl) {
        reject(new Error("URL Google Apps Script belum diatur."));
        return;
      }

      setLoading(true);
      setError("");

      const oldScript = document.getElementById(
        "azka-guestbook-script"
      );
      oldScript?.remove();

      let finished = false;

     const finish = (callback: () => void) => {
  if (finished) return;
  finished = true;

  window.clearTimeout(timeout);
  script.remove();

  // Jangan biarkan callback menjadi undefined.
  // Respons JSONP yang terlambat tidak akan menyebabkan TypeError.
  window.azkaGuestbookCallback = () => {};

  setLoading(false);
  callback();
};

      const script = document.createElement("script");
      script.id = "azka-guestbook-script";

      const timeout = window.setTimeout(() => {
  finish(() => {
    // Abaikan timeout agar tidak mengganggu tampilan undangan.
    // Ucapan yang sudah berhasil dimuat tetap ditampilkan.
    resolve(comments);
  });
}, 15000);

      window.azkaGuestbookCallback = (data) => {
        if (!data || !data.success) {
          finish(() => {
            const err = new Error(
              data?.message || "Gagal memuat ucapan."
            );
            setError(err.message);
            reject(err);
          });
          return;
        }

        const result = data.comments || [];

        finish(() => {
          setComments(result);
          resolve(result);
        });
      };

      const params = new URLSearchParams({
        callback: "azkaGuestbookCallback",
        _: String(Date.now()),
      });

      script.src =
        `${invitation.googleScriptUrl}?${params.toString()}`;

      script.onerror = () => {
        finish(() => {
          const err = new Error(
            "Tidak dapat mengambil data ucapan. Periksa URL Apps Script."
          );
          setError(err.message);
          reject(err);
        });
      };

      document.body.appendChild(script);
    });
  }, []);

  useEffect(() => {
    loadComments().catch(() => {});

    return () => {
      window.azkaGuestbookCallback = undefined;
      document
        .getElementById("azka-guestbook-script")
        ?.remove();
    };
  }, [loadComments]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const guestName = name.trim();
    const guestMessage = message.trim();

    if (!guestName || guestName.length > 100) {
      setError("Nama wajib diisi, maksimal 100 karakter.");
      return;
    }

    if (!guestMessage || guestMessage.length > 500) {
      setError("Ucapan wajib diisi, maksimal 500 karakter.");
      return;
    }

    if (!invitation.googleScriptUrl) {
      setError("URL Google Apps Script belum diatur.");
      return;
    }

    setSubmitting(true);

    const iframe = document.createElement("iframe");
    const iframeName = `azka-guestbook-${Date.now()}`;

    iframe.name = iframeName;
    iframe.style.display = "none";
    iframe.title = "Pengiriman ucapan";

    const form = document.createElement("form");

    form.method = "POST";
    form.action = invitation.googleScriptUrl;
    form.target = iframeName;
    form.enctype = "application/x-www-form-urlencoded";
    form.acceptCharset = "UTF-8";
    form.style.display = "none";

    const fields: Record<string, string> = {
      name: guestName,
      message: guestMessage,
      website: "",
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(iframe);
    document.body.appendChild(form);

    try {
      form.submit();

      // Beri kesempatan Apps Script menyimpan data.
      // Kemudian periksa kembali daftar dari Spreadsheet.
      let saved = false;

      for (let attempt = 0; attempt < 3; attempt++) {
        await wait(2000);

        try {
          const latestComments = await loadComments();

          saved = latestComments.some(
            (comment) =>
              comment.name.trim() === guestName &&
              comment.message.trim() === guestMessage
          );

          if (saved) break;
        } catch {
          // Coba membaca kembali pada percobaan berikutnya.
        }
      }

      if (saved) {
        setName("");
        setMessage("");
        setNotice(
          "Alhamdulillah, ucapan Anda berhasil tersimpan. Terima kasih atas doa untuk Azka."
        );
      } else {
        setError(
          "Ucapan belum ditemukan di Spreadsheet. Isi formulir Anda tetap dipertahankan. Silakan periksa koneksi dan deployment Apps Script."
        );
      }
    } catch {
      setError(
        "Terjadi kendala saat mengirim ucapan. Silakan coba kembali."
      );
    } finally {
      form.remove();
      iframe.remove();
      setSubmitting(false);
    }
  };

  return (
    <section
      id="ucapan"
      className="bg-[#faf9f6] px-5 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Heart
            size={25}
            className="mx-auto mb-4 text-[#879b83]"
          />

          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#879b83]">
            Doa dan Harapan
          </p>

          <h2 className="font-serif text-3xl text-[#343c35] sm:text-4xl">
            Ucapan & Doa
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-[#bd9b65]" />

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#77766f]">
            Kirimkan ucapan dan doa terbaik untuk Azka
            di hari istimewanya.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-[#e5dfd1] bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="guest-name"
              className="mb-2 block text-sm font-medium text-[#343c35]"
            >
              Nama Anda
            </label>

            <input
              id="guest-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Masukkan nama Anda"
              maxLength={100}
              required
              disabled={submitting}
              className="w-full rounded-xl border border-[#e5dfd1] bg-[#fdfcf9] px-4 py-3 text-sm text-[#343c35] outline-none transition focus:border-[#879b83] focus:ring-2 focus:ring-[#879b83]/20"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="guest-message"
              className="mb-2 block text-sm font-medium text-[#343c35]"
            >
              Ucapan dan doa
            </label>

            <textarea
              id="guest-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tuliskan ucapan dan doa terbaik untuk Azka..."
              maxLength={500}
              rows={5}
              required
              disabled={submitting}
              className="w-full resize-none rounded-xl border border-[#e5dfd1] bg-[#fdfcf9] px-4 py-3 text-sm leading-6 text-[#343c35] outline-none transition focus:border-[#879b83] focus:ring-2 focus:ring-[#879b83]/20"
            />

            <p className="mt-1 text-right text-xs text-[#aaa49a]">
              {message.length}/500 karakter
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {notice && (
            <p className="mt-4 rounded-lg bg-[#eaf0e7] p-3 text-sm text-[#52694f]">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#879b83] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:bg-[#71876e] disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Mengirim ucapan...
              </>
            ) : (
              <>
                <Send size={18} />
                Kirim Ucapan & Doa
              </>
            )}
          </button>
        </form>

        <div className="mt-14">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl text-[#343c35]">
                Doa untuk Azka
              </h3>

              <p className="mt-1 text-xs text-[#99958b]">
                {comments.length} ucapan tersimpan
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadComments().catch(() => {})}
              disabled={loading}
              aria-label="Muat ulang ucapan"
              className="flex items-center gap-2 rounded-full border border-[#e5dfd1] px-3 py-2 text-xs text-[#71876e] transition hover:bg-white"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Muat ulang
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {loading && (
              <div className="py-10 text-center text-sm text-[#99958b]">
                <LoaderCircle
                  size={22}
                  className="mx-auto mb-3 animate-spin"
                />
                Memuat ucapan...
              </div>
            )}

            {!loading && error && (
              <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">
                {error}
              </p>
            )}

            {!loading && !error && comments.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#d9d2c4] p-8 text-center">
                <Heart
                  size={25}
                  className="mx-auto mb-3 text-[#bd9b65]"
                />

                <p className="text-sm text-[#77766f]">
                  Belum ada ucapan. Jadilah yang pertama
                  mengirimkan doa untuk Azka.
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              comments.map((comment, index) => (
                <article
                  key={`${comment.date}-${index}`}
                  className="rounded-2xl border border-[#e5dfd1] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf0e7] font-serif text-lg text-[#71876e]">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-[#343c35]">
                        {comment.name}
                      </h4>

                      <p className="mt-1 text-xs text-[#aaa49a]">
                        {comment.date}
                      </p>
                    </div>

                    <Heart
                      size={16}
                      className="shrink-0 text-[#bd9b65]"
                    />
                  </div>

                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#77766f]">
                    {comment.message}
                  </p>
                </article>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
