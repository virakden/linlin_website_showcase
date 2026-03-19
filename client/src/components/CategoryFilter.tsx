/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Category pills with bilingual labels
 */

import { CATEGORIES } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { LayoutGrid, Headphones, Shirt, Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const { language } = useLanguage();

  return (
    <div id="categories" className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const label = language === "kh" ? cat.name_kh : cat.name;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "text-white shadow-md"
                : "text-walnut-light bg-white hover:bg-cream-dark border border-border/60"
            }`}
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
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
