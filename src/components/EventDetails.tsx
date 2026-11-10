
import {
  CalendarDays,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { invitation } from "../lib/invitation";

export default function EventDetails() {
  const formattedDate = invitation.eventDate
    ? new Date(
        invitation.eventDate
      ).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Makassar",
      })
    : "Tanggal menyusul";

  const mapsLink =
    invitation.mapsUrl ||
    (invitation.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          invitation.address
        )}`
      : "");

  return (
    <section
  id="detail-acara"
  className="scroll-mt-6 bg-[#f1ede3] px-5 py-20"
>

      <div className="mx-auto max-w-xl text-center">

        <p className="text-xs uppercase tracking-[0.3em] text-[#879b83]">
          Detail Acara
        </p>

        <h2 className="mt-3 font-serif text-3xl text-[#596b56]">
          Waktu & Tempat
        </h2>

        <div className="mt-10 space-y-4">

          {/* Tanggal */}
          <div className="rounded-2xl bg-white p-6 text-left shadow-sm">
            <CalendarDays
              className="mb-3 text-[#bd9b65]"
              size={25}
            />

            <p className="text-xs text-gray-500">
              Hari dan Tanggal
            </p>

            <p className="mt-2 font-semibold text-[#596b56]">
              {formattedDate}
            </p>
          </div>

          {/* Waktu */}
          <div className="rounded-2xl bg-white p-6 text-left shadow-sm">
            <Clock
              className="mb-3 text-[#bd9b65]"
              size={25}
            />

            <p className="text-xs text-gray-500">
              Waktu Pelaksanaan
            </p>

            <p className="mt-2 font-semibold text-[#596b56]">
              {invitation.eventTime}
            </p>
          </div>

          {/* Lokasi */}
          <div className="rounded-2xl bg-white p-6 text-left shadow-sm">
            <MapPin
              className="mb-3 text-[#bd9b65]"
              size={25}
            />

            <p className="text-xs text-gray-500">
              Lokasi Acara
            </p>

            <p className="mt-2 font-semibold text-[#596b56]">
              {invitation.locationName}
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {invitation.address ||
                "Alamat acara menyusul"}
            </p>

            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#879b83] px-5 py-3 text-sm text-white transition hover:bg-[#6f856b]"
              >
                Buka Google Maps
                <ExternalLink size={16} />
              </a>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}
