/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Product card with bilingual text, video link, and Telegram inquiry
 */

import { Product, STORE_CONFIG } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { openTelegramChat, hapticFeedback } from "@/lib/telegram";
import { Send, Eye, Play } from "lucide-react";
import { motion } from "framer-motion";

const BADGE_STYLES: Record<string, string> = {
  new: "bg-teal text-white",
  popular: "bg-terracotta text-white",
  limited: "bg-walnut text-white",
};

interface ProductCardProps {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, index, onViewDetails }: ProductCardProps) {
  const { language, t } = useLanguage();

  const name = language === "kh" ? product.name_kh : product.name;
  const desc = language === "kh" ? product.description_kh : product.description;

  const handleInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticFeedback("medium");
    openTelegramChat(
      STORE_CONFIG.telegramUsername,
      `Hi! I'm interested in: ${product.name} ($${product.price.toFixed(2)}). Is it available?`
    );
  };

  const handleVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.videoLink) {
      window.open(product.videoLink, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/40 cursor-pointer"
      onClick={() => {
        hapticFeedback("light");
        onViewDetails(product);
      }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-walnut/0 group-hover:bg-walnut/20 transition-colors duration-300 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
            className="p-2.5 bg-white/95 rounded-xl shadow-lg hover:bg-white transition-colors"
            title={t.products_view_details}
          >
            <Eye className="w-5 h-5 text-walnut" />
          </button>
          {product.videoLink && (
            <button
              onClick={handleVideo}
              className="p-2.5 bg-white/95 rounded-xl shadow-lg hover:bg-white transition-colors"
              title={t.detail_watch_video}
            >
              <Play className="w-5 h-5 text-terracotta" />
            </button>
          )}
          <button
            onClick={handleInquiry}
            className="p-2.5 bg-teal/95 rounded-xl shadow-lg hover:bg-teal transition-colors"
            title={t.products_ask_telegram}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-walnut text-base mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-walnut-light line-clamp-2 mb-3 leading-relaxed">
          {desc}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-teal text-lg">
            {STORE_CONFIG.currencySymbol}{product.price.toFixed(2)}
          </span>
          <button
            onClick={handleInquiry}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal/10 text-teal rounded-lg text-xs font-semibold hover:bg-teal hover:text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            {t.products_inquire}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
