import { useState } from "react";
import { Search, Loader2, TicketX } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { pad, brl } from "../data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Lookup = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/orders/lookup`, { params: { phone } });
      setOrders(res.data.orders);
    } catch {
      toast.error("Telefone inválido. Confira e tente novamente.");
      setOrders(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consulta" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
      <SectionHeading
        number="03"
        title="Consulte seus"
        highlight="números"
        subtitle="Já comprou? Digite o telefone usado na reserva e veja todos os seus números."
      />

      <Reveal className="mx-auto max-w-2xl">
        <form
          onSubmit={search}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-night-soft p-4 sm:flex-row"
        >
          <input
            data-testid="lookup-phone-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            required
            minLength={8}
            placeholder="Digite seu telefone com DDD"
            className="flex-1 rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-volt focus:ring-2 focus:ring-volt/30"
          />
          <button
            data-testid="lookup-submit-btn"
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-volt px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim disabled:opacity-60 active:scale-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Consultar
          </button>
        </form>

        {orders !== null && (
          <div data-testid="lookup-results" className="mt-8 space-y-4">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-night-soft p-10 text-center">
                <TicketX className="h-10 w-10 text-zinc-600" />
                <p className="text-sm text-zinc-400">
                  Nenhuma reserva encontrada para este telefone.
                </p>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  data-testid={`lookup-order-${o.id}`}
                  className="rounded-2xl border border-white/10 bg-night-soft p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-lg font-bold text-white">{o.name}</p>
                    <span className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-volt">
                      {o.status === "aguardando_pagamento" ? "Aguardando pagamento" : o.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {o.numbers.map((n) => (
                      <span
                        key={n}
                        className="rounded bg-volt px-2 py-0.5 font-mono text-xs font-bold text-night"
                      >
                        {pad(n)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">
                    Total: {brl(o.total)} •{" "}
                    {new Date(o.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
};
