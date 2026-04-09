/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Home page: All sections assembled with bilingual support
 */

import { useState, useMemo } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import TelegramFloatingButton from "@/components/TelegramFloatingButton";
import ContactSection from "@/components/ContactSection";
import TelegramMiniAppSection from "@/components/TelegramMiniAppSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePagination } from "@/hooks/usePagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      if (!searchQuery.trim()) return matchesCategory;
      const query = searchQuery.toLowerCase();
      const name = language === "kh" ? p.name_kh : p.name;
      const desc = language === "kh" ? p.description_kh : p.description;
      const matchesSearch =
        name.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query); // always search English too
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, language]);

  const {
    paginatedData: pagedProducts,
    currentPage,
    totalPages,
    setCurrentPage,
  } = usePagination(filteredProducts, `${activeCategory}-${searchQuery}`);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <HeroSection />

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-10">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-4 uppercase tracking-wide"
            >
              {t.products_badge}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-bold text-3xl md:text-4xl text-walnut mb-3"
            >
              {t.products_title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-walnut-light text-base max-w-md mx-auto"
            >
              {t.products_subtitle}
            </motion.p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-walnut-light" />
            <input
              type="text"
              placeholder={t.products_search}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-xl text-sm text-walnut placeholder:text-walnut-light/60 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-walnut-light hover:text-walnut"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex justify-center">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {pagedProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-cream-dark rounded-2xl flex items-center justify-center">
                  <Search className="w-7 h-7 text-walnut-light/50" />
                </div>
                <h3 className="font-display font-semibold text-lg text-walnut mb-2">
                  {t.products_no_results}
                </h3>
                <p className="text-walnut-light text-sm mb-4">
                  {t.products_no_results_desc}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-4 py-2 bg-teal/10 text-teal rounded-lg text-sm font-medium hover:bg-teal/20 transition-colors"
                >
                  {t.products_clear_filters}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-border bg-white text-walnut disabled:opacity-30 hover:bg-cream-dark transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors
          ${
            currentPage === page
              ? "bg-teal text-white shadow-sm"
              : "border border-border bg-white text-walnut hover:bg-cream-dark"
          }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-border bg-white text-walnut disabled:opacity-30 hover:bg-cream-dark transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Telegram Mini App Section */}
      <TelegramMiniAppSection />

      {/* Contact Section */}
      <ContactSection />

      {/* About / How It Works */}
      <AboutSection />

      {/* Footer */}
      <Footer />

      {/* Floating Telegram Button */}
      <TelegramFloatingButton />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
