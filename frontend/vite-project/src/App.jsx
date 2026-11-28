import React, { useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { GuidesProvider } from "./context/GuidesContext";
import Navbar from "./components/Navbar";
import Homes from "./pages/Homes";
import Footer from "./components/Footer";
import EmergencyButton from "./components/EmergencyButton";
import "./App.css";

function App() {
  useEffect(() => {
    // Register Service Worker for offline capabilities if supported
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.warn("Service worker registration failed:", err);
        });
      });
    }
  }, []);

  const handleOpenAboutFaq = () => {
    const sec = document.getElementById("about-faq");
    if (!sec) return;
    const first = sec.querySelector("details");
    if (first) first.open = true;
    sec.classList.remove("faq-flash");
    void sec.offsetWidth;
    sec.classList.add("faq-flash");
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const h = document.getElementById("aboutFaqHeading");
    if (h) {
      h.setAttribute("tabindex", "-1");
      setTimeout(() => {
        try {
          h.focus({ preventScroll: true });
        } catch {}
      }, reduce ? 60 : 650);
    }
    setTimeout(() => {
      sec.classList.remove("faq-flash");
    }, 1900);
  };

  return (
    <LanguageProvider>
      <GuidesProvider>
        <div className="suraksha-app min-h-screen flex flex-col">
          <Navbar />
          <EmergencyButton number="112" variant="floating" label="Call 112" />
          <Homes />
          <Footer onOpenAboutFaq={handleOpenAboutFaq} />
        </div>
      </GuidesProvider>
    </LanguageProvider>
  );
}

export default App;
