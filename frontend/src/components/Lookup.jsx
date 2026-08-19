import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, TicketX, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { pad, brl } from "../data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { PaymentSteps } from "./PaymentSteps";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Lookup = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payOrder, setPayOrder] = useState(null);

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
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                        o.status === "pago"
                          ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                          : "border border-volt/40 bg-volt/10 text-volt"
                      }`}
                    >
                      {o.status === "pago" ? "Pago" : "Aguardando pagamento"}
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
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-zinc-500">
                      Total: {brl(o.total)} •{" "}
                      {new Date(o.created_at).toLocaleDateString("pt-BR")}
                    </p>
                    {o.status !== "pago" && (
                      <button
                        data-testid={`pay-order-${o.id}`}
                        onClick={() => setPayOrder(o)}
                        className="flex items-center gap-2 rounded-full bg-volt px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim active:scale-95"
                      >
                        <Wallet className="h-3.5 w-3.5" /> Pagar agora
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Reveal>

      <AnimatePresence>
        {payOrder && (
          <motion.div
            data-testid="payment-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setPayOrder(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-night-soft p-6 sm:rounded-3xl md:p-8"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-white">
                    Pagamento
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {payOrder.name} • {payOrder.numbers.length}{" "}
                    {payOrder.numbers.length === 1 ? "número" : "números"}
                  </p>
                </div>
                <button
                  data-testid="payment-close-btn"
                  onClick={() => setPayOrder(null)}
                  className="rounded-full border border-white/15 p-2 text-zinc-400 transition-colors hover:border-volt hover:text-volt"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <PaymentSteps order={payOrder} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
