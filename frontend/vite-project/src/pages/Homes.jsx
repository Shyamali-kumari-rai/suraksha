import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useGuides } from "../context/GuidesContext";
import FirstAidCard from "../components/FirstAidCard";
import EmergencyButton from "../components/EmergencyButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";
import { askSurakshaHybrid } from "../services/ai/hybridRouter";

export default function Homes() {
  const { lang, copy } = useLanguage();
  const {
    guides,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    activeGuide,
    openGuide,
    closeGuide,
    isVoiceModalOpen,
    openVoiceModal,
    closeVoiceModal,
    toggleStep,
    isStepChecked,
    getCompletedCount
  } = useGuides();

  const isHi = lang === "hi";

  // Voice Assistant Hook
  const {
    isListening,
    transcript,
    setTranscript,
    voiceLang,
    setVoiceLang,
    matchedGuide,
    setMatchedGuide,
    activeSpeakingStep,
    isSpeaking,
    statusMessage,
    speechSupported,
    startListening,
    stopListening,
    toggleListening,
    processQuery,
    speakSteps,
    stopSpeaking
  } = useVoiceAssistant();

  // Local state for search input text
  const [localInput, setLocalInput] = useState(searchQuery);
  const [manualTypeInput, setManualTypeInput] = useState("");
  const [modalIsSpeaking, setModalIsSpeaking] = useState(false);
  const [modalActiveStep, setModalActiveStep] = useState(-1);
  const modalSpeechRunId = useRef(0);

  // AI Assistant detailed help states
  const [aiGuideLoading, setAiGuideLoading] = useState(false);
  const [aiGuideResponse, setAiGuideResponse] = useState(null);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchResponse, setAiSearchResponse] = useState(null);

  const handleAskAIGuide = async () => {
    if (!activeGuide) return;
    setAiGuideLoading(true);
    try {
      const promptQuery = isHi
        ? `${activeGuide.hi} के लिए विस्तृत प्राथमिक उपचार कदम और सावधानियां बताएं`
        : `Detailed first aid steps and critical precautions for ${activeGuide.en}`;
      const res = await askSurakshaHybrid(promptQuery);
      setAiGuideResponse(res);
    } catch (err) {
      setAiGuideResponse({
        source: "ON-DEVICE",
        badgeClass: "badge-ondevice",
        badgeText: "ON-DEVICE • AI",
        text: "Keep the patient calm and in a safe position.\nIn a serious emergency, call 112 immediately."
      });
    } finally {
      setAiGuideLoading(false);
    }
  };

  const handleAskAISearch = async () => {
    const query = searchQuery || localInput || "Emergency first aid help";
    setAiSearchLoading(true);
    try {
      const res = await askSurakshaHybrid(query);
      setAiSearchResponse(res);
    } catch (err) {
      setAiSearchResponse({
        source: "ON-DEVICE",
        badgeClass: "badge-ondevice",
        badgeText: "ON-DEVICE • AI",
        text: "Keep the patient calm and in a safe position.\nIn a serious emergency, call 112 immediately."
      });
    } finally {
      setAiSearchLoading(false);
    }
  };

  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState({ 0: false, 1: false, 2: false });

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localInput);
  };

  const handleClearSearch = () => {
    setLocalInput("");
    setSearchQuery("");
  };

  const handleChipClick = (query) => {
    setLocalInput(query);
    setSearchQuery(query);
  };

  // Modal Audio Speech handler
  const handleModalListen = () => {
    if (!activeGuide) return;
    if (modalIsSpeaking) {
      stopModalSpeech();
      return;
    }

    if (!("speechSynthesis" in window)) return;

    modalSpeechRunId.current++;
    const currentRun = modalSpeechRunId.current;
    setModalIsSpeaking(true);

    const steps = isHi ? activeGuide.stepsHi : activeGuide.steps;
    const langCode = isHi ? "hi-IN" : "en-IN";

    // Find voice
    const voices = window.speechSynthesis.getVoices() || [];
    const exactVoice = voices.find(
      (v) => (v.lang || "").toLowerCase() === langCode.toLowerCase()
    );
    const fallbackVoice = voices.find((v) =>
      (v.lang || "").toLowerCase().startsWith(langCode.slice(0, 2))
    );
    const chosenVoice = exactVoice || fallbackVoice;

    let idx = 0;

    const speakNext = () => {
      if (currentRun !== modalSpeechRunId.current) return;
      if (idx >= steps.length) {
        setModalIsSpeaking(false);
        setModalActiveStep(-1);
        return;
      }

      setModalActiveStep(idx);
      const prefix = isHi ? `कदम ${idx + 1}. ` : `Step ${idx + 1}. `;
      const utter = new SpeechSynthesisUtterance(prefix + steps[idx]);
      utter.lang = langCode;
      utter.rate = 0.95;
      if (chosenVoice) utter.voice = chosenVoice;

      utter.onend = () => {
        if (currentRun !== modalSpeechRunId.current) return;
        idx++;
        speakNext();
      };

      utter.onerror = () => {
        if (currentRun !== modalSpeechRunId.current) return;
        setModalIsSpeaking(false);
        setModalActiveStep(-1);
      };

      window.speechSynthesis.speak(utter);
    };

    speakNext();
  };

  const stopModalSpeech = () => {
    modalSpeechRunId.current++;
    setModalIsSpeaking(false);
    setModalActiveStep(-1);
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  };

  // Close active guide modal and stop speech
  const handleCloseGuide = () => {
    stopModalSpeech();
    setAiGuideResponse(null);
    closeGuide();
  };

  // Handle manual submit inside voice modal
  const handleManualTypeSubmit = (e) => {
    e.preventDefault();
    if (!manualTypeInput.trim()) return;
    setTranscript(manualTypeInput);
    processQuery(manualTypeInput);
  };

  const handleVoiceSampleClick = (phrase) => {
    setManualTypeInput(phrase);
    setTranscript(phrase);
    processQuery(phrase);
  };

  // Clean speech when voice modal closes
  const handleCloseVoiceModal = () => {
    stopSpeaking();
    stopListening();
    closeVoiceModal();
  };

  return (
    <main id="top" className="main-content">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            {/* Offline Editorial SVG Backdrop */}
            <div className="hero-bg-art" aria-hidden="true">
              <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heroSky" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#102D23" />
                    <stop offset="55%" stopColor="#184536" />
                    <stop offset="100%" stopColor="#275B43" />
                  </linearGradient>
                  <radialGradient id="warmSun" cx="78%" cy="28%" r="48%">
                    <stop offset="0%" stopColor="#FDE02E" stopOpacity="0.24" />
                    <stop offset="60%" stopColor="#EE552A" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#102D23" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="1200" height="620" fill="url(#heroSky)" />
                <rect width="1200" height="620" fill="url(#warmSun)" />
                <path d="M0 470 Q 280 390 560 455 T 1200 410 L 1200 620 L 0 620 Z" fill="#0D251D" opacity="0.65" />
                <path d="M0 530 Q 340 475 720 520 T 1200 490 L 1200 620 L 0 620 Z" fill="#0A1E17" opacity="0.82" />
                <circle cx="930" cy="215" r="145" fill="#BCD8A6" opacity="0.10" />
                <circle cx="930" cy="215" r="98" fill="#FDE02E" opacity="0.11" />
                {/* Stylized First-Aid Shield Emblem */}
                <g transform="translate(838, 128)" opacity="0.92">
                  <path d="M92 8 L174 38 V104 C174 156 138 202 92 216 C46 202 10 156 10 104 V38 Z" fill="#154032" stroke="#BCD8A6" strokeWidth="3" />
                  <rect x="78" y="64" width="28" height="86" rx="7" fill="#FDE02E" />
                  <rect x="49" y="93" width="86" height="28" rx="7" fill="#FDE02E" />
                </g>
                {/* Decorative Pulse Line */}
                <path d="M620 430 H750 L785 370 L820 470 L855 405 L885 430 H1160" fill="none" stroke="#BCD8A6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
              </svg>
            </div>

            <div className="hero-content">
              <div className="hero-pill-row">
                <span className="status-pill">
                  <span className="status-dot"></span> <span>{copy.offlineBadge || "ON-DEVICE • OFFLINE READY"}</span>
                </span>
                <span className="lang-pill">{copy.bilingualBadge || "Hindi • English • Hinglish"}</span>
              </div>

              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: copy.heroTitle || 'INSTANT FIRST-AID.<br><span class="highlight-yellow">ZERO INTERNET.</span>' }} />

              <p className="hero-desc">
                {copy.heroDesc || "Ask anything in Hindi or English and get clear, numbered emergency & daily first-aid steps in seconds — completely offline on your device."}
              </p>

              <div className="hero-cta-row">
                <button type="button" className="btn-voice-hero" onClick={() => openVoiceModal()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                  <span>{copy.speakCta || "Speak to Assistant"}</span>
                </button>
                <a href="#guides" className="btn-outline-hero">{copy.browseCta || "Browse 24 Guides"}</a>
                <EmergencyButton number="112" variant="hero" label={copy.call112Cta || "Call 112 Now"} />
              </div>
            </div>
          </div>

          {/* Attached Dual-Tone Split Strip (Urgent + Ask Box) */}
          <div className="split-strip">
            <div className="strip-yellow">
              <div className="strip-icon-badge" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#112E24" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="strip-yellow-copy">
                <div className="strip-kicker">{copy.urgentKicker || "LIFE-THREATENING EMERGENCY?"}</div>
                <p className="strip-text">{copy.urgentText || "Dial India's 24/7 national helpline immediately while following first-aid steps."}</p>
                <EmergencyButton number="112" variant="strip" label={copy.urgentBtn || "Call 112 →"} />
              </div>
            </div>

            <div className="strip-sage">
              <div className="strip-kicker">{copy.askKicker || "ASK SURAKSHA (HINDI / ENGLISH)"}</div>
              <form onSubmit={handleSearchSubmit} className="ask-form" role="search">
                <div className="search-field-wrap">
                  <input
                    type="search"
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    className="search-input"
                    placeholder="Kya hua? What happened? (e.g., burn, haath me dard, saap)"
                    autoComplete="off"
                    aria-label="Kya hua? What happened?"
                  />
                  {localInput && (
                    <button type="button" onClick={handleClearSearch} className="search-clear-btn" aria-label="Clear search">
                      &times;
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openVoiceModal()}
                    className="search-mic-btn"
                    aria-label="Speak to Assistant"
                    title="Speak in Hindi or English"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </button>
                </div>
                <button type="submit" className="ask-submit-btn">
                  {copy.findStepsBtn || "Find Steps"}
                </button>
              </form>

              <div className="quick-chips" aria-label="Quick search examples">
                <button type="button" className="chip" onClick={() => handleChipClick("snake bite")}>Snake Bite</button>
                <button type="button" className="chip" onClick={() => handleChipClick("burn")}>Burns</button>
                <button type="button" className="chip" onClick={() => handleChipClick("haath me dard hai")}>हाथ में दर्द</button>
                <button type="button" className="chip" onClick={() => handleChipClick("sar dard")}>सिर दर्द</button>
                <button type="button" className="chip" onClick={() => handleChipClick("bukhar")}>बुखार</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GUIDES DIRECTORY SECTION ================= */}
      <section className="section" id="guides">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-eyebrow">{copy.guidesEyebrow || "VERIFIED OFFLINE PROTOCOLS"}</span>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: copy.guidesTitle || 'INSTANT <span class="marker-underline">FIRST-AID</span> &amp; DAILY CARE' }} />
            <p className="section-sub">
              {copy.guidesSub || "Tap any card for numbered steps with interactive checkmarks and Hindi/English voice read-aloud."}
            </p>
          </div>

          <div className="filter-bar reveal" role="tablist" aria-label="Filter guides by category">
            <button
              type="button"
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              role="tab"
              aria-selected={filter === "all"}
            >
              {copy.tabAll || "All (24)"}
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "emergency" ? "active" : ""}`}
              onClick={() => setFilter("emergency")}
              role="tab"
              aria-selected={filter === "emergency"}
            >
              {copy.tabEmergency || "Emergencies (12)"}
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "daily" ? "active" : ""}`}
              onClick={() => setFilter("daily")}
              role="tab"
              aria-selected={filter === "daily"}
            >
              {copy.tabDaily || "Daily Care (12)"}
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "trauma" ? "active" : ""}`}
              onClick={() => setFilter("trauma")}
              role="tab"
              aria-selected={filter === "trauma"}
            >
              {copy.tabTrauma || "Trauma & Bites"}
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "airway" ? "active" : ""}`}
              onClick={() => setFilter("airway")}
              role="tab"
              aria-selected={filter === "airway"}
            >
              {copy.tabAirway || "Airway & Heart"}
            </button>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" label="Updating guides..." />
          ) : guides.length > 0 ? (
            <div className="guides-grid">
              {guides.map((g) => (
                <FirstAidCard key={g.id} guide={g} />
              ))}
            </div>
          ) : (
            <div className="no-match-box visible" role="status">
              <p className="no-match-title">{copy.noMatchText || "No guide for this yet — call 112 for emergencies."}</p>
              <div className="no-match-actions">
                <EmergencyButton number="112" variant="solid" label="Call 112 Now" />
                <button
                  type="button"
                  className="btn-ai-help"
                  style={{ width: "auto", margin: 0 }}
                  onClick={handleAskAISearch}
                  disabled={aiSearchLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{aiSearchLoading ? "Asking AI..." : "Ask AI for detailed help"}</span>
                </button>
                <button
                  type="button"
                  className="btn-reset-search"
                  onClick={() => {
                    handleClearSearch();
                    setFilter("all");
                    setAiSearchResponse(null);
                  }}
                >
                  {copy.showAllBtn || "Show All Guides"}
                </button>
              </div>

              {aiSearchResponse && (
                <div className="ai-response-box" style={{ maxWidth: "620px", margin: "18px auto 0" }}>
                  <div className="ai-response-header">
                    <span className="ai-response-title">AI Assistant Guidance</span>
                    <span className={aiSearchResponse.badgeClass}>{aiSearchResponse.badgeText}</span>
                  </div>
                  <p className="ai-response-text">{aiSearchResponse.text}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= IMPACT BAND ================= */}
      <section className="section" id="impact">
        <div className="container">
          <div className="impact-band reveal">
            <div className="impact-left">
              <span className="impact-pill">{copy.impactEyebrow || "BUILT FOR ZERO-NETWORK MOMENTS"}</span>
              <h2 className="impact-title" dangerouslySetInnerHTML={{ __html: copy.impactTitle || 'WORKS WHEN SIGNAL <span class="impact-accent">DISAPPEARS.</span>' }} />
              <p className="impact-desc">
                {copy.impactDesc || "No server round-trips, no login walls, and no external fonts or scripts. Every protocol and voice command runs directly inside your browser."}
              </p>
              <div className="impact-stat-big">
                <span className="counter-num">100</span><span className="counter-unit">%</span>
                <span className="counter-label">{copy.counterLabel || "OFFLINE CAPABLE ON-DEVICE"}</span>
              </div>
            </div>

            <div className="impact-bars" aria-label="Key capabilities">
              <div className="bar-col">
                <div className="bar-fill" style={{ "--bar-h": "58%" }}>
                  <span className="bar-val">12</span>
                  <span className="bar-lbl">{copy.bar1 || "Core Emergencies"}</span>
                </div>
              </div>
              <div className="bar-col">
                <div className="bar-fill" style={{ "--bar-h": "76%" }}>
                  <span className="bar-val">24</span>
                  <span className="bar-lbl">{copy.bar2 || "Total Guides"}</span>
                </div>
              </div>
              <div className="bar-col">
                <div className="bar-fill bar-fill-bright" style={{ "--bar-h": "100%" }}>
                  <span className="bar-val">0 KB</span>
                  <span className="bar-lbl">{copy.bar3 || "Internet Needed"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="section" id="faq">
        <div className="container">
          <div className="faq-layout reveal">
            <div className="faq-intro">
              <span className="section-eyebrow">{copy.faqEyebrow || "QUESTIONS & ANSWERS"}</span>
              <h2 className="section-title" dangerouslySetInnerHTML={{ __html: copy.faqTitle || 'HOW SURAKSHA <span class="marker-underline">WORKS</span>' }} />
              <p className="section-sub">
                {copy.faqSub || "Everything you need to know about offline access, Hindi voice support, and medical safety."}
              </p>
            </div>

            <div className="faq-list">
              <div className="faq-item">
                <button
                  type="button"
                  className="faq-q"
                  onClick={() => toggleFaq(0)}
                  aria-expanded={openFaq[0]}
                >
                  <span>{copy.faq1Q || "Does Suraksha really work without internet?"}</span>
                  <span className="faq-plus" aria-hidden="true">{openFaq[0] ? "−" : "+"}</span>
                </button>
                {openFaq[0] && (
                  <div className="faq-a">
                    <p>{copy.faq1A || "Yes. All 24 guides, search indexing, icons, and styling are stored locally inside the app files with zero external CDNs or fonts. Once loaded, it works offline."}</p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  type="button"
                  className="faq-q"
                  onClick={() => toggleFaq(1)}
                  aria-expanded={openFaq[1]}
                >
                  <span>{copy.faq2Q || "How do I use the Hindi & English Voice Assistant?"}</span>
                  <span className="faq-plus" aria-hidden="true">{openFaq[1] ? "−" : "+"}</span>
                </button>
                {openFaq[1] && (
                  <div className="faq-a">
                    <p>{copy.faq2A || 'Tap "Speak to Assistant" or the mic button and speak naturally — for example, "mere haath me dard hai", "sar dard ho raha hai", or "snake bite". Suraksha finds the matching guide and reads the steps aloud.'}</p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  type="button"
                  className="faq-q"
                  onClick={() => toggleFaq(2)}
                  aria-expanded={openFaq[2]}
                >
                  <span>{copy.faq3Q || "Is this a substitute for a doctor or hospital?"}</span>
                  <span className="faq-plus" aria-hidden="true">{openFaq[2] ? "−" : "+"}</span>
                </button>
                {openFaq[2] && (
                  <div className="faq-a">
                    <p>{copy.faq3A || "No. Suraksha provides general first-aid information, not medical advice. In any serious or worsening emergency, call 112 or 108 immediately."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FLOATING ACTION BUTTON ================= */}
      <button
        type="button"
        className="fab-voice"
        onClick={() => openVoiceModal()}
        aria-label="Open Speak to Assistant"
      >
        <span className="fab-ring" aria-hidden="true"></span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
        <span className="fab-label">{copy.fabLabel || "Speak"}</span>
      </button>

      {/* ================= GUIDE CHECKLIST MODAL ================= */}
      {activeGuide && (
        <div
          className="modal-backdrop open"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseGuide();
          }}
        >
          <div className="modal-sheet">
            <div className="modal-header">
              <button type="button" className="modal-back-btn" onClick={handleCloseGuide}>
                &larr; <span>{copy.backAll || "All guides"}</span>
              </button>
              <span className="badge-ondevice">ON-DEVICE &bull; OFFLINE</span>
            </div>

            <div className="modal-body">
              <div className="modal-title-row">
                <div>
                  <h2 className="modal-title">{isHi ? activeGuide.hi : activeGuide.en}</h2>
                  <p className="modal-subtitle">{isHi ? activeGuide.en : activeGuide.hi}</p>
                </div>
                <span className="progress-pill">
                  {getCompletedCount(activeGuide.id)} / {(isHi ? activeGuide.stepsHi : activeGuide.steps).length} done
                </span>
              </div>

              <div className="modal-audio-bar">
                <button
                  type="button"
                  className={`btn-listen ${modalIsSpeaking ? "active" : ""}`}
                  onClick={handleModalListen}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  <span>{modalIsSpeaking ? (isHi ? "रोकें (Stop)" : "Stop Audio") : (isHi ? "आवाज़ में सुनें" : "Listen to Steps")}</span>
                </button>
                <span className="audio-hint">{copy.tapCheckHint || "Tap any step to mark complete"}</span>
              </div>

              <ol className="steps-list">
                {(isHi ? activeGuide.stepsHi : activeGuide.steps).map((stepText, idx) => {
                  const checked = isStepChecked(activeGuide.id, idx);
                  const isSpeakingThisStep = modalIsSpeaking && modalActiveStep === idx;
                  return (
                    <li
                      key={idx}
                      className={`step-row ${checked ? "done" : ""} ${isSpeakingThisStep ? "speaking-now" : ""}`}
                      onClick={() => toggleStep(activeGuide.id, idx)}
                    >
                      <span className="step-num">{checked ? "✓" : idx + 1}</span>
                      <span className="step-text">{stepText}</span>
                    </li>
                  );
                })}
              </ol>

              {/* Ask AI for detailed help */}
              <button
                type="button"
                className="btn-ai-help"
                onClick={handleAskAIGuide}
                disabled={aiGuideLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{aiGuideLoading ? "Asking AI..." : "Ask AI for detailed help"}</span>
              </button>

              {aiGuideResponse && (
                <div className="ai-response-box">
                  <div className="ai-response-header">
                    <span className="ai-response-title">AI Assistant Guidance</span>
                    <span className={aiGuideResponse.badgeClass}>{aiGuideResponse.badgeText}</span>
                  </div>
                  <p className="ai-response-text">{aiGuideResponse.text}</p>
                </div>
              )}

              <EmergencyButton
                number="112"
                variant="modal"
                label={copy.call112Now || "Call 112 now"}
                guideId={activeGuide.id}
              />

              <p className="modal-disclaimer">
                {copy.footerDisclaimer || "Suraksha gives general first-aid information, not medical advice. In an emergency call 112 immediately."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SPEAK TO ASSISTANT VOICE MODAL ================= */}
      {isVoiceModalOpen && (
        <div
          className="modal-backdrop open"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseVoiceModal();
          }}
        >
          <div className="voice-sheet">
            <div className="voice-header">
              <div>
                <span className="voice-badge">ON-DEVICE &bull; VOICE</span>
                <h2 className="voice-title">Speak to Assistant</h2>
              </div>
              <div className="voice-header-right">
                <div className="voice-lang-toggle" role="group" aria-label="Voice recognition language">
                  <button
                    type="button"
                    className={`vlang-btn ${voiceLang.startsWith("hi") ? "active" : ""}`}
                    onClick={() => setVoiceLang("hi-IN")}
                    aria-pressed={voiceLang.startsWith("hi")}
                  >
                    हिंदी + EN
                  </button>
                  <button
                    type="button"
                    className={`vlang-btn ${voiceLang.startsWith("en") ? "active" : ""}`}
                    onClick={() => setVoiceLang("en-IN")}
                    aria-pressed={voiceLang.startsWith("en")}
                  >
                    EN
                  </button>
                </div>
                <button
                  type="button"
                  className="voice-close-btn"
                  onClick={handleCloseVoiceModal}
                  aria-label="Close voice assistant"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="voice-body">
              <div className="orb-stage">
                <button
                  type="button"
                  className={`mic-orb ${isListening ? "listening" : ""}`}
                  onClick={toggleListening}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening && (
                    <>
                      <span className="orb-ripple r1" aria-hidden="true"></span>
                      <span className="orb-ripple r2" aria-hidden="true"></span>
                    </>
                  )}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </button>

                <div className={`waveform ${isListening ? "active" : ""}`} aria-hidden="true">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>

                <p className="voice-status">
                  {statusMessage || (voiceLang.startsWith("hi") ? "माइक दबाएं और हिंदी या अंग्रेज़ी में कहें क्या हुआ।" : "Tap the mic and say what happened in Hindi or English.")}
                </p>
                {transcript && <p className="voice-transcript">"{transcript}"</p>}
                {!speechSupported && (
                  <p className="voice-fallback-note">
                    Speech recognition is not supported on this browser. Type your emergency below:
                  </p>
                )}
              </div>

              {/* Fallback Manual Text Bar */}
              <form onSubmit={handleManualTypeSubmit} className="voice-type-form">
                <input
                  type="text"
                  value={manualTypeInput}
                  onChange={(e) => setManualTypeInput(e.target.value)}
                  className="voice-type-input"
                  placeholder="Or type here: e.g., mere haath me dard hai..."
                  autoComplete="off"
                />
                <button type="submit" className="voice-type-btn">Ask</button>
              </form>

              {/* One-tap Sample Phrases */}
              <div className="voice-samples" aria-label="Sample voice queries">
                <button type="button" className="sample-chip" onClick={() => handleVoiceSampleClick("Mere haath me dard hai")}>Mere haath me dard hai</button>
                <button type="button" className="sample-chip" onClick={() => handleVoiceSampleClick("Sar dard ho raha hai")}>Sar dard ho raha hai</button>
                <button type="button" className="sample-chip" onClick={() => handleVoiceSampleClick("Snake bite")}>Snake bite</button>
                <button type="button" className="sample-chip" onClick={() => handleVoiceSampleClick("Burn on hand")}>Burn on hand</button>
                <button type="button" className="sample-chip" onClick={() => handleVoiceSampleClick("साँप का काटना")}>साँप का काटना</button>
                <button type="button" className="sample-chip" onClick={() => handleVoiceSampleClick("गले में अटकना")}>गले में अटकना</button>
              </div>

              {/* Matched Result Panel */}
              {matchedGuide && (
                <div className="voice-result">
                  <div className="voice-result-head">
                    <div>
                      <h3 className="voice-result-title">{isHi ? matchedGuide.hi : matchedGuide.en}</h3>
                      <p className="voice-result-sub">{isHi ? matchedGuide.en : matchedGuide.hi}</p>
                    </div>
                    <div className="voice-result-actions">
                      {isSpeaking ? (
                        <button type="button" className="btn-v-stop" onClick={stopSpeaking}>Stop Audio</button>
                      ) : (
                        <button
                          type="button"
                          className="btn-v-action"
                          onClick={() => {
                            const steps = isHi ? matchedGuide.stepsHi : matchedGuide.steps;
                            speakSteps(steps, isHi ? "hi-IN" : "en-IN");
                          }}
                        >
                          Read Aloud
                        </button>
                      )}
                    </div>
                  </div>
                  <ol className="voice-steps">
                    {(isHi ? matchedGuide.stepsHi : matchedGuide.steps).map((s, idx) => (
                      <li key={idx} className={activeSpeakingStep === idx ? "speaking-now" : ""}>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <div className="voice-result-footer">
                    <button
                      type="button"
                      className="btn-open-full"
                      onClick={() => {
                        handleCloseVoiceModal();
                        openGuide(matchedGuide);
                      }}
                    >
                      Open Full Checklist
                    </button>
                    <EmergencyButton number="112" variant="nav" label="Call 112" guideId={matchedGuide.id} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
