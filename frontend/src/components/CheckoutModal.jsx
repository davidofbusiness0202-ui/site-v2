import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, MessageCircle, PartyPopper, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { pad, brl, WHATSAPP_URL } from "../data/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const CheckoutModal = ({ open, numbers, onClose, onSuccess, onConflict }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const total = numbers.length * 5;

  const reset = () => {
    setOrder(null);
    setName("");
    setPhone("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/orders`, { name, phone, numbers });
      setOrder(res.data);
      onSuccess();
      toast.success("Números reservados com sucesso!");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 409 && detail?.numbers) {
        toast.error(
          `Os números ${detail.numbers.map(pad).join(", ")} acabaram de ser reservados.`
        );
        onConflict(detail.numbers);
      } else {
        toast.error(
          typeof detail === "string" ? detail : "Não foi possível reservar. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const orderText = order
    ? `Olá! Acabei de reservar meus números na Rifa MQ Assistência.\nNome: ${order.name}\nNúmeros: ${order.numbers.map(pad).join(", ")}\nTotal: ${brl(order.total)}\nVou enviar o comprovante do Pix para confirmar.`
    : "";

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      toast.success("Resumo do pedido copiado!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="checkout-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl border border-white/10 bg-night-soft p-6 sm:rounded-3xl md:p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-white">
                  {order ? "Reserva feita!" : "Finalizar reserva"}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {order
                    ? "Agora é só confirmar o pagamento no WhatsApp."
                    : `${numbers.length} ${numbers.length === 1 ? "número selecionado" : "números selecionados"} • ${brl(total)}`}
                </p>
              </div>
              <button
                data-testid="checkout-close-btn"
                onClick={handleClose}
                className="rounded-full border border-white/15 p-2 text-zinc-400 transition-colors hover:border-volt hover:text-volt"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!order ? (
              <form onSubmit={submit} className="space-y-4">
                <div className="max-h-28 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {numbers.map((n) => (
                      <span
                        key={n}
                        className="rounded bg-volt px-2 py-0.5 font-mono text-xs font-bold text-night"
                      >
                        {pad(n)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    Nome completo
                  </label>
                  <input
                    data-testid="checkout-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-volt focus:ring-2 focus:ring-volt/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    WhatsApp / Telefone
                  </label>
                  <input
                    data-testid="checkout-phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    minLength={8}
                    type="tel"
                    placeholder="(00) 90000-0000"
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-volt focus:ring-2 focus:ring-volt/30"
                  />
                </div>
                <button
                  data-testid="checkout-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-volt py-4 text-sm font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim hover:shadow-[0_0_25px_rgba(255,212,0,0.4)] disabled:opacity-60 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Reservar por {brl(total)}</>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3 rounded-xl border border-volt/40 bg-volt/10 p-4">
                  <PartyPopper className="h-8 w-8 shrink-0 text-volt" />
                  <p className="text-sm text-zinc-300">
                    <span className="font-bold text-white">{order.name}</span>, seus números
                    estão reservados! Envie o comprovante do Pix no WhatsApp para confirmar.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {order.numbers.map((n) => (
                      <span
                        key={n}
                        className="rounded bg-volt px-2 py-0.5 font-mono text-xs font-bold text-night"
                      >
                        {pad(n)}
                      </span>
                    ))}
                  </div>
                  <p data-testid="order-total" className="font-display text-xl font-extrabold text-volt">
                    Total: {brl(order.total)}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    data-testid="copy-order-btn"
                    onClick={copyOrder}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-volt hover:text-volt"
                  >
                    <Copy className="h-4 w-4" /> Copiar pedido
                  </button>
                  <a
                    data-testid="whatsapp-confirm-btn"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-volt py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim hover:shadow-[0_0_25px_rgba(255,212,0,0.4)]"
                  >
                    <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
