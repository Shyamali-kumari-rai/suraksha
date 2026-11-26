import { createContext, useContext, useState, useEffect } from "react";
import { SURAKSHA_COPY } from "../utils/data";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("suraksha_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("suraksha_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  const copy = SURAKSHA_COPY[lang] || SURAKSHA_COPY.en;

  const t = (key) => copy[key] || SURAKSHA_COPY.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, copy, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
