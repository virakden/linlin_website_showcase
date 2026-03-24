/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Footer with bilingual support and social links
 */

import { STORE_CONFIG } from "@/lib/store-config";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  const { language, t } = useLanguage();
  const storeName =
    language === "kh" ? STORE_CONFIG.name_kh : STORE_CONFIG.name;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-walnut text-cream/80 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            {/* <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div> */}
            <img
              src="/logo.png"
              alt="LinLin Logo"
              className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
            />
            <div>
              <span className="font-display font-bold text-white text-base">
                {storeName}
              </span>
              <p className="text-xs text-cream/50">
                {language === "kh"
                  ? STORE_CONFIG.tagline_kh
                  : STORE_CONFIG.tagline}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href={STORE_CONFIG.telegramMiniApp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {t.footer_telegram}
            </a>
            <button
              onClick={() => scrollTo("products")}
              className="hover:text-white transition-colors"
            >
              {t.footer_products}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="hover:text-white transition-colors"
            >
              {t.footer_contact}
            </button>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-6 pt-6 text-center text-xs text-cream/40">
          &copy; {new Date().getFullYear()} {storeName}. {t.footer_rights}
        </div>
      </div>
    </footer>
  );
}
