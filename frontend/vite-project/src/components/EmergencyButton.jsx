import React from "react";
import { sendEmergencyAlert } from "../services/apiService";

export default function EmergencyButton({
  number = "112",
  label,
  className = "",
  variant = "floating", // 'floating' | 'btn' | 'solid'
  guideId = null
}) {
  const handleClick = () => {
    sendEmergencyAlert({
      helpline: number,
      guideId: guideId,
      timestamp: new Date().toISOString()
    });
  };

  if (variant === "floating") {
    return (
      <a
        className="call112"
        href={`tel:${number}`}
        onClick={handleClick}
        aria-label={`Call emergency helpline ${number}`}
      >
        📞 <span>{label || `Call ${number}`}</span>
      </a>
    );
  }

  return (
    <a
      className={`btn red ${className}`}
      href={`tel:${number}`}
      onClick={handleClick}
      aria-label={`Call emergency helpline ${number}`}
    >
      📞 {label || `Call ${number}`}
    </a>
  );
}
