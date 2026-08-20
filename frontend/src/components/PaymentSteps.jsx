import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, MessageCircle, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { pad, brl, PIX_KEY, buildWhatsAppUrl, buildOrderText } from "../data/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const PaymentSteps = ({ order }) => {
  const [pix, setPix] = useState(null);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API}/pix`, { params: { amount: order.total, txid: order.id } })
      .then((r) => active && setPix(r.data))
      .catch(() => toast.error("Não foi possível gerar o código Pix."));
    return () => {
      active = false;
    };
  }, [order]);

  const orderText = buildOrderText(order);

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado!`);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <div className="space-y-5">
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

      <div className="rounded-xl border border-volt/40 bg-black/40 p-4">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-volt font-mono text-[10px] font-black text-night">
            1
          </span>
          Pague via Pix — o valor já vai preenchido
        </p>

        <div className="flex flex-col items-center gap-4">
          {pix ? (
            <img
              data-testid="pix-qr-code"
              src={pix.qr_base64}
              alt="QR Code Pix"
              className="h-44 w-44 rounded-xl bg-white p-2"
            />
          ) : (
            <div className="flex h-44 w-44 items-center justify-center rounded-xl bg-white/5">
              <Loader2 className="h-6 w-6 animate-spin text-volt" />
            </div>
          )}
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <QrCode className="h-3.5 w-3.5 text-volt" />
            Aponte a câmera do app do banco — valor exato: {brl(order.total)}
          </p>
        </div>

        <button
          data-testid="copy-pix-btn"
          onClick={() => pix && copy(pix.payload, "Código Pix copia e cola")}
          disabled={!pix}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-volt py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim disabled:opacity-60 active:scale-[0.98]"
        >
          <Copy className="h-4 w-4" /> Pix copia e cola ({brl(order.total)})
        </button>
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          Chave Pix (e-mail): {PIX_KEY} — MQ Assistência
        </p>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-volt font-mono text-[10px] font-black text-night">
            2
          </span>
          Envie o comprovante no WhatsApp
        </p>
        <a
          data-testid="whatsapp-confirm-btn"
          href={buildWhatsAppUrl(orderText)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-volt py-4 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim hover:shadow-[0_0_25px_rgba(255,212,0,0.4)]"
        >
          <MessageCircle className="h-4 w-4" /> Confirmar no WhatsApp
        </a>
        <button
          data-testid="copy-order-btn"
          onClick={() => copy(orderText, "Resumo do pedido")}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-volt hover:text-volt"
        >
          <Copy className="h-4 w-4" /> Copiar resumo do pedido
        </button>
      </div>
    </div>
  );
};
