import React, { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { GuidesProvider } from "./context/GuidesContext";
import Navbar from "./components/Navbar";
import Homes from "./pages/Homes";
import Footer from "./components/Footer";
import EmergencyButton from "./components/EmergencyButton";
import "./App.css";

function App() {
  const [isAboutFaqOpen, setIsAboutFaqOpen] = useState(false);

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

  return (
    <LanguageProvider>
      <GuidesProvider>
        <div className="suraksha-app min-h-screen flex flex-col">
          <Navbar />
          <EmergencyButton number="112" variant="floating" label="Call 112" />
          <Homes
            isAboutFaqOpen={isAboutFaqOpen}
            onCloseAboutFaq={() => setIsAboutFaqOpen(false)}
          />
          <Footer onOpenAboutFaq={() => setIsAboutFaqOpen(true)} />
        </div>
      </GuidesProvider>
    </LanguageProvider>
  );
}

export default App;
