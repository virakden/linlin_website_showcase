import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Language, type Translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("app-language");
      if (saved === "en" || saved === "kh") return saved;
    } catch {}
    return "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("app-language", lang);
    } catch {}
    // Update html lang attribute
    document.documentElement.lang = lang === "kh" ? "km" : "en";
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "kh" : "en");
  }, [language, setLanguage]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
