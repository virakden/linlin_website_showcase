/*
 * Design: "Bazaar Fresh" — Warm Marketplace Aesthetic
 * Home page: Hero → Categories → Product Grid → About → Footer
 * Warm cream bg, teal & terracotta accents, Outfit + Source Sans 3 fonts
 * Mobile-first, Telegram Mini App compatible
 */

import { useState, useMemo, useEffect } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { initTelegramWebApp } from "@/lib/telegram";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import TelegramFloatingButton from "@/components/TelegramFloatingButton";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initialize Telegram WebApp if running inside Telegram
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <HeroSection />

      {/* Products Section */}
      <section id="products" className="py-12 md:py-20">
        <div className="container">
          {/* Section Header */}
          <div className="mb-8">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-semibold rounded-full mb-4 uppercase tracking-wide"
            >
              Our Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-bold text-3xl md:text-4xl text-walnut mb-2"
            >
              Featured Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-walnut-light text-base"
            >
              Tap any product to see details, or inquire directly via Telegram.
            </motion.p>
          </div>

          {/* Search + Category Filters */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-walnut-light" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-xl text-sm text-walnut placeholder:text-walnut-light/50 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-walnut-light hover:text-walnut"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filter pills */}
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-cream-dark rounded-2xl flex items-center justify-center">
                <Search className="w-7 h-7 text-walnut-light" />
              </div>
              <h3 className="font-display font-semibold text-lg text-walnut mb-2">
                No products found
              </h3>
              <p className="text-walnut-light text-sm">
                Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4 px-4 py-2 bg-teal/10 text-teal rounded-lg text-sm font-medium hover:bg-teal hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <AboutSection />
      <Footer />
      <TelegramFloatingButton />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
