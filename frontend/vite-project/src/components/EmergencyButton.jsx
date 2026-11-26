import React from "react";
import { sendEmergencyAlert } from "../services/apiService";

export default function EmergencyButton({
  number = "112",
  variant = "nav", // 'nav' | 'hero' | 'solid' | 'modal' | 'strip'
  label,
  className = "",
  guideId = null
}) {
  const handleClick = () => {
    sendEmergencyAlert({
      helpline: number,
      guideId: guideId,
      timestamp: new Date().toISOString()
    });
  };

  const getClassName = () => {
    switch (variant) {
      case "hero":
        return "btn-emergency-hero";
      case "solid":
        return "btn-emergency-solid";
      case "modal":
        return "btn-call-modal";
      case "strip":
        return "strip-dark-btn";
      case "nav":
      default:
        return "btn-call-nav";
    }
  };

  return (
    <a
      href={`tel:${number}`}
      onClick={handleClick}
      className={`${getClassName()} ${className}`}
      aria-label={`Call emergency helpline ${number}`}
    >
      {label || `Call ${number}`}
    </a>
  );
}
