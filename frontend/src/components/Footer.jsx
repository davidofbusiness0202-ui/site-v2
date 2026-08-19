import { Zap, Instagram, MessageCircle, ShieldCheck } from "lucide-react";
import { ADDRESS, INSTAGRAM_URL, WHATSAPP_URL } from "../data/site";

export const Footer = () => (
  <footer className="border-t border-white/10 bg-black">
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt text-night">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-black tracking-tight text-white">
              MQ<span className="text-volt">RIFA</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
            Rifa oficial da MQ Assistência. Kit premium completo por apenas R$ 5,00 o número.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-volt">Loja física</h4>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{ADDRESS}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-volt">Fale com a gente</h4>
          <div className="mt-4 flex gap-3">
            <a
              data-testid="footer-whatsapp-link"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors duration-300 hover:border-volt hover:text-volt"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              data-testid="footer-instagram-link"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors duration-300 hover:border-volt hover:text-volt"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-volt" />
            Sorteio transparente em até 30 dias.
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-zinc-600">
        © 2026 MQ Assistência — Todos os direitos reservados.
      </div>
    </div>
  </footer>
);
