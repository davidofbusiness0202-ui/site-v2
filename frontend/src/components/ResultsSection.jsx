import { Trophy } from "lucide-react";
import { pad } from "../data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export const ResultsSection = ({ results }) => (
  <section id="resultado" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
    <SectionHeading
      number="03"
      title="Resultado"
      highlight="oficial"
      subtitle="Confira os 4 números sorteados e os ganhadores de cada prêmio."
    />
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {results.map((r, i) => (
        <Reveal key={r.prize} delay={i * 0.08}>
          <div
            data-testid={`result-card-${i}`}
            className="rounded-2xl border border-volt/30 bg-night-soft p-6 text-center"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-volt/40 bg-volt/10">
              <Trophy className="h-6 w-6 text-volt" />
            </span>
            <p className="mt-5 font-mono text-5xl font-black tabular-nums text-volt drop-shadow-[0_0_20px_rgba(255,212,0,0.4)]">
              {pad(r.number)}
            </p>
            <p className="mt-4 text-sm font-bold text-white">{r.prize}</p>
            <p data-testid={`result-winner-${i}`} className="mt-2 text-xs text-zinc-500">
              {r.winner_name ? (
                <>
                  Ganhador(a): <span className="font-semibold text-volt">{r.winner_name}</span>
                </>
              ) : (
                "Número não vendido"
              )}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);
