
import { Clock, CalendarDays } from "lucide-react";

const agenda = [
  {
    time: "14.00 WITA",
    title: "Kedatangan Keluarga",
    description: "Menyambut keluarga yang hadir.",
  },
  {
    time: "14.15 WITA",
    title: "Pembukaan",
    description: "Acara dibuka dengan doa bersama.",
  },
  {
    time: "14.30 WITA",
    title: "Syukuran Milad Azka",
    description: "Doa dan ungkapan syukur atas bertambahnya usia Azka.",
  },
  {
    time: "15.00 WITA",
    title: "Makan Bersama",
    description: "Menikmati hidangan dan berkumpul bersama keluarga.",
  },
  {
    time: "16.00 WITA",
    title: "Penutup",
    description: "Sesi foto dan ramah tamah keluarga.",
  },
];

export default function Agenda() {
  return (
    <section
      id="susunan-acara"
      className="bg-[#faf9f6] px-5 py-20"
    >
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <CalendarDays
            size={30}
            className="mx-auto mb-5 text-[#bd9b65]"
          />

          <p className="text-xs uppercase tracking-[0.3em] text-[#879b83]">
            Rundown Acara
          </p>

          <h2 className="mt-3 font-serif text-3xl text-[#596b56]">
            Susunan Acara
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            Berikut rangkaian kegiatan dalam acara
            silaturahmi keluarga dan syukuran milad Azka.
          </p>
        </div>

        <div className="relative mt-12 space-y-8">
          {agenda.map((item, index) => (
            <div
              key={item.title}
              className="relative flex gap-5"
            >
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#879b83] text-white">
                  <Clock size={18} />
                </div>

                {index !== agenda.length - 1 && (
                  <div className="absolute mt-10 h-full w-px bg-[#d9dfd4]" />
                )}
              </div>

              <div className="flex-1 rounded-2xl border border-[#e7e0d3] bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-wide text-[#bd9b65]">
                  {item.time}
                </p>

                <h3 className="mt-2 font-serif text-xl text-[#596b56]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
