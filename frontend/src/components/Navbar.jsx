import { Zap } from "lucide-react";
import { scrollToId } from "../utils/scroll";

const LINKS = [
  { label: "Prêmios", target: "#premios" },
  { label: "Números", target: "#numeros" },
  { label: "Consulta", target: "#consulta" },
  { label: "Loja Física", target: "#localizacao" },
];

export const Navbar = () => (
  <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
      <button
        data-testid="nav-logo"
        onClick={() => window.__lenis?.scrollTo(0)}
        className="flex items-center gap-2 group"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt text-night transition-transform duration-300 group-hover:rotate-12">
          <Zap className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <span className="font-display text-xl font-black tracking-tight text-white">
          MQ<span className="text-volt">RIFA</span>
        </span>
      </button>

      <nav className="hidden items-center gap-8 md:flex">
        {LINKS.map((l) => (
          <button
            key={l.target}
            data-testid={`nav-link-${l.target.slice(1)}`}
            onClick={() => scrollToId(l.target)}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-300 hover:text-volt"
          >
            {l.label}
          </button>
        ))}
      </nav>

      <button
        data-testid="nav-cta-participar"
        onClick={() => scrollToId("#numeros")}
        className="rounded-full bg-volt px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim hover:shadow-[0_0_20px_rgba(255,212,0,0.4)]"
      >
        Participar
      </button>
    </div>
  </header>
);
