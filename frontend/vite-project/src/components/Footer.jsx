import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { HELPLINES } from "../utils/data";
import { sendEmergencyAlert } from "../services/apiService";

export default function Footer() {
  const { lang, copy } = useLanguage();
  const isHi = lang === "hi";

  const handleHelplineClick = (num) => {
    sendEmergencyAlert({
      helpline: num,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <footer className="footer" id="helplines">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">Suraksha</div>
            <p className="footer-note">
              {copy.footerDisclaimer ||
                "Suraksha gives general first-aid information, not medical advice. In an emergency call 112 immediately."}
            </p>
          </div>

          <div className="helpline-grid" aria-label="India Emergency Helplines">
            {HELPLINES.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                onClick={() => handleHelplineClick(h.number)}
                className={`helpline-card ${h.primary ? "helpline-primary" : ""}`}
              >
                <span className="helpline-num">{h.number}</span>
                <span className="helpline-name">{isHi ? h.nameHi : h.nameEn}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>Suraksha &mdash; Offline First-Aid AI (India)</span>
          <span>100% Client-Side &bull; Zero Tracking</span>
        </div>
      </div>
    </footer>
  );
}
