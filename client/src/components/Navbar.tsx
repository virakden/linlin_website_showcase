/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Navbar with language switcher (EN/KH), store name, navigation, Telegram CTA
 * FIXED: Mobile menu clicks, language switcher readability, nav wrapping
 */

import { STORE_CONFIG } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { openTelegramChat, isTelegramWebApp } from "@/lib/telegram";
import { Send, Menu, X, Globe } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, t, toggleLanguage } = useLanguage();
  const isTg = isTelegramWebApp();

  const storeName =
    language === "kh" ? STORE_CONFIG.name_kh : STORE_CONFIG.name;

  // FIXED: Use callback to ensure menu closes properly
  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false); // Close menu first

    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, []);

  // FIXED: Separate handler for menu toggle
  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-border/50">
      <div className="container flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 flex-shrink-0">
          <img
            src={STORE_CONFIG.logoUrl}
            alt={storeName}
            className="w-10 h-10 rounded-xl object-cover shadow-sm"
          />
          <span className="font-display font-bold text-lg text-walnut hidden sm:block">
            {storeName}
          </span>
        </a>

        {/* Desktop Navigation - FIXED: prevent wrapping */}
        <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => scrollTo("products")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-walnut hover:bg-cream-dark transition-colors whitespace-nowrap"
          >
            {t.nav_products}
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-walnut hover:bg-cream-dark transition-colors whitespace-nowrap"
          >
            {t.nav_contact}
          </button>
          <button
            onClick={() => scrollTo("miniapp")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-walnut hover:bg-cream-dark transition-colors whitespace-nowrap"
          >
            Mini App
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-walnut hover:bg-cream-dark transition-colors whitespace-nowrap"
          >
            {t.nav_about}
          </button>
        </nav>

        {/* Desktop: Language + CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* FIXED: Language switcher - cleaner, more readable */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-dark hover:bg-walnut/10 rounded-lg text-sm font-semibold text-walnut transition-colors"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            <span>{language === "en" ? "ខ្មែរ" : "EN"}</span>
          </button>

          {!isTg && (
            <button
              onClick={() =>
                openTelegramChat(
                  STORE_CONFIG.telegramUsername,
                  "Hi! I'm interested in your products."
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-dark transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              {t.nav_message_us}
            </button>
          )}
        </div>

        {/* Mobile: Language + Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/* FIXED: Simplified language button for mobile */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center w-9 h-9 bg-cream-dark rounded-lg text-sm font-bold text-walnut"
            aria-label="Switch language"
          >
            {language === "en" ? "ខ្មែរ" : "EN"}
          </button>

          {/* FIXED: Better touch target for menu button */}
          <button
            onClick={handleMenuToggle}
            className="flex items-center justify-center w-10 h-10 text-walnut rounded-lg hover:bg-cream-dark transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - FIXED: Better click handling */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-cream border-b border-border/50"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {/* FIXED: Using <a> tags with onClick for better touch response */}
              <button
                type="button"
                onClick={() => scrollTo("products")}
                className="w-full text-left py-3 px-4 rounded-lg text-base font-medium text-walnut hover:bg-cream-dark active:bg-cream-dark transition-colors"
              >
                {t.nav_products}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="w-full text-left py-3 px-4 rounded-lg text-base font-medium text-walnut hover:bg-cream-dark active:bg-cream-dark transition-colors"
              >
                {t.nav_contact}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("miniapp")}
                className="w-full text-left py-3 px-4 rounded-lg text-base font-medium text-walnut hover:bg-cream-dark active:bg-cream-dark transition-colors"
              >
                Mini App
              </button>
              <button
                type="button"
                onClick={() => scrollTo("about")}
                className="w-full text-left py-3 px-4 rounded-lg text-base font-medium text-walnut hover:bg-cream-dark active:bg-cream-dark transition-colors"
              >
                {t.nav_about}
              </button>

              {/* Message Us button in mobile menu */}
              {!isTg && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openTelegramChat(
                      STORE_CONFIG.telegramUsername,
                      "Hi! I'm interested in your products."
                    );
                  }}
                  className="mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-teal text-white rounded-xl text-base font-semibold hover:bg-teal-dark active:bg-teal-dark transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {t.nav_message_us}
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
