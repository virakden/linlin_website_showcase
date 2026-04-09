/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Product detail modal with bilingual text, Facebook inquiry, TikTok playlist
 */

import { Product, CATEGORIES } from "@/lib/products";
import { STORE_CONFIG } from "@/lib/store-config";
import { useLanguage } from "@/contexts/LanguageContext";
import { hapticFeedback, openExternalLink } from "@/lib/telegram";
import { X, Check, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  PROMOTION,
  isPromotionActive,
  getPromotionBadge,
} from "@/lib/promotions";

const BADGE_STYLES: Record<string, string> = {
  new: "bg-teal text-white",
  popular: "bg-terracotta text-white",
  limited: "bg-walnut text-white",
  "coming-soon": "bg-purple-500 text-white",
};

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

// Facebook SVG icon
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// TikTok SVG icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
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

  // Get TikTok playlist URL for this product's category
  const getPlaylistUrl = (): string | null => {
    if (!product) return null;
    const category = CATEGORIES.find(c => c.id === product.category);
    return category?.playlist || null;
  };

  const handleFacebookInquiry = () => {
    if (!product) return;
    hapticFeedback("medium");
    openExternalLink(STORE_CONFIG.facebook);
  };

  const handleTikTokPlaylist = () => {
    const playlistUrl = getPlaylistUrl();
    if (playlistUrl) {
      hapticFeedback("medium");
      openExternalLink(playlistUrl);
    }
  };

  const playlistUrl = product ? getPlaylistUrl() : null;

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
                {(product.badge || product.comingSoon) && (
                  <span
                    className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                      product.comingSoon
                        ? BADGE_STYLES["coming-soon"]
                        : BADGE_STYLES[product.badge || "new"]
                    }`}
                  >
                    {product.comingSoon
                      ? language === "kh"
                        ? "មកដល់ឆាប់ៗ"
                        : "Coming Soon"
                      : product.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-display font-bold text-xl md:text-2xl text-walnut leading-tight">
                    {language === "kh" ? product.name_kh : product.name}
                  </h2>
                  {product.comingSoon ? (
                    <span className="font-display font-bold text-xl md:text-2xl text-purple-500 whitespace-nowrap">
                      {STORE_CONFIG.currencySymbol}
                      {Math.floor(product.price / 10)}x
                    </span>
                  ) : isPromotionActive() ? (
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-md">
                        {getPromotionBadge(language)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-walnut-light line-through whitespace-nowrap">
                          {STORE_CONFIG.currencySymbol}
                          {product.price.toFixed(2)}
                        </span>
                        <span className="font-display font-bold text-xl md:text-2xl text-red-500 whitespace-nowrap">
                          {STORE_CONFIG.currencySymbol}
                          {(
                            product.price *
                            (1 - PROMOTION.discountPercent / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="font-display font-bold text-xl md:text-2xl text-teal whitespace-nowrap">
                      {STORE_CONFIG.currencySymbol}
                      {product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-walnut-light text-base leading-relaxed mb-4">
                  {language === "kh"
                    ? product.description_kh
                    : product.description}
                </p>

                {/* Stock status */}
                <div className="flex items-center gap-2 mb-5">
                  <Package
                    className={`w-4 h-4 ${product.comingSoon ? "text-purple-500" : "text-teal"}`}
                  />
                  <span
                    className={`text-sm font-medium ${product.comingSoon ? "text-purple-500" : "text-teal"}`}
                  >
                    {product.comingSoon
                      ? language === "kh"
                        ? "មកដល់ឆាប់ៗ"
                        : "Coming Soon"
                      : product.inStock
                        ? t.detail_in_stock
                        : t.detail_out_of_stock}
                  </span>
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

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {product.comingSoon ? (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-purple-100 text-purple-600 rounded-xl font-semibold text-sm sm:text-base cursor-not-allowed"
                    >
                      <Package className="w-5 h-5" />
                      <span className="whitespace-nowrap">
                        {language === "kh" ? "មកដល់ឆាប់ៗ" : "Coming Soon"}
                      </span>
                    </button>
                  ) : (
                    <>
                      {/* Facebook Button */}
                      <button
                        onClick={handleFacebookInquiry}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1877F2] text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-[#166FE5] transition-colors shadow-lg hover:shadow-xl"
                      >
                        <FacebookIcon className="w-5 h-5" />
                        <span className="whitespace-nowrap">
                          {language === "kh"
                            ? "សាកសួរក្នុង Facebook"
                            : "Ask on Facebook"}
                        </span>
                      </button>

                      {/* TikTok Button */}
                      {playlistUrl && (
                        <button
                          onClick={handleTikTokPlaylist}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-black text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                        >
                          <TikTokIcon className="w-5 h-5" />
                          <span className="whitespace-nowrap">
                            {language === "kh"
                              ? "មើលវីដេអូ TikTok"
                              : "Watch on TikTok"}
                          </span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                <p className="text-center text-xs text-walnut-light/70 mt-3">
                  {language === "kh"
                    ? "ចុចដើម្បីសាកសួរ ឬមើលវីដេអូផលិតផល"
                    : "Tap to inquire or watch product videos"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
