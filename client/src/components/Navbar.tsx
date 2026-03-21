/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Navbar with language switcher (EN/KH), store name, navigation, Telegram CTA
 * FIXED: Mobile menu clicks, language switcher readability, nav wrapping, active states
 */

import { STORE_CONFIG } from "@/lib/store-config";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  openTelegramChat,
  isTelegramWebApp,
  openTelegramPersonal,
} from "@/lib/telegram";
import { Send, Menu, X, Globe } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { language, t, toggleLanguage } = useLanguage();
  const isTg = isTelegramWebApp();
  const [activeSection, setActiveSection] = useState("");

  const storeName =
    language === "kh" ? STORE_CONFIG.name_kh : STORE_CONFIG.name;

  // Track scroll position to highlight active section
  useEffect(() => {
    if (location !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const sections = ["products", "contact", "miniapp", "about"];
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // Navigate to section (works from any page)
  const scrollTo = useCallback(
    (id: string) => {
      setMobileMenuOpen(false);

      if (location !== "/") {
        window.location.href = "/#" + id;
      } else {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    },
    [location]
  );

  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Helper function for nav button styles
  const getNavStyle = (sectionId: string) => {
    const isActive = activeSection === sectionId && location === "/";
    return `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      isActive
        ? "text-teal bg-teal/10 font-semibold"
        : "text-walnut hover:bg-cream-dark"
    }`;
  };

  // Helper function for mobile nav button styles
  const getMobileNavStyle = (sectionId: string) => {
    const isActive = activeSection === sectionId && location === "/";
    return `w-full text-left py-3 px-4 rounded-lg text-base font-medium transition-colors ${
      isActive
        ? "text-teal bg-teal/10 font-semibold"
        : "text-walnut hover:bg-cream-dark active:bg-cream-dark"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-border/50">
      <div className="container flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/logo.png"
            alt={storeName}
            className="w-10 h-10 rounded-xl object-cover shadow-sm"
          />
          <span className="font-display font-bold text-lg text-walnut hidden sm:block">
            {storeName}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => scrollTo("products")}
            className={getNavStyle("products")}
          >
            {t.nav_products}
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className={getNavStyle("contact")}
          >
            {t.nav_contact}
          </button>
          <button
            onClick={() => scrollTo("miniapp")}
            className={getNavStyle("miniapp")}
          >
            Mini App
          </button>
          <button
            onClick={() => scrollTo("about")}
            className={getNavStyle("about")}
          >
            {t.nav_about}
          </button>
          <Link
            href="/order"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              location === "/order"
                ? "text-teal bg-teal/10 font-semibold"
                : "text-walnut hover:bg-cream-dark"
            }`}
          >
            {language === "kh" ? "ទិញផលិតផល" : "Purchase"}
          </Link>
        </nav>

        {/* Desktop: Language + CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
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
                openTelegramPersonal("Hi! I'm interested in your products.")
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
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center px-3 h-9 bg-cream-dark rounded-lg text-sm font-bold text-walnut min-w-fit"
            aria-label="Switch language"
          >
            {language === "en" ? "ខ្មែរ" : "EN"}
          </button>

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
            <nav className="container py-4 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => scrollTo("products")}
                className={getMobileNavStyle("products")}
              >
                {t.nav_products}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className={getMobileNavStyle("contact")}
              >
                {t.nav_contact}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("miniapp")}
                className={getMobileNavStyle("miniapp")}
              >
                Mini App
              </button>
              <button
                type="button"
                onClick={() => scrollTo("about")}
                className={getMobileNavStyle("about")}
              >
                {t.nav_about}
              </button>
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                  location === "/order"
                    ? "text-teal bg-teal/10 font-semibold"
                    : "text-walnut hover:bg-cream-dark active:bg-cream-dark"
                }`}
              >
                {language === "kh" ? "ទិញផលិតផល" : "Purchase"}
              </Link>

              {!isTg && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openTelegramPersonal(
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
