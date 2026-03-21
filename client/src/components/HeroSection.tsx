/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Hero: Full-width banner, dark overlay → white text, bilingual
 */

import { STORE_CONFIG } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { openTelegramChat } from "@/lib/telegram";
import { ArrowDown, Send } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMAGE = "/hero-cover.PNG";

export default function HeroSection() {
  const { language, t } = useLanguage();

  const title =
    language === "kh" ? STORE_CONFIG.tagline_kh : STORE_CONFIG.tagline;
  const desc =
    language === "kh" ? STORE_CONFIG.description_kh : STORE_CONFIG.description;

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-walnut/85 via-walnut/60 to-walnut/40" />
      </div>

      <div className="relative container py-24 md:py-36 lg:py-44">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block px-3 py-1 bg-terracotta/90 text-white text-xs font-semibold rounded-full mb-6 tracking-wide uppercase">
              {t.hero_badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-cream/90 text-lg md:text-xl leading-relaxed mb-8 max-w-md"
          >
            {desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={scrollToProducts}
              className="flex items-center gap-2 px-6 py-3 bg-white text-walnut rounded-xl font-semibold text-sm hover:bg-cream transition-colors shadow-lg hover:shadow-xl"
            >
              {t.hero_browse}
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                openTelegramChat(
                  STORE_CONFIG.telegramUsername,
                  "Hi! I found your store and I'm interested in your products."
                )
              }
              className="flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-xl font-semibold text-sm hover:bg-teal-dark transition-colors shadow-lg hover:shadow-xl"
            >
              <Send className="w-4 h-4" />
              {t.hero_chat_telegram}
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
