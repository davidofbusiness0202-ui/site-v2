import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { brl } from "../data/site";

export const CheckoutBar = ({ count, total, visible, onCheckout }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        data-testid="checkout-bar"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-volt/40 bg-black/80 p-4 shadow-[0_0_40px_rgba(255,212,0,0.2)] backdrop-blur-xl">
          <div>
            <p data-testid="checkout-bar-count" className="font-display text-lg font-extrabold text-white">
              {count} {count === 1 ? "número" : "números"}
            </p>
            <p data-testid="checkout-bar-total" className="text-sm font-semibold text-volt">
              {brl(total)}
            </p>
          </div>
          <button
            data-testid="checkout-open-btn"
            onClick={onCheckout}
            className="group flex items-center gap-2 rounded-full bg-volt px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim active:scale-95"
          >
            Finalizar
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
