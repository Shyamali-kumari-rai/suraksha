import React, { useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { GuidesProvider } from "./context/GuidesContext";
import Navbar from "./components/Navbar";
import Homes from "./pages/Homes";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  useEffect(() => {
    // Register Service Worker for offline capabilities if in browser
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
          <Homes />
          <Footer />
        </div>
      </GuidesProvider>
    </LanguageProvider>
  );
}

export default App;
