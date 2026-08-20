import { useState } from "react";
import { motion } from "framer-motion";
import { Dices, Trophy, ArrowLeft, AlertTriangle, UserCheck, UserX } from "lucide-react";
import { pad } from "../../data/site";

const PrizeDraw = ({ index, prize, winner, holder }) => {
  const [display, setDisplay] = useState(null);
  const [phase, setPhase] = useState("idle");

  const spin = () => {
    if (phase === "spinning" || winner == null) return;
    setPhase("spinning");
    let ticks = 0;
    const total = 60;
    const tick = () => {
      ticks++;
      setDisplay(1 + Math.floor(Math.random() * 500));
      if (ticks >= total) {
        setDisplay(winner);
        setPhase("done");
        return;
      }
      setTimeout(tick, 45 + Math.pow(ticks / total, 2.2) * 260);
    };
    setTimeout(tick, 45);
  };

  return (
    <div
      data-testid={`draw-prize-${index}`}
      className="rounded-2xl border border-white/10 bg-night-soft p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-white">
          <span className="mr-2 font-mono text-volt">{String(index + 1).padStart(2, "0")}</span>
          {prize}
        </p>
        {phase === "done" && <Trophy className="h-5 w-5 text-volt" />}
      </div>

      <div className="mt-5 flex h-36 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60">
        {winner == null ? (
          <p className="px-4 text-center text-xs text-zinc-600">
            Defina o número ganhador no painel para liberar o sorteio
          </p>
        ) : display == null ? (
          <p className="font-mono text-sm tracking-[0.3em] text-zinc-600">? ? ?</p>
        ) : (
          <motion.span
            key={`${phase}-${display}`}
            data-testid={`roulette-number-${index}`}
            initial={phase === "done" ? { scale: 0.4, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className={`font-mono font-black tabular-nums transition-[text-shadow,color] duration-300 ${
              phase === "spinning"
                ? "text-5xl text-zinc-500 blur-[1px] md:text-6xl"
                : "text-6xl text-volt drop-shadow-[0_0_30px_rgba(255,212,0,0.6)] md:text-7xl"
            }`}
          >
            {pad(display)}
          </motion.span>
        )}
      </div>

      {phase === "spinning" && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-pulse rounded-full bg-volt/60" />
        </div>
      )}

      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 rounded-lg border border-volt/30 bg-volt/10 px-3 py-2"
          data-testid={`draw-result-${index}`}
        >
          {holder ? (
            <>
              <UserCheck className="h-4 w-4 shrink-0 text-volt" />
              <p className="text-xs text-zinc-300">
                Ganhador: <span className="font-bold text-white">{holder.name}</span> •{" "}
                {holder.phone} •{" "}
                <span className={holder.status === "pago" ? "text-emerald-400" : "text-volt"}>
                  {holder.status === "pago" ? "pago" : "aguardando pagamento"}
                </span>
              </p>
            </>
          ) : (
            <>
              <UserX className="h-4 w-4 shrink-0 text-zinc-500" />
              <p className="text-xs text-zinc-500">Número não vendido — sem ganhador</p>
            </>
          )}
        </motion.div>
      )}

      <button
        data-testid={`spin-btn-${index}`}
        onClick={spin}
        disabled={winner == null || phase === "spinning"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-volt py-3 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim hover:shadow-[0_0_20px_rgba(255,212,0,0.4)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
      >
        <Dices className={`h-4 w-4 ${phase === "spinning" ? "animate-spin" : ""}`} />
        {phase === "spinning" ? "Sorteando..." : phase === "done" ? "Sortear novamente" : "Sortear"}
      </button>
    </div>
  );
};

export const DrawPanel = ({ prizes, winners, orders, onBack }) => {
  const holderOf = (n) => orders.find((o) => o.numbers.includes(Number(n)));
  const missing = winners.filter((w) => w == null).length;

  return (
    <main data-testid="draw-panel" className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <button
        data-testid="draw-back-btn"
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-volt"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao painel
      </button>

      <div className="mb-10 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-volt text-night">
          <Dices className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
            Sorteio <span className="text-volt">ao vivo</span>
          </h2>
        </div>
      </div>

      {missing > 0 && (
        <div
          data-testid="draw-missing-warning"
          className="mb-8 flex items-center gap-3 rounded-xl border border-volt/40 bg-volt/10 p-4"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-volt" />
          <p className="text-sm text-zinc-300">
            {missing === 4
              ? "Você ainda não definiu nenhum número ganhador. Volte ao painel e preencha os 4 números."
              : `Faltam ${missing} ${missing === 1 ? "número ganhador" : "números ganhadores"} para completar os 4 prêmios.`}
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {prizes.map((prize, i) => (
          <PrizeDraw
            key={prize}
            index={i}
            prize={prize}
            winner={winners[i]}
            holder={winners[i] != null ? holderOf(winners[i]) : null}
          />
        ))}
      </div>
    </main>
  );
};
