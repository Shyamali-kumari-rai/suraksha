import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer({ onOpenAboutFaq }) {
  const { copy } = useLanguage();

  return (
    <footer>
      <div className="wrap">
        <div className="footer-row">
          <div className="footer-text">
            <p style={{ margin: "0 0 8px" }}>
              <b>Suraksha</b> — <span>{copy.f1 || "Offline-First Hybrid AI Field Manual • India • Hindi + English"}</span>
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {copy.f2 || "Disclaimer: General first-aid guidance only; not a substitute for professional medical care. In any serious emergency, call 112 immediately."}
            </p>
          </div>
          <button
            type="button"
            className="about-faq-btn"
            id="aboutFaqBtn"
            onClick={onOpenAboutFaq}
            aria-controls="about-faq"
          >
            <span className="info-ic" aria-hidden="true">i</span>
            <span>{copy.aboutBtn || "About & FAQ"}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
