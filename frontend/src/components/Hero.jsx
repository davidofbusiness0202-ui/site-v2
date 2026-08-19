import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Ticket, ShieldCheck, Clock, ChevronDown } from "lucide-react";
import { IMAGES } from "../data/site";
import { scrollToId } from "../utils/scroll";

const KineticLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

const useCountdown = (deadline) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(deadline).getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
};

const TimeBox = ({ value, label }) => (
  <div
    data-testid={`countdown-${label.toLowerCase()}`}
    className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 md:px-5 md:py-3 backdrop-blur-sm"
  >
    <span className="font-mono text-2xl md:text-4xl font-bold text-volt tabular-nums">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">{label}</span>
  </div>
);

export const Hero = ({ deadline }) => {
  const { scrollY } = useScroll();
  const yImg = useTransform(scrollY, [0, 700], [0, 140]);
  const { d, h, m, s } = useCountdown(deadline || Date.now() + 30 * 86400000);

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-16">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-volt/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-volt/5 blur-[100px]" />

      <motion.div
        style={{ y: yImg }}
        className="pointer-events-none absolute -right-24 top-1/2 hidden w-[46rem] -translate-y-1/2 opacity-25 lg:block"
      >
        <img
          src={IMAGES.charger}
          alt=""
          className="w-full [mask-image:radial-gradient(closest-side,black_40%,transparent)]"
        />
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-4 py-1.5"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-volt" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-volt">
            Rifa relâmpago • 500 números • até 30 dias
          </span>
        </motion.div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-white">
          <KineticLine delay={0.1}>A sorte</KineticLine>
          <KineticLine delay={0.25}>custa só</KineticLine>
          <KineticLine delay={0.4}>
            <span className="text-volt drop-shadow-[0_0_25px_rgba(255,212,0,0.35)]">
              R$ 5,00
            </span>
          </KineticLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-zinc-400"
        >
          Concorra a um <span className="text-white font-semibold">kit premium completo</span>:
          Smart Watch X10 Ultra 3, AirPods Pro 3ª geração, Carregador Turbo 120W Samsung e
          Caixa de Som Bluetooth à prova d'água. Pagamento fácil via Pix.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-cta-numeros"
            onClick={() => scrollToId("#numeros")}
            className="group flex items-center gap-3 rounded-full bg-volt px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim hover:shadow-[0_0_30px_rgba(255,212,0,0.45)] active:scale-95"
          >
            <Ticket className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
            Garantir meus números
          </button>
          <button
            data-testid="hero-cta-premios"
            onClick={() => scrollToId("#premios")}
            className="rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-volt hover:text-volt"
          >
            Ver prêmios
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-14"
        >
          <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
            <Clock className="h-4 w-4 text-volt" /> O sorteio acontece em
          </p>
          <div className="flex gap-2 md:gap-3">
            <TimeBox value={d} label="Dias" />
            <TimeBox value={h} label="Horas" />
            <TimeBox value={m} label="Min" />
            <TimeBox value={s} label="Seg" />
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-volt" />
            Sorteio transparente em até 30 dias ou antes, se todos os números forem vendidos.
          </p>
        </motion.div>
      </div>

      <motion.button
        data-testid="hero-scroll-indicator"
        onClick={() => scrollToId("#premios")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 transition-colors hover:text-volt"
        aria-label="Rolar para baixo"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.button>
    </section>
  );
};
