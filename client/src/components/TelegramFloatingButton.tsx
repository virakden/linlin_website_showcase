/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Floating Telegram CTA button — bottom-right corner
 * Bounces on first load, then settles. Hidden in Telegram Mini App context.
 */

import { STORE_CONFIG } from "@/lib/products";
import { openTelegramChat, isTelegramWebApp } from "@/lib/telegram";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export default function TelegramFloatingButton() {
  const { t } = useLanguage();
  // Don't show floating button inside Telegram Mini App
  if (isTelegramWebApp()) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        openTelegramChat(
          STORE_CONFIG.telegramUsername,
          "Hi! I'm browsing your store and have a question."
        )
      }
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 bg-[#2AABEE] text-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow font-semibold text-sm"
      aria-label="Message us on Telegram"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
      <span className="hidden sm:inline">{t.hero_chat_telegram}</span>
      <Send className="w-4 h-4 sm:hidden" />
    </motion.button>
  );
}
