import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { PRIZES } from "../data/site";
import { SectionHeading } from "./SectionHeading";

export const Prizes = () => (
  <section id="premios" className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
    <SectionHeading
      number="01"
      title="Quatro números."
      highlight="Quatro ganhadores."
      subtitle="Serão sorteados 4 números e cada um leva um prêmio premium da MQ Assistência. Por apenas R$ 5,00 por número, você tem 4 chances de ganhar."
    />

    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      {PRIZES.map((p, i) => (
        <motion.article
          key={p.tag}
          data-testid={`prize-card-${p.tag}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-night-soft ${p.span}`}
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 z-10 h-48 w-96 -translate-x-1/2 rounded-full bg-volt/20 blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="h-72 overflow-hidden md:h-96">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-20">
            <span className="font-mono text-xs font-bold text-volt">{p.tag}</span>
            <h3 className="mt-1 font-display text-xl md:text-2xl font-extrabold tracking-tight text-white">
              {p.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">{p.detail}</p>
          </div>
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 backdrop-blur-md">
            <Gift className="h-4 w-4 text-volt" />
          </span>
        </motion.article>
      ))}
    </div>
  </section>
);
