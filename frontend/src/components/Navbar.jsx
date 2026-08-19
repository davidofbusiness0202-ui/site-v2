import { User } from "lucide-react";
import { Link } from "react-router-dom";
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
        className="flex items-center gap-3 group"
      >
        <img
          src="/images/mq-logo.png"
          alt="MQ Assistência"
          className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
        />
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

      <div className="flex items-center gap-3">
        <Link
          data-testid="nav-admin-btn"
          to="/admin"
          aria-label="Área do administrador"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-colors duration-300 hover:border-volt hover:text-volt"
        >
          <User className="h-4 w-4" />
        </Link>
        <button
          data-testid="nav-cta-participar"
          onClick={() => scrollToId("#numeros")}
          className="rounded-full bg-volt px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim hover:shadow-[0_0_20px_rgba(255,212,0,0.4)]"
        >
          Participar
        </button>
      </div>
    </div>
  </header>
);
