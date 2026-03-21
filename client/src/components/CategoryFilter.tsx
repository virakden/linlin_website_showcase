/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Category pills with bilingual labels — 7 categories
 * FIXED: Text overflow on mobile, better touch targets, horizontal scroll
 */

import { CATEGORIES } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutGrid,
  Milk,
  Amphora,
  Drama,
  Egg,
  Salad,
  Refrigerator,
} from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-4 h-4 flex-shrink-0" />,
  Milk: <Milk className="w-4 h-4 flex-shrink-0" />,
  Amphora: <Amphora className="w-4 h-4 flex-shrink-0" />,
  Drama: <Drama className="w-4 h-4 flex-shrink-0" />,
  Egg: <Egg className="w-4 h-4 flex-shrink-0" />,
  Salad: <Salad className="w-4 h-4 flex-shrink-0" />,
  Refrigerator: <Refrigerator className="w-4 h-4 flex-shrink-0" />,
};

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { language } = useLanguage();

  return (
    <div className="w-full overflow-hidden">
      {/* FIXED: Horizontal scrollable container with proper padding */}
      <div
        id="categories"
        className="flex gap-2 overflow-x-auto pb-3 px-1 -mx-1 scrollbar-hide scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          const label = language === "kh" ? cat.name_kh : cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                relative flex items-center gap-2 
                px-3 sm:px-4 py-2.5 
                rounded-xl text-sm font-medium 
                whitespace-nowrap flex-shrink-0
                transition-all duration-200 
                min-h-[44px]
                ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-walnut-light bg-white hover:bg-cream-dark border border-border/60 active:bg-cream-dark"
                }
              `}
              style={{
                // FIXED: Ensure minimum touch target size (44x44)
                minWidth: "fit-content",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-teal rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {ICON_MAP[cat.icon]}
                {/* FIXED: Truncate long Khmer text on very small screens */}
                <span className="max-w-[120px] sm:max-w-none truncate">
                  {label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Optional: Scroll indicator for mobile */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
