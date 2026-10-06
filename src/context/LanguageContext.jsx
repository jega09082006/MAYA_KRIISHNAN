import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem("maya_lang");
      return saved === "en" ? "en" : "ta";
    } catch {
      return "ta";
    }
  });

  const setLang = (newLang) => {
    const validLang = newLang === "en" ? "en" : "ta";
    setLangState(validLang);
    try {
      localStorage.setItem("maya_lang", validLang);
    } catch (e) {
      console.warn("Could not save language preference to localStorage", e);
    }
  };

  const toggleLang = () => {
    setLang(lang === "ta" ? "en" : "ta");
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === "ta") {
      document.documentElement.classList.add("lang-ta");
      document.documentElement.classList.remove("lang-en");
    } else {
      document.documentElement.classList.add("lang-en");
      document.documentElement.classList.remove("lang-ta");
    }
  }, [lang]);

  const t = (key, fallback = "") => {
    const dict = translations[lang] || translations.ta;
    return dict[key] !== undefined ? dict[key] : (fallback || key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return context;
}
