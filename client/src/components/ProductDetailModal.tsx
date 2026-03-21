/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Product detail modal with bilingual text, video link, Telegram inquiry
 */

import { Product } from "@/lib/products";
import { STORE_CONFIG } from "@/lib/store-config";
import { useLanguage } from "@/contexts/LanguageContext";
import { openTelegramChat, hapticFeedback } from "@/lib/telegram";
import { X, Send, Check, Package, Play, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const BADGE_STYLES: Record<string, string> = {
  new: "bg-teal text-white",
  popular: "bg-terracotta text-white",
  limited: "bg-walnut text-white",
};

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const { language, t } = useLanguage();

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  const handleInquiry = () => {
    if (!product) return;
    hapticFeedback("medium");
    openTelegramChat(
      STORE_CONFIG.telegramUsername,
      `Hi! I'd like to order: ${product.name} (${STORE_CONFIG.currencySymbol}${product.price.toFixed(2)}). Can you help me?`
    );
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-walnut/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full"
          >
            <div className="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="md:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-border rounded-full" />
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-walnut" />
              </button>

              {/* Product Image */}
              <div className="relative aspect-square md:aspect-[4/3] overflow-hidden bg-cream-dark md:rounded-t-2xl">
                <img
                  src={product.image}
                  alt={language === "kh" ? product.name_kh : product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span
                    className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-display font-bold text-xl md:text-2xl text-walnut leading-tight">
                    {language === "kh" ? product.name_kh : product.name}
                  </h2>
                  <span className="font-display font-bold text-xl md:text-2xl text-teal whitespace-nowrap">
                    {STORE_CONFIG.currencySymbol}
                    {product.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-walnut-light text-base leading-relaxed mb-4">
                  {language === "kh"
                    ? product.description_kh
                    : product.description}
                </p>

                {/* Stock + Video Link row */}
                <div className="flex items-center gap-4 mb-5 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-teal" />
                    <span className="text-sm font-medium text-teal">
                      {product.inStock
                        ? t.detail_in_stock
                        : t.detail_out_of_stock}
                    </span>
                  </div>
                  {product.videoLink && (
                    <a
                      href={product.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-terracotta/10 text-terracotta rounded-lg text-sm font-semibold hover:bg-terracotta hover:text-white transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {t.detail_watch_video}
                      {product.videoSource && (
                        <span className="text-xs opacity-75">
                          ({product.videoSource})
                        </span>
                      )}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Details list */}
                {(() => {
                  const details =
                    language === "kh" ? product.details_kh : product.details;
                  return details && details.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="font-display font-semibold text-sm text-walnut mb-3 uppercase tracking-wide">
                        {t.detail_product_details}
                      </h3>
                      <ul className="space-y-2">
                        {details.map((detail, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2.5 text-sm text-walnut-light"
                          >
                            <Check className="w-4 h-4 text-teal flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}

                {/* CTA Button */}
                <button
                  onClick={handleInquiry}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-teal text-white rounded-xl font-semibold text-base hover:bg-teal-dark transition-colors shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  {t.detail_ask_product}
                </button>
                <p className="text-center text-xs text-walnut-light/70 mt-3">
                  {t.detail_opens_telegram}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
