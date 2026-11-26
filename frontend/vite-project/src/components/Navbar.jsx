import React from "react";
import { useLanguage } from "../context/LanguageContext";
import EmergencyButton from "./EmergencyButton";

export default function Navbar() {
  const { lang, setLang, copy } = useLanguage();

  return (
    <header className="navbar" id="navBar">
      <div className="container nav-inner">
        <a href="#top" className="brand" aria-label="Suraksha Home">
          <span className="brand-mark" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11 4.6-.85 8-5.75 8-11V5l-8-3z" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </span>
          <span className="brand-copy">
            <span className="brand-name">Suraksha</span>
            <span className="brand-tag">{copy.brandTag || "Offline First-Aid AI"}</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary Navigation">
          <a href="#guides">{copy.navGuides || "Guides"}</a>
          <a href="#impact">{copy.navHow || "Offline Ready"}</a>
          <a href="#faq">{copy.navFaq || "FAQ"}</a>
          <a href="#helplines">{copy.navHelplines || "Helplines"}</a>
        </nav>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn ${lang === "hi" ? "active" : ""}`}
              onClick={() => setLang("hi")}
              aria-pressed={lang === "hi"}
            >
              हिंदी
            </button>
          </div>
          <EmergencyButton number="112" variant="nav" label="Call 112" />
        </div>
      </div>
    </header>
  );
}
