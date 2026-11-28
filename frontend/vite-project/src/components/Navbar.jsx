import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { lang, setLang, copy } = useLanguage();
  const isHi = lang === "hi";

  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">✚</span>
          Suraksha
          <sup style={{ fontSize: "12px", marginLeft: "2px" }}>®</sup>
        </a>

        <span className="pill">
          <span className="dot" aria-hidden="true"></span>
          <span>{copy.ready || "OFFLINE READY"}</span>
        </span>

        <nav className="navlinks" aria-label="Primary Navigation">
          <a href="#ask">{copy.n1 || "Ask AI"}</a>
          <a href="#madad">{copy.nMadad || "Madad SMS"}</a>
          <a href="#guides">{copy.n2 || "Emergency Guides"}</a>
          <a href="#how">{copy.n3 || "How It Works"}</a>
          <a href="#helplines">{copy.n5 || "Helplines"}</a>
        </nav>

        <div className="lang" role="group" aria-label="Language selection">
          <button
            id="langEn"
            className={!isHi ? "on" : ""}
            type="button"
            onClick={() => setLang("en")}
            aria-pressed={!isHi}
          >
            EN
          </button>
          <button
            id="langHi"
            className={isHi ? "on" : ""}
            type="button"
            onClick={() => setLang("hi")}
            aria-pressed={isHi}
          >
            हिंदी
          </button>
        </div>
      </div>
    </header>
  );
}
