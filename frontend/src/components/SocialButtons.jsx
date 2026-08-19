import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";
import { INSTAGRAM_URL, WHATSAPP_URL } from "../data/site";

export const SocialButtons = () => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.6, duration: 0.6 }}
    className="fixed bottom-24 right-4 z-40 flex flex-col gap-3"
  >
    <a
      data-testid="social-whatsapp-btn"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="flex h-12 w-12 items-center justify-center rounded-full bg-volt text-night shadow-[0_0_20px_rgba(255,212,0,0.35)] transition-transform duration-300 hover:scale-110 active:scale-95"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
    <a
      data-testid="social-instagram-btn"
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Seguir no Instagram"
      className="flex h-12 w-12 items-center justify-center rounded-full border border-volt/40 bg-black/70 text-volt backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95"
    >
      <Instagram className="h-5 w-5" />
    </a>
  </motion.div>
);
