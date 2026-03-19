/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Product detail modal: Slides up from bottom on mobile (Telegram-native feel)
 * Full product info, image gallery, inquiry CTA
 */

import { Product, STORE_CONFIG } from "@/lib/products";
import { openTelegramChat, hapticFeedback } from "@/lib/telegram";
import { X, Send, Check, Package } from "lucide-react";
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
  // Lock body scroll when modal is open
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-walnut/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — slides up on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full"
          >
            <div className="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Drag handle (mobile) */}
              <div className="md:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-border rounded-full" />
              </div>

              {/* Close button */}
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
                  alt={product.name}
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
                    {product.name}
                  </h2>
                  <span className="font-display font-bold text-xl md:text-2xl text-teal whitespace-nowrap">
                    {STORE_CONFIG.currencySymbol}
                    {product.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-walnut-light text-base leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Stock status */}
                <div className="flex items-center gap-2 mb-5">
                  <Package className="w-4 h-4 text-teal" />
                  <span className="text-sm font-medium text-teal">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Details list */}
                {product.details && product.details.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-display font-semibold text-sm text-walnut mb-3 uppercase tracking-wide">
                      Product Details
                    </h3>
                    <ul className="space-y-2">
                      {product.details.map((detail, i) => (
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
                )}

                {/* CTA Button */}
                <button
                  onClick={handleInquiry}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-teal text-white rounded-xl font-semibold text-base hover:bg-teal-dark transition-colors shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  Ask About This Product
                </button>

                <p className="text-center text-xs text-walnut-light/70 mt-3">
                  Opens a chat on Telegram with product details pre-filled
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
