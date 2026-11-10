import Image from "next/image";
import { invitation } from "../lib/invitation";

import {
  Heart,
  CalendarDays,
  MapPin,
  ArrowDown,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf9f6] px-5 py-16">

      {/* Decorative Background */}
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#e5ebdf] opacity-60 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#eee5d6] opacity-70 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Small Heading */}
        <div className="mb-7">
          <Sparkles
            size={25}
            className="mx-auto mb-4 text-[#bd9b65]"
          />

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#879b83]">
            Undangan Silaturahmi Keluarga
          </p>
        </div>

        {/* Photo */}
        <div className="relative mx-auto mb-8 h-[340px] w-[270px] sm:h-[390px] sm:w-[310px]">

          {/* Outer Decoration */}
          <div className="absolute -inset-3 rotate-3 rounded-[160px_160px_30px_30px] border border-[#bd9b65]/50" />

          {/* Image */}
          <div className="relative h-full w-full overflow-hidden rounded-[160px_160px_30px_30px] border-[5px] border-white shadow-xl">

            <Image
              src="/images/azka-cover.jpeg"
              alt="Foto Azka dalam undangan milad kedua"
              fill
              priority
              sizes="(max-width: 640px) 270px, 310px"
              className="object-cover"
            />

          </div>

          {/* Photo Badge */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-6 py-3 shadow-lg">
            <p className="text-xs font-medium tracking-widest text-[#879b83]">
              OUR LITTLE BLESSING
            </p>
          </div>

        </div>

        {/* Invitation Title */}
        <div className="mt-12">

          <p className="text-xs uppercase tracking-[0.25em] text-[#bd9b65]">
            Syukuran Milad
          </p>

          <h1 className="mt-3 font-serif text-5xl text-[#596b56] sm:text-6xl">
            Azka
          </h1>

          <p className="mt-3 text-sm tracking-[0.35em] text-[#879b83]">
            KE-2 TAHUN
          </p>

          <div className="my-6 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#bd9b65]" />
            <Heart size={16} className="text-[#bd9b65]" />
            <div className="h-px w-10 bg-[#bd9b65]" />
          </div>

          <p className="mx-auto max-w-sm text-sm leading-7 text-gray-600">
            Dengan penuh rasa syukur, kami mengundang
            keluarga untuk hadir dalam acara silaturahmi
            sekaligus syukuran milad putra kami tercinta.
          </p>

        </div>

        {/* Event Information */}
        <div className="mt-7 flex flex-col items-center gap-3 text-sm text-[#596b56]">

          <div className="flex items-center gap-2">
            <CalendarDays size={17} />
            <span>
                {invitation.eventDate
    ? new Date(invitation.eventDate).toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Makassar",
        }
      )
    : "Tanggal dan waktu menyusul"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={17} />
            <span>{invitation.locationName}</span>
          </div>

        </div>

        {/* Button */}
        <a
          href="#detail-acara"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#879b83] px-8 py-3.5 text-sm font-medium text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#6f856b]"
        >
          Detail Acara
          <ArrowDown size={17} />
        </a>

      </div>

    </section>
  );
}
