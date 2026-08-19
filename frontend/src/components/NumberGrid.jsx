import { motion } from "framer-motion";
import { Dices, Eraser } from "lucide-react";
import { pad, brl } from "../data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const Legend = ({ color, label, testid }) => (
  <span data-testid={testid} className="flex items-center gap-2 text-xs text-zinc-400">
    <span className={`h-3.5 w-3.5 rounded ${color}`} />
    {label}
  </span>
);

export const NumberGrid = ({ raffle, selected, onToggle, onSurprise, onClear }) => {
  if (!raffle) {
    return (
      <section id="numeros" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <SectionHeading number="02" title="Escolha seus" highlight="números" />
        <div data-testid="numbers-loading" className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-volt border-t-transparent" />
        </div>
      </section>
    );
  }

  const taken = new Set(raffle.taken_numbers);
  const selectedSet = new Set(selected);
  const pct = Math.round((raffle.sold_count / raffle.total_numbers) * 100);

  return (
    <section id="numeros" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
      <SectionHeading
        number="02"
        title="Escolha seus"
        highlight="números da sorte"
        subtitle={`Cada número custa ${brl(raffle.price_per_number)}. Toque para selecionar quantos quiser — quanto mais números, mais chances de ganhar.`}
      />

      <Reveal className="mb-10 rounded-2xl border border-white/10 bg-night-soft p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p data-testid="sold-counter" className="font-display text-2xl font-extrabold text-white">
              {raffle.sold_count}{" "}
              <span className="text-sm font-medium text-zinc-500">
                de {raffle.total_numbers} vendidos
              </span>
            </p>
            <div className="mt-3 h-2.5 w-64 max-w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                data-testid="sold-progress-bar"
                className="h-full rounded-full bg-volt shadow-[0_0_12px_rgba(255,212,0,0.6)]"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              data-testid="surprise-5-btn"
              onClick={() => onSurprise(5)}
              className="flex items-center gap-2 rounded-full border border-volt/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-volt transition-colors duration-300 hover:bg-volt hover:text-night"
            >
              <Dices className="h-4 w-4" /> 5 aleatórios
            </button>
            <button
              data-testid="surprise-10-btn"
              onClick={() => onSurprise(10)}
              className="flex items-center gap-2 rounded-full border border-volt/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-volt transition-colors duration-300 hover:bg-volt hover:text-night"
            >
              <Dices className="h-4 w-4" /> 10 aleatórios
            </button>
            <button
              data-testid="clear-selection-btn"
              onClick={onClear}
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 transition-colors duration-300 hover:border-white/40 hover:text-white"
            >
              <Eraser className="h-4 w-4" /> Limpar
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-5 border-t border-white/10 pt-4">
          <Legend color="bg-zinc-800" label="Disponível" testid="legend-available" />
          <Legend color="bg-volt" label="Selecionado" testid="legend-selected" />
          <Legend color="bg-red-500/70" label="Reservado" testid="legend-taken" />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          data-testid="numbers-grid"
          className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10"
        >
          {Array.from({ length: raffle.total_numbers }, (_, i) => i + 1).map((n) => {
            const isTaken = taken.has(n);
            const isSelected = selectedSet.has(n);
            return (
              <button
                key={n}
                data-testid={`number-${pad(n)}`}
                disabled={isTaken}
                onClick={() => onToggle(n)}
                className={`flex aspect-square items-center justify-center rounded-md font-mono text-[11px] font-bold transition-colors duration-200 md:text-xs ${
                  isTaken
                    ? "cursor-not-allowed bg-red-500/15 text-red-400/60 line-through"
                    : isSelected
                      ? "bg-volt text-night shadow-[0_0_12px_rgba(255,212,0,0.5)]"
                      : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-volt"
                }`}
              >
                {pad(n)}
              </button>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
};
