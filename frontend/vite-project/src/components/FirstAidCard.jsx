import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useGuides } from "../context/GuidesContext";

export default function FirstAidCard({ guide }) {
  const { lang, copy } = useLanguage();
  const { openGuide, getCompletedCount } = useGuides();

  const isHi = lang === "hi";
  const mainTitle = isHi ? guide.hi : guide.en;
  const subTitle = isHi ? guide.en : guide.hi;
  const isEmergency = guide.group === "emergency";
  const steps = isHi ? guide.stepsHi : guide.steps;
  const completedCount = getCompletedCount(guide.id);
  const totalSteps = steps.length;

  return (
    <article
      className={`guide-card ${isEmergency ? "card-emergency" : "card-daily"}`}
      onClick={() => openGuide(guide)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openGuide(guide);
        }
      }}
      aria-label={`${mainTitle} first aid guide, ${totalSteps} steps`}
    >
      <div className="card-top">
        <span className={`badge ${isEmergency ? "badge-em" : "badge-daily"}`}>
          {isEmergency ? copy.badgeEmergency || "Emergency" : copy.badgeDaily || "Daily Care"}
        </span>
        <div className="card-icon-wrap" aria-hidden="true">
          {isEmergency ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
        </div>
      </div>

      <h3 className="card-title">{mainTitle}</h3>
      <p className="card-sub">{subTitle}</p>

      <div className="card-footer">
        <span className="card-steps-count">
          {completedCount > 0 ? (
            <span className="text-green-700 font-semibold">
              ✓ {completedCount}/{totalSteps} done
            </span>
          ) : (
            `${totalSteps} ${isHi ? "कदम" : "steps"}`
          )}
        </span>
        <span className="card-arrow" aria-hidden="true">
          {copy.tapForSteps || "Tap for steps →"}
        </span>
      </div>
    </article>
  );
}
