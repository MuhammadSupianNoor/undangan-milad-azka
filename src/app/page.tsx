
import Hero from "../components/Hero";
import Countdown from "../components/Countdown";
import EventDetails from "../components/EventDetails";
import Agenda from "../components/Agenda";
import Gallery from "../components/Gallery";
import ScrollReveal from "../components/ScrollReveal";
import InvitationExperience from "../components/InvitationExperience";
//import RSVP from "../components/RSVP";
import Guestbook from "../components/Guestbook";
import { Heart } from "lucide-react";

export default function Home() {
  return (
     <InvitationExperience>
    <main className="overflow-hidden">
      <ScrollReveal duration={1}>
        <Hero />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Countdown />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <EventDetails />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Agenda />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Gallery />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Guestbook />
      </ScrollReveal>

      {/* 4. Penutup Sementara */}
      <section
        id="pembuka"
        className="bg-[#faf9f6] px-6 py-20 text-center"
      >
        <Heart
          className="mx-auto mb-5 text-[#bd9b65]"
          size={32}
        />

        <h2 className="font-serif text-3xl text-[#596b56]">
          Terima Kasih
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-600">
          Merupakan kebahagiaan bagi kami apabila
          keluarga berkenan hadir dan berbagi
          kebahagiaan dalam syukuran milad Azka.
        </p>
      </section>
      
       
    </main>
    </InvitationExperience>
  );
}
