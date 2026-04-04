/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Product card with bilingual text, video link, and Telegram inquiry
 */

import { Product } from "@/lib/products";
import { STORE_CONFIG } from "@/lib/store-config";
import { useLanguage } from "@/contexts/LanguageContext";
import { openExternalLink, hapticFeedback } from "@/lib/telegram";
import { Eye, Play } from "lucide-react";
import {
  PROMOTION,
  isPromotionActive,
  getPromotionBadge,
  isCategoryInStock,
} from "@/lib/promotions";
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

// Facebook SVG icon
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function ProductCard({
  product,
  index,
  onViewDetails,
}: ProductCardProps) {
  const { language, t } = useLanguage();

  const name = language === "kh" ? product.name_kh : product.name;
  const desc = language === "kh" ? product.description_kh : product.description;

  const handleInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticFeedback("medium");
    openExternalLink(STORE_CONFIG.facebook_sros);
    `សួស្ដី! ខ្ញុំចង់កម្មង់: ${product.name} ($${product.price.toFixed(2)})។ សូមផ្តល់ព័ត៌មានបន្ថែម។`;
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
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
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
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}
          >
            {product.badge}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-walnut/0 group-hover:bg-walnut/20 transition-colors duration-300 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100">
          <button
            onClick={e => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 bg-white/95 rounded-xl shadow-lg hover:bg-white transition-colors"
            title={t.products_view_details}
          >
            <Eye className="w-6 h-6 text-walnut" />
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
          {/* <span className="font-display font-bold text-teal text-lg">
            {STORE_CONFIG.currencySymbol}
            {product.price.toFixed(2)}
          </span> */}
          {isPromotionActive() ? (
            <div className="flex flex-col gap-0.5">
              <span className="inline-block w-fit px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                {getPromotionBadge(language)}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-red-500 text-lg">
                  {STORE_CONFIG.currencySymbol}
                  {(
                    product.price *
                    (1 - PROMOTION.discountPercent / 100)
                  ).toFixed(2)}
                </span>
                <span className="text-xs text-walnut-light line-through">
                  {STORE_CONFIG.currencySymbol}
                  {product.price.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-display font-bold text-teal text-lg">
              {STORE_CONFIG.currencySymbol}
              {product.price.toFixed(2)}
            </span>
          )}
          <button
            onClick={handleInquiry}
            disabled={!isCategoryInStock(product.category)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
    ${
      !isCategoryInStock(product.category)
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-teal/10 text-teal hover:bg-teal hover:text-white"
    }`}
          >
            {!isCategoryInStock(product.category) ? (
              <span>{language === "kh" ? "ដាច់ស្ដុក" : "Out of Stock"}</span>
            ) : (
              <>
                <FacebookIcon className="w-3.5 h-3.5" />
                {t.products_inquire}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
