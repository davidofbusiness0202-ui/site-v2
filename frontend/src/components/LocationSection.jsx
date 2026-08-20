import { MapPin, ExternalLink } from "lucide-react";
import { ADDRESS, MAPS_EMBED, MAPS_LINK } from "../data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export const LocationSection = () => (
  <section id="localizacao" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
    <SectionHeading
      number="05"
      title="Loja física"
      highlight="de verdade"
      subtitle="A rifa é da MQ Assistência, uma loja real que você pode visitar. Transparência total: passe lá, conheça os prêmios e compre seu número pessoalmente."
    />

    <div className="grid gap-6 md:grid-cols-12">
      <Reveal className="md:col-span-5">
        <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-night-soft p-8">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-volt text-night">
              <MapPin className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white">
              MQ Assistência
            </h3>
            <p data-testid="store-address" className="mt-3 leading-relaxed text-zinc-400">
              {ADDRESS}
            </p>
          </div>
          <a
            data-testid="open-maps-btn"
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-volt/50 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-volt transition-colors duration-300 hover:bg-volt hover:text-night"
          >
            Abrir no Google Maps <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="md:col-span-7">
        <div className="h-80 overflow-hidden rounded-2xl border border-white/10 md:h-full md:min-h-[24rem]">
          <iframe
            data-testid="store-map"
            title="Localização da MQ Assistência"
            src={MAPS_EMBED}
            className="h-full w-full grayscale-[0.4] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </Reveal>
    </div>
  </section>
);
