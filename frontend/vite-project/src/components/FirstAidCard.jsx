import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FirstAidCard({ guide, onSelect }) {
  const { lang } = useLanguage();
  const isHi = lang === "hi";

  const guideTitle = isHi ? guide.hi : guide.en;
  const guideDesc = isHi ? guide.hiD : guide.enD;
  const isHigh = guide.sev === "high";

  return (
    <button
      type="button"
      className="gcard"
      onClick={() => onSelect(guide.id)}
      aria-label={`${guideTitle} first-aid guide`}
    >
      <span className="gicon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <h3>{guideTitle}</h3>
      <p>{guideDesc}</p>
      <div className="meta">
        {isHi ? "स्टेप्स देखें →" : "View steps →"} &nbsp;•&nbsp;{" "}
        {isHigh ? (isHi ? "गंभीर" : "Serious") : (isHi ? "मध्यम" : "Moderate")}
      </div>
    </button>
  );
}
