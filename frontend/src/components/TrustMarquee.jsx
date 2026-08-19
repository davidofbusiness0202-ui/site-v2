import Marquee from "react-fast-marquee";
import { Zap } from "lucide-react";

const ITEMS = [
  "Compra segura",
  "Sorteio garantido",
  "4 números ganhadores",
  "Apenas R$ 5,00 o número",
  "Pagamento via Pix",
  "Só 500 números",
];

export const TrustMarquee = () => (
  <div className="relative z-10 -rotate-1 scale-[1.02] border-y-4 border-night bg-volt py-3 shadow-[0_0_40px_rgba(255,212,0,0.25)]">
    <Marquee speed={35} gradient={false} data-testid="trust-marquee">
      {ITEMS.map((item) => (
        <span
          key={item}
          className="mx-6 flex items-center gap-6 font-display text-sm md:text-base font-extrabold uppercase tracking-[0.2em] text-night"
        >
          {item}
          <Zap className="h-4 w-4" strokeWidth={3} />
        </span>
      ))}
    </Marquee>
  </div>
);
