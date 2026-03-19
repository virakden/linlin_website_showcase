/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Navbar: Clean top navigation with store name and Telegram CTA
 * Warm cream bg, teal accents, Outfit display font
 */

import { STORE_CONFIG } from "@/lib/products";
import { openTelegramChat, isTelegramWebApp } from "@/lib/telegram";
import { Send, Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTg = isTelegramWebApp();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo / Store Name */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-walnut tracking-tight">
            {STORE_CONFIG.name}
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("products")}
            className="text-sm font-medium text-walnut-light hover:text-teal transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => scrollTo("categories")}
            className="text-sm font-medium text-walnut-light hover:text-teal transition-colors"
          >
            Categories
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="text-sm font-medium text-walnut-light hover:text-teal transition-colors"
          >
            About
          </button>
          {!isTg && (
            <button
              onClick={() =>
                openTelegramChat(
                  STORE_CONFIG.telegramUsername,
                  "Hi! I'm interested in your products."
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-dark transition-colors shadow-sm hover:shadow-md"
            >
              <Send className="w-4 h-4" />
              Message Us
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-walnut"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-cream border-b border-border/50"
          >
            <div className="container py-4 flex flex-col gap-3">
              <button
                onClick={() => scrollTo("products")}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-walnut hover:bg-cream-dark transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => scrollTo("categories")}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-walnut hover:bg-cream-dark transition-colors"
              >
                Categories
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-walnut hover:bg-cream-dark transition-colors"
              >
                About
              </button>
              {!isTg && (
                <button
                  onClick={() =>
                    openTelegramChat(
                      STORE_CONFIG.telegramUsername,
                      "Hi! I'm interested in your products."
                    )
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold mt-1"
                >
                  <Send className="w-4 h-4" />
                  Message Us on Telegram
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
