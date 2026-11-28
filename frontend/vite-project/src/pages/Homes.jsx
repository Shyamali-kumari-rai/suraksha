import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { GUIDES, I18N } from "../utils/data";
import { askSurakshaHybrid } from "../services/ai/hybridRouter";
import MadadLocationTracker from "../components/MadadLocationTracker";
import AshaDoctorCard from "../components/AshaDoctorCard";
import AshaDoctorModal from "../components/AshaDoctorModal";
import {
  loadAshaContacts,
  saveAshaContacts,
  getPrimaryAshaContact
} from "../utils/ashaStorage";

export default function Homes({ isAboutFaqOpen = false, onCloseAboutFaq = () => {} }) {
  const { lang, copy } = useLanguage();
  const isHi = lang === "hi";

  useEffect(() => {
    if (!isAboutFaqOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCloseAboutFaq();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAboutFaqOpen, onCloseAboutFaq]);

  // Toast notification state
  const [toastMsg, setToastMsg] = useState("");
  const toastTimeoutRef = useRef(null);

  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMsg(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMsg("");
    }, 2600);
  };

  // ================= ASHA / DOCTOR QUICK-CALL =================
  const [ashaContacts, setAshaContacts] = useState(() => loadAshaContacts());
  const [ashaModalOpen, setAshaModalOpen] = useState(false);
  const [editingAshaContact, setEditingAshaContact] = useState(null);

  const primaryAshaContact = getPrimaryAshaContact(ashaContacts);

  const handleOpenAddAsha = () => {
    if (ashaContacts.length >= 2) {
      showToast(
        copy.ashaErrMax ||
          "You can save up to 2 contacts (1 ASHA Worker + 1 Local Doctor)."
      );
      return;
    }
    setEditingAshaContact(null);
    setAshaModalOpen(true);
  };

  const handleOpenEditAsha = (contact) => {
    setEditingAshaContact(contact);
    setAshaModalOpen(true);
  };

  const handleCloseAshaModal = () => {
    setAshaModalOpen(false);
    setEditingAshaContact(null);
  };

  const handleSaveAshaContact = (contactData) => {
    const wasEditing = Boolean(editingAshaContact);
    setAshaContacts((prev) => {
      const isEditing = prev.some((c) => c.id === contactData.id);
      let next;
      if (isEditing) {
        next = prev.map((c) => (c.id === contactData.id ? contactData : c));
      } else {
        next = [...prev, contactData].slice(0, 2);
      }

      if (contactData.isPrimary) {
        next = next.map((c) => ({
          ...c,
          isPrimary: c.id === contactData.id
        }));
      } else if (next.length > 0 && !next.some((c) => c.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }

      saveAshaContacts(next);
      return next;
    });

    setAshaModalOpen(false);
    setEditingAshaContact(null);
    showToast(
      wasEditing
        ? copy.ashaToastUpdated || "ASHA / Doctor contact updated."
        : copy.ashaToastSaved || "ASHA / Doctor contact saved offline."
    );
  };

  const handleDeleteAshaContact = (contactId) => {
    setAshaContacts((prev) => {
      const next = prev.filter((c) => c.id !== contactId);
      if (next.length > 0 && !next.some((c) => c.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }
      saveAshaContacts(next);
      return next;
    });
    showToast(copy.ashaToastDeleted || "Contact removed.");
  };

  // Helper getters for guides
  const getGuideTitle = (g) => (isHi ? g.hi : g.en);
  const getGuideSteps = (g) => (isHi ? g.hiSteps : g.enSteps);
  const getGuideDesc = (g) => (isHi ? g.hiD : g.enD);
  const getGuideDont = (g) => (isHi ? g.hiDont : g.enDont);

  // Search & Active Guide State
  const [askInput, setAskInput] = useState("");
  const [currentGuideId, setCurrentGuideId] = useState(null);
  const [searchGuideQuery, setSearchGuideQuery] = useState("");
  const [recentList, setRecentList] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_recent_checks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const pushRecent = (id) => {
    setRecentList((prev) => {
      const filtered = prev.filter((x) => x !== id);
      const updated = [id, ...filtered].slice(0, 4);
      try {
        localStorage.setItem("suraksha_recent_checks", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // AI Assistance State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [noMatchQuery, setNoMatchQuery] = useState("");

  const handleAskAI = async (queryText) => {
    const q = queryText || askInput || "Emergency first aid guidance";
    setAiLoading(true);
    try {
      const res = await askSurakshaHybrid(q);
      setAiResponse(res);
    } catch (err) {
      setAiResponse({
        source: "ON-DEVICE",
        badgeClass: "badge-ondevice",
        badgeText: "ON-DEVICE • AI",
        text: isHi
          ? "मरीज को शांत और सुरक्षित स्थिति में रखें। किसी भी गंभीर आपात स्थिति में तुरंत 112 पर कॉल करें।"
          : "Keep the patient calm and in a safe position. In a serious emergency, call 112 immediately."
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Select / Open Guide
  const handleSelectGuide = (id, scroll = false) => {
    setCurrentGuideId(id);
    setNoMatchQuery("");
    setAiResponse(null);
    pushRecent(id);

    if (scroll) {
      setTimeout(() => {
        const detailEl = document.getElementById("detail");
        if (detailEl) {
          detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
          detailEl.classList.remove("flash");
          void detailEl.offsetWidth;
          detailEl.classList.add("flash");
        }
      }, 50);
    }
  };

  const handleQuickAsk = (id) => {
    handleSelectGuide(id, false);
    const askEl = document.getElementById("ask");
    if (askEl) askEl.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Handle Form Submit in Ask Box
  const handleAskSubmit = (e) => {
    if (e) e.preventDefault();
    const q = askInput.trim().toLowerCase();
    const askFormEl = document.getElementById("askForm");

    if (!q) {
      if (askFormEl) {
        askFormEl.classList.remove("invalid");
        void askFormEl.offsetWidth;
        askFormEl.classList.add("invalid");
        setTimeout(() => askFormEl.classList.remove("invalid"), 1400);
      }
      showToast(isHi ? "पहले लिखें कि क्या हुआ — या नीचे कोई चिप दबाएँ" : "Type what happened first — or tap a chip below");
      return;
    }

    let best = null;
    let bestScore = 0;

    GUIDES.forEach((g) => {
      let s = 0;
      g.kw.forEach((k) => {
        if (q.indexOf(k.toLowerCase()) > -1) s += k.length;
      });
      if (g.en.toLowerCase() === q || g.hi === q) s += 50;
      if (s > bestScore) {
        bestScore = s;
        best = g;
      }
    });

    if (best && bestScore > 0) {
      handleSelectGuide(best.id, false);
    } else {
      setCurrentGuideId(null);
      setNoMatchQuery(askInput.trim());
      setAiResponse(null);
    }
  };

  // Speech Recognition (Voice Ask)
  const [isListening, setIsListening] = useState(false);
  const recogRef = useRef(null);

  const voiceReset = () => {
    setIsListening(false);
    if (recogRef.current) {
      try {
        recogRef.current.stop();
      } catch {}
      recogRef.current = null;
    }
  };

  const handleVoiceAsk = () => {
    if (isListening) {
      voiceReset();
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      showToast(isHi ? "वॉइस उपलब्ध नहीं — लिखकर पूछें" : "Voice not available here — please type instead");
      return;
    }

    try {
      const recog = new SR();
      recogRef.current = recog;
      recog.lang = isHi ? "hi-IN" : "en-IN";
      recog.interimResults = true;
      recog.continuous = false;
      recog.maxAlternatives = 1;

      recog.onresult = (ev) => {
        let finalTxt = "";
        let interim = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) finalTxt += ev.results[i][0].transcript;
          else interim += ev.results[i][0].transcript;
        }
        if (interim) setAskInput(interim);
        if (finalTxt) {
          setAskInput(finalTxt);
          voiceReset();
          // Trigger search directly with recognized text
          const q = finalTxt.trim().toLowerCase();
          let best = null;
          let bestScore = 0;
          GUIDES.forEach((g) => {
            let s = 0;
            g.kw.forEach((k) => {
              if (q.indexOf(k.toLowerCase()) > -1) s += k.length;
            });
            if (g.en.toLowerCase() === q || g.hi === q) s += 50;
            if (s > bestScore) {
              bestScore = s;
              best = g;
            }
          });
          if (best && bestScore > 0) {
            handleSelectGuide(best.id, false);
          } else {
            setCurrentGuideId(null);
            setNoMatchQuery(finalTxt);
          }
        }
      };

      recog.onerror = (ev) => {
        voiceReset();
        const err = ev && ev.error ? ev.error : "";
        if (err === "not-allowed" || err === "service-not-allowed") {
          showToast(isHi ? "माइक की अनुमति बंद है — ब्राउज़र सेटिंग में Allow करें" : "Microphone blocked — allow mic access in browser settings");
        } else if (err === "network") {
          showToast(isHi ? "वॉइस के लिए इंटरनेट चाहिए — लिखकर पूछें" : "Voice recognition requires connection — type instead");
        } else if (err === "no-speech") {
          showToast(isHi ? "आवाज़ सुनाई नहीं दी — फिर बोलें" : "No speech heard — tap mic and speak again");
        } else {
          showToast(isHi ? "आवाज़ सुनाई नहीं दी — फिर कोशिश करें" : "Could not hear that — please try again");
        }
      };

      recog.onend = () => {
        voiceReset();
      };

      recog.start();
      setIsListening(true);
      showToast(isHi ? "सुन रहा हूँ… आपात स्थिति बोलें" : "Listening… speak the emergency now");
    } catch (e) {
      voiceReset();
      showToast(isHi ? "माइक शुरू नहीं हुआ — फिर कोशिश करें" : "Mic could not start — please try again");
    }
  };

  // Speech Synthesis (Read steps aloud)
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeakSteps = (guide) => {
    if (!("speechSynthesis" in window)) {
      showToast(isHi ? "इस ब्राउज़र में आवाज़ उपलब्ध नहीं है" : "Voice is not available in this browser");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast(isHi ? "सुनाना बंद कर दिया" : "Stopped reading");
      return;
    }

    window.speechSynthesis.cancel();
    const st = getGuideSteps(guide);
    const textToSpeak = `${getGuideTitle(guide)}. ${st.join(". ")}`;

    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = isHi ? "hi-IN" : "en-IN";
    utter.rate = 0.92;

    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utter);
    setIsSpeaking(true);
    showToast(isHi ? "स्टेप्स सुनाए जा रहे हैं…" : "Reading the steps aloud…");
  };

  // Copy Steps to Clipboard
  const handleCopySteps = (guide) => {
    const st = getGuideSteps(guide);
    const txt = `Suraksha — ${getGuideTitle(guide)}\n${getGuideTitle(guide)}. ${st.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nDo NOT: ${getGuideDont(guide)}\n\nIn serious emergency, call 112 immediately.`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(
        () => showToast(isHi ? "स्टेप्स कॉपी हो गए — WhatsApp पर भेजें" : "Steps copied — share them on WhatsApp"),
        () => showToast(isHi ? "कॉपी नहीं हुआ" : "Copy failed")
      );
    } else {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        showToast(isHi ? "स्टेप्स कॉपी हो गए — WhatsApp पर भेजें" : "Steps copied — share them on WhatsApp");
      } catch {
        showToast(isHi ? "कॉपी नहीं हुआ" : "Copy failed");
      }
      document.body.removeChild(ta);
    }
  };

  // ================= MADAD SMS =================
  const [madadContacts, setMadadContacts] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_madad_contacts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [madadName, setMadadName] = useState("");
  const [madadPhone, setMadadPhone] = useState("");
  const [madadStatus, setMadadStatus] = useState("");
  const [madadSending, setMadadSending] = useState(false);

  const [madadLocation, setMadadLocation] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_madad_location");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [madadLandmark, setMadadLandmark] = useState(() => {
    try {
      return localStorage.getItem("suraksha_madad_landmark") || "";
    } catch {
      return "";
    }
  });

  const handleSetMadadLocation = (coords) => {
    setMadadLocation(coords);
    try {
      localStorage.setItem("suraksha_madad_location", JSON.stringify(coords));
    } catch {}
  };

  const handleSetMadadLandmark = (val) => {
    setMadadLandmark(val);
    try {
      localStorage.setItem("suraksha_madad_landmark", val);
    } catch {}
  };

  const cleanPhone = (p) => (p || "").replace(/[^\d+]/g, "");
  const isValidPhone = (p) => {
    const d = p.replace(/\D/g, "");
    return d.length >= 10 && d.length <= 13;
  };

  const handleAddMadadContact = (e) => {
    e.preventDefault();
    const name = madadName.trim();
    const raw = madadPhone.trim();
    const phone = cleanPhone(raw);

    if (!name) {
      showToast(isHi ? "पहले नाम लिखें — जैसे Maa, Bhaiya" : "Add a name first — e.g. Maa, Bhaiya");
      return;
    }
    if (!isValidPhone(phone)) {
      showToast(isHi ? "सही 10-digit mobile number डालें" : "Enter a valid 10-digit mobile number");
      return;
    }
    if (madadContacts.some((c) => c.phone === phone)) {
      showToast(isHi ? "Ye number pehle se save hai" : "This number is already saved");
      return;
    }

    const updated = [...madadContacts, { name, phone }];
    setMadadContacts(updated);
    try {
      localStorage.setItem("suraksha_madad_contacts", JSON.stringify(updated));
    } catch {}

    setMadadName("");
    setMadadPhone("");
    showToast(isHi ? `Number save ho gaya: ${name}` : `Number saved: ${name}`);
    setMadadStatus(
      isHi
        ? `✓ ${name} का नंबर सेव है। अब इमरजेंसी में नीचे “मदद SMS भेजो” दबाएँ।`
        : `✓ ${name} saved. In an emergency, tap “Send Madad SMS” below.`
    );
  };

  const handleRemoveMadadContact = (idx) => {
    const updated = madadContacts.filter((_, i) => i !== idx);
    setMadadContacts(updated);
    try {
      localStorage.setItem("suraksha_madad_contacts", JSON.stringify(updated));
    } catch {}
    showToast(isHi ? "Number hata diya gaya" : "Number removed");
  };

  // Format phone for WhatsApp wa.me links (default India +91 for 10-digit numbers)
  const formatWhatsAppPhone = (phone) => {
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const handleSendWhatsApp = (targetContact = null) => {
    const recipient = targetContact || madadContacts[0] || null;
    const lat = madadLocation?.lat != null ? madadLocation.lat.toFixed(6) : null;
    const lng = madadLocation?.lng != null ? madadLocation.lng.toFixed(6) : null;

    let msg = "🆘 *MADAD CHAHIYE — EMERGENCY*\nMain yahan hoon, please help!";
    if (lat !== null && lng !== null) {
      msg += `\n📍 Live Location: https://maps.google.com/?q=${lat},${lng}`;
    } else {
      msg += "\n📍 Location link: Please call me right now to check where I am.";
    }
    if (madadLandmark && madadLandmark.trim()) {
      msg += `\n🏠 Landmark: ${madadLandmark.trim()}`;
    }
    msg += "\n— Suraksha Madad";

    const waPhone = recipient ? formatWhatsAppPhone(recipient.phone) : "";
    const waUrl = waPhone
      ? `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    setMadadStatus(
      recipient
        ? isHi
          ? `💬 ${recipient.name} के लिए WhatsApp खुल रहा है — लोकेशन के साथ मैसेज तैयार है, बस Send दबाएँ।`
          : `💬 Opening WhatsApp for ${recipient.name} — your location message is ready, just tap Send.`
        : isHi
        ? "💬 WhatsApp खुल रहा है — किसी भी कॉन्टैक्ट को चुनकर लोकेशन के साथ मैसेज भेजें।"
        : "💬 Opening WhatsApp — pick a contact or group to send your live location message."
    );

    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleSendMadadSMS = () => {
    if (!madadContacts.length) {
      showToast(isHi ? "Pehle family ka number save karein" : "Save a family number first");
      setMadadStatus(
        isHi
          ? "⚠ पहले ऊपर परिवार / दोस्त का नंबर सेव करें, फिर मदद SMS भेजें।"
          : "⚠ Save a family / friend number above first, then send Madad SMS."
      );
      const madadEl = document.getElementById("madad");
      if (madadEl) madadEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setMadadSending(true);
    setMadadStatus(
      isHi
        ? "📍 आपकी GPS लोकेशन ली जा रही है… Allow करें अगर फोन पूछे। लोकेशन मिले या न मिले, SMS रेडी हो जाएगा।"
        : "📍 Getting your GPS location… Allow it if your phone asks. The SMS will be ready either way."
    );

    const finishSMS = (lat, lng) => {
      setMadadSending(false);
      const numbers = madadContacts.map((c) => c.phone).join(",");
      let msg = "Madad chahiye, main yahan hoon";
      if (lat !== null && lng !== null) {
        msg += `\nMeri location: https://maps.google.com/?q=${lat},${lng}`;
      } else {
        msg += "\n(Meri location nahi mil payi — please mujhe call karke poochhein main kahan hoon)";
      }
      if (madadLandmark && madadLandmark.trim()) {
        msg += `\nLandmark: ${madadLandmark.trim()}`;
      }
      msg += "\n— Suraksha Madad SMS";

      const href = `sms:${numbers}?&body=${encodeURIComponent(msg)}`;
      setMadadStatus(
        isHi
          ? "SMS app खुल रहा है — मैसेज रेडी है, बस Send दबाएँ। अगर app न खुले तो अपने SMS app में यही मैसेज भेजें।"
          : "Your SMS app is opening — the message is ready, just tap Send."
      );

      const a = document.createElement("a");
      a.href = href;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
      }, 600);
    };

    // If exact location is already locked via GPS or Map Pin, send immediately!
    if (madadLocation && madadLocation.lat != null && madadLocation.lng != null) {
      finishSMS(madadLocation.lat.toFixed(6), madadLocation.lng.toFixed(6));
      return;
    }

    if (!navigator.geolocation || !window.isSecureContext) {
      finishSMS(null, null);
      return;
    }

    const timer = setTimeout(() => {
      finishSMS(null, null);
    }, 8500);

    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          finishSMS(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6));
        },
        () => {
          clearTimeout(timer);
          finishSMS(null, null);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    } catch {
      clearTimeout(timer);
      finishSMS(null, null);
    }
  };


  // Filtered guides for the directory section
  const filteredGuides = GUIDES.filter((g) => {
    if (!searchGuideQuery.trim()) return true;
    const q = searchGuideQuery.toLowerCase();
    return (
      g.en.toLowerCase().includes(q) ||
      g.hi.toLowerCase().includes(q) ||
      g.enD.toLowerCase().includes(q) ||
      g.hiD.toLowerCase().includes(q) ||
      g.kw.some((k) => k.toLowerCase().includes(q))
    );
  });

  const activeGuideObj = GUIDES.find((g) => g.id === currentGuideId) || null;

  return (
    <main id="top">
      {/* ================= HERO SECTION ================= */}
      <div className="wrap hero">
        <svg className="leaf" style={{ left: "-18px", top: "70px", width: "64px" }} viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 5C20 30 10 60 50 95C90 60 80 30 50 5Z" fill="#8BC34A" opacity=".55" />
          <path d="M50 10V90" stroke="#4A7C2E" strokeWidth="3" />
        </svg>
        <svg className="leaf" style={{ right: "42%", top: "8px", width: "38px" }} viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 5C20 30 10 60 50 95C90 60 80 30 50 5Z" fill="#AED581" />
        </svg>

        <div className="hero-grid">
          <div>
            <span className="hero-badge">🌿 <span>{copy.eyebrow || "ON-DEVICE FIRST-AID AI • INDIA"}</span></span>
            <h1>
              {isHi ? (
                <>
                  तुरंत फ़र्स्ट-एड स्टेप्स।<br />
                  <em>सिग्नल न हो?</em><br />
                  कोई बात नहीं।
                </>
              ) : (
                <>
                  Instant first-aid.<br />
                  <em>Zero signal?</em><br />
                  No problem.
                </>
              )}
            </h1>
            <p className="lead">
              {copy.lead || "Suraksha — offline first-aid AI. Ask anything in Hindi or English and get instant emergency steps, even with no internet."}
            </p>
            <div className="hero-ctas">
              <a href="#ask" className="cta-dark">
                {isHi ? "सुरक्षा से पूछें →" : "Ask Suraksha →"}
              </a>
              <a href="#guides" className="cta-light">
                {isHi ? "गाइड देखें" : "Browse Guides"}
              </a>
            </div>
            <div className="stats">
              <div className="stat">
                <b>{copy.s1 || "12 Verified Protocols"}</b>
                <span>{copy.s1s || "Clear numbered steps"}</span>
              </div>
              <div className="stat">
                <b>{copy.s2 || "Hindi + English"}</b>
                <span>{copy.s2s || "Devanagari & Hinglish"}</span>
              </div>
              <div className="stat">
                <b>{copy.s3 || "0 KB Internet Needed"}</b>
                <span>{copy.s3s || "Runs 100% on-device"}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" id="ask">
            <div className="splash"></div>
            <div
              style={{
                position: "absolute",
                top: "-18px",
                left: "6px",
                zIndex: 3,
                background: "#fff",
                border: "1px solid #E8DCC0",
                borderRadius: "14px 14px 14px 4px",
                padding: "9px 13px",
                transform: "rotate(-3deg)",
                boxShadow: "0 10px 24px rgba(20,54,32,.12)",
                fontFamily: "var(--serif-display)",
                fontStyle: "italic",
                fontSize: "14.5px",
                color: "#143620"
              }}
            >
              no internet? <b style={{ fontStyle: "normal" }}>no tension</b> 🌿
            </div>
            <div style={{ textAlign: "center", fontSize: "54px", lineHeight: 1, marginBottom: "6px" }}>
              🩹&nbsp;🚑&nbsp;🍃
            </div>

            <div className="askcard">
              <div className="askhead">
                <span className="t">
                  <span className="shield">✚</span>
                  <span>{copy.askTitle || "Ask Suraksha"}</span>
                </span>
                <span className="pill">
                  <span className="dot"></span>
                  <span>{copy.ondevice || "ON-DEVICE • OFFLINE"}</span>
                </span>
              </div>

              <form className="askrow" id="askForm" onSubmit={handleAskSubmit}>
                <input
                  id="askInput"
                  type="text"
                  autoComplete="off"
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  placeholder={
                    isHi
                      ? "क्या हुआ? (जैसे, जल गया, साँप, गले में अटका)"
                      : "Kya hua? What happened? (e.g., burn, साँप, choking)"
                  }
                />
                <button
                  className={`micbtn ${isListening ? "listening" : ""}`}
                  type="button"
                  id="micBtn"
                  onClick={handleVoiceAsk}
                  aria-label="Speak your emergency"
                >
                  {isListening ? "●" : "🎙"}
                </button>
                <button className="askbtn" type="submit">
                  {copy.askBtn || "Ask"}
                </button>
              </form>

              {/* Quick Chips */}
              <div className="chips" id="chips">
                {["snake", "burns", "choking", "cpr", "heat", "bleeding"].map((id) => {
                  const g = GUIDES.find((x) => x.id === id);
                  if (!g) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      className="chip"
                      onClick={() => handleQuickAsk(id)}
                    >
                      {getGuideTitle(g)}
                    </button>
                  );
                })}
              </div>

              {/* Recent Checks */}
              <div className="recent" id="recent">
                <div className="lbl" id="recentLbl">
                  {isHi ? "हाल की जाँचें" : "RECENT CHECKS"}
                </div>
                <div className="chips" id="recentChips" style={{ marginTop: 0 }}>
                  {recentList.length > 0 ? (
                    recentList.map((rid) => {
                      const g = GUIDES.find((x) => x.id === rid);
                      if (!g) return null;
                      return (
                        <button
                          key={rid}
                          type="button"
                          className="chip"
                          onClick={() => handleQuickAsk(rid)}
                        >
                          ↺ {getGuideTitle(g)}
                        </button>
                      );
                    })
                  ) : (
                    <span className="none" id="recentNone">
                      {isHi
                        ? "अभी कोई जाँच नहीं हुई — ऊपर पूछें और आपकी गाइड यहाँ दिखेंगी।"
                        : "No checks yet — ask above and your recent guides will appear here for one-tap reopening."}
                    </span>
                  )}
                </div>
              </div>

              {/* Result Area */}
              {activeGuideObj ? (
                <div className="result flash" id="result">
                  <span className={`sev ${activeGuideObj.sev === "high" ? "high" : "med"}`}>
                    {activeGuideObj.sev === "high"
                      ? isHi
                        ? "⚠ गंभीर — 112 बुलाएँ"
                        : "⚠ SERIOUS — CALL 112"
                      : isHi
                      ? "मध्यम गंभीरता"
                      : "MODERATE"}
                  </span>
                  <h3>{getGuideTitle(activeGuideObj)}</h3>
                  <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>
                    {getGuideDesc(activeGuideObj)}
                  </p>
                  <ol className="steps">
                    {getGuideSteps(activeGuideObj).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                  <div className="donts">
                    <b>{isHi ? "क्या न करें: " : "Do NOT: "}</b>
                    {getGuideDont(activeGuideObj)}
                  </div>
                  <div className="result-actions">
                    <a className="btn red" href="tel:112">
                      📞 {isHi ? "112 बुलाएँ" : "Call 112"}
                    </a>
                    {primaryAshaContact && (
                      <a
                        className="btn asha-quick-btn"
                        href={`tel:${primaryAshaContact.phone}`}
                      >
                        🩺 {copy.ashaQuickCallPrefix || "Call ASHA / Doctor"} ({primaryAshaContact.name})
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn solid"
                      onClick={() => handleSpeakSteps(activeGuideObj)}
                    >
                      🔊 {isSpeaking ? (isHi ? "रोकें" : "Stop listening") : (isHi ? "स्टेप्स सुनें" : "Listen to steps")}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleCopySteps(activeGuideObj)}
                    >
                      ⧉ {isHi ? "स्टेप्स कॉपी करें" : "Copy steps"}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ background: "var(--lime3)", border: "1.5px solid var(--dark)" }}
                      onClick={() => handleAskAI(`${getGuideTitle(activeGuideObj)} emergency first-aid`)}
                      disabled={aiLoading}
                    >
                      ✨ {aiLoading ? (isHi ? "AI सोच रहा है..." : "Asking AI...") : (isHi ? "विस्तृत AI सहायता" : "Ask AI for detailed help")}
                    </button>
                  </div>

                  {aiResponse && (
                    <div className="ai-response-box" style={{ marginTop: "16px" }}>
                      <div className="ai-response-header">
                        <span className="ai-response-title">Suraksha AI Guidance</span>
                        <span className={aiResponse.badgeClass}>{aiResponse.badgeText}</span>
                      </div>
                      <p className="ai-response-text" style={{ whiteSpace: "pre-wrap" }}>
                        {aiResponse.text}
                      </p>
                    </div>
                  )}
                </div>
              ) : noMatchQuery ? (
                <div className="result" id="result">
                  <h3>{isHi ? "सुनिश्चित नहीं — सुरक्षित रहें" : "Not sure — play it safe"}</h3>
                  <p style={{ color: "var(--muted)" }}>
                    {isHi
                      ? "मैं इसे किसी गाइड से नहीं मिला पाया। अगर व्यक्ति गंभीर हालत में है, तुरंत 112 बुलाएँ या नीचे AI से विस्तृत मदद लें।"
                      : "I could not match that to a standard offline guide. If the person is serious, call 112 now or ask our Hybrid AI for guidance."}
                  </p>
                  <div className="result-actions">
                    <a className="btn red" href="tel:112">
                      📞 Call 112
                    </a>
                    {primaryAshaContact && (
                      <a
                        className="btn asha-quick-btn"
                        href={`tel:${primaryAshaContact.phone}`}
                      >
                        🩺 {copy.ashaQuickCallPrefix || "Call ASHA / Doctor"} ({primaryAshaContact.name})
                      </a>
                    )}
                    <a className="btn" href="#guides">
                      {isHi ? "सभी गाइड देखें" : "See all guides"}
                    </a>
                    <button
                      type="button"
                      className="btn solid"
                      onClick={() => handleAskAI(noMatchQuery)}
                      disabled={aiLoading}
                    >
                      ✨ {aiLoading ? "Thinking..." : "Ask AI for detailed help"}
                    </button>
                  </div>

                  {aiResponse && (
                    <div className="ai-response-box" style={{ marginTop: "16px" }}>
                      <div className="ai-response-header">
                        <span className="ai-response-title">Suraksha AI Guidance</span>
                        <span className={aiResponse.badgeClass}>{aiResponse.badgeText}</span>
                      </div>
                      <p className="ai-response-text" style={{ whiteSpace: "pre-wrap" }}>
                        {aiResponse.text}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="result empty" id="result">
                  <div style={{ fontSize: "26px" }}>⌕</div>
                  <div className="big">{copy.emptyT || "Type any emergency or pick a guide below"}</div>
                  <div>{copy.emptyS || "Try typing burn, snake bite, khoon, साँप, or tap a quick chip above."}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="charm-ribbon" aria-hidden="true">
          <span className="line"></span>
          <p>
            <span>✦</span> &nbsp;ghabrayein nahi — bas step-by-step follow karein&nbsp; <span>✦</span>
          </p>
          <span className="line"></span>
        </div>
      </div>

      {/* ================= MADAD SMS ================= */}
      <section id="madad" style={{ paddingTop: "18px", paddingBottom: "10px" }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>{copy.madadH || "Madad SMS — One Tap Help"}</h2>
            <p>
              {copy.madadP ||
                "Accident ya emergency mein ek tap — aapke family number par location ke saath SMS jayega. SMS ko internet nahi chahiye, isliye ye offline bhi chalega."}
            </p>
          </div>

          <div className="madad-card">
            <div className="madad-top">
              <div className="madad-badge" aria-hidden="true">
                ✉️
              </div>
              <div>
                <h3>{copy.madadCardT || "Save your family number"}</h3>
                <p>
                  {copy.madadCardP ||
                    "Pehle ek trusted family / friend ka number save karein. Emergency mein neeche wala bada button dabate hi SMS app khulega — message aur aapki GPS location ready milegi, bas Send dabana hai."}
                </p>
              </div>
            </div>

            <form className="madad-form" id="madadForm" onSubmit={handleAddMadadContact}>
              <input
                id="madadName"
                type="text"
                autoComplete="name"
                value={madadName}
                onChange={(e) => setMadadName(e.target.value)}
                placeholder={isHi ? "नाम — जैसे माँ, भैया" : "Name — e.g. Maa, Bhaiya"}
              />
              <input
                id="madadPhone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={madadPhone}
                onChange={(e) => setMadadPhone(e.target.value)}
                placeholder={isHi ? "मोबाइल नंबर — जैसे 98765 43210" : "Mobile number — e.g. 98765 43210"}
              />
              <button type="submit" className="madad-add" id="madadAddBtn">
                {copy.madadAdd || "＋ Save Number"}
              </button>
            </form>

            {madadContacts.length === 0 ? (
              <div id="madadEmpty" className="madad-empty">
                {copy.madadEmpty ||
                  "Abhi koi number save nahi hai. Upar apne family member ka number save karein — wahi number Madad SMS ke liye use hoga."}
              </div>
            ) : (
              <div className="madad-list" id="madadList" aria-live="polite">
                {madadContacts.map((c, i) => (
                  <div key={i} className="madad-item">
                    <div>
                      <b>{c.name}</b>
                      <span>{c.phone}</span>
                    </div>
                    <div className="madad-item-actions">
                      <button
                        type="button"
                        className="madad-item-wa"
                        onClick={() => handleSendWhatsApp(c)}
                        aria-label={`Send WhatsApp to ${c.name}`}
                      >
                        💬 WhatsApp
                      </button>
                      <button
                        type="button"
                        className="madad-remove"
                        onClick={() => handleRemoveMadadContact(i)}
                        aria-label="Remove number"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <MadadLocationTracker
              isHi={isHi}
              location={madadLocation}
              setLocation={handleSetMadadLocation}
              landmark={madadLandmark}
              setLandmark={handleSetMadadLandmark}
              onToast={showToast}
            />

            <button
              type="button"
              className="madad-send"
              id="madadSendBtn"
              onClick={handleSendMadadSMS}
              disabled={madadSending}
            >
              <span aria-hidden="true">🆘</span>
              <span>{madadSending ? (isHi ? "📍 लोकेशन ले रहे हैं…" : "📍 Getting location…") : copy.madadSend || "Madad SMS Bhejo — Location ke Saath"}</span>
            </button>

            <button
              type="button"
              className="madad-wa"
              id="madadWaBtn"
              onClick={() => handleSendWhatsApp(null)}
            >
              <span aria-hidden="true">💬</span>
              <span>
                {isHi
                  ? "WhatsApp पर मदद भेजें — लोकेशन के साथ"
                  : "Send Madad on WhatsApp — With Live Location"}
              </span>
            </button>

            {madadStatus && (
              <div className="madad-status show" id="madadStatus" role="status">
                {madadStatus}
              </div>
            )}

            <p className="madad-note">
              {copy.madadNote ||
                "Message: “Madad chahiye, main yahan hoon” + Google Maps location link. Location ke liye phone ka GPS / Location ON rakhein. SMS bhejne par aapke plan ke normal SMS charges lag sakte hain. Serious emergency mein pehle 112 bhi call karein."}
            </p>
          </div>
        </div>
      </section>

      {/* ================= EMERGENCY GUIDES DIRECTORY ================= */}
      <section id="guides">
        <div className="wrap">
          <div className="sec-head">
            <h2>{copy.gH || "Emergency Guides"}</h2>
            <p>
              {copy.gP ||
                "Tap any emergency for step-by-step first aid, what NOT to do, and when to call 112. Everything works offline."}
            </p>
          </div>

          <div className="toolbar">
            <input
              id="guideSearch"
              type="search"
              value={searchGuideQuery}
              onChange={(e) => setSearchGuideQuery(e.target.value)}
              placeholder={isHi ? "गाइड खोजें — जलना, साँप, दिल का दौरा…" : "Search guides — burn, साँप, dil ka daura…"}
            />
          </div>

          <div className="grid" id="guideGrid">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className="gcard"
                  onClick={() => handleSelectGuide(g.id, true)}
                >
                  <span className="gicon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <h3>{getGuideTitle(g)}</h3>
                  <p>{getGuideDesc(g)}</p>
                  <div className="meta">
                    {isHi ? "स्टेप्स देखें →" : "View steps →"} &nbsp;•&nbsp;{" "}
                    {g.sev === "high"
                      ? isHi
                        ? "गंभीर"
                        : "Serious"
                      : isHi
                      ? "मध्यम"
                      : "Moderate"}
                  </div>
                </button>
              ))
            ) : (
              <p style={{ color: "var(--muted)", gridColumn: "1/-1", textAlign: "center" }}>
                {isHi ? "कोई गाइड नहीं मिली। कुछ और लिखकर देखें।" : "No guide matched. Try another word."}
              </p>
            )}
          </div>

          {/* Inline Expanded Guide Detail */}
          {activeGuideObj && (
            <div className="detail open" id="detail">
              <span className={`sev ${activeGuideObj.sev === "high" ? "high" : "med"}`}>
                {activeGuideObj.sev === "high"
                  ? isHi
                    ? "⚠ गंभीर — 112 बुलाएँ"
                    : "⚠ SERIOUS — CALL 112"
                  : isHi
                  ? "मध्यम गंभीरता"
                  : "MODERATE"}
              </span>
              <h3>{getGuideTitle(activeGuideObj)}</h3>
              <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>
                {getGuideDesc(activeGuideObj)}
              </p>
              <ol className="steps">
                {getGuideSteps(activeGuideObj).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
              <div className="donts">
                <b>{isHi ? "क्या न करें: " : "Do NOT: "}</b>
                {getGuideDont(activeGuideObj)}
              </div>
              <div className="result-actions">
                <a className="btn red" href="tel:112">
                  📞 {isHi ? "112 बुलाएँ" : "Call 112"}
                </a>
                {primaryAshaContact && (
                  <a
                    className="btn asha-quick-btn"
                    href={`tel:${primaryAshaContact.phone}`}
                  >
                    🩺 {copy.ashaQuickCallPrefix || "Call ASHA / Doctor"} ({primaryAshaContact.name})
                  </a>
                )}
                <button
                  type="button"
                  className="btn solid"
                  onClick={() => handleSpeakSteps(activeGuideObj)}
                >
                  🔊 {isSpeaking ? (isHi ? "रोकें" : "Stop listening") : (isHi ? "स्टेप्स सुनें" : "Listen to steps")}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleCopySteps(activeGuideObj)}
                >
                  ⧉ {isHi ? "स्टेप्स कॉपी करें" : "Copy steps"}
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ background: "var(--lime3)", border: "1.5px solid var(--dark)" }}
                  onClick={() => handleAskAI(`${getGuideTitle(activeGuideObj)} detailed precautions and first aid`)}
                  disabled={aiLoading}
                >
                  ✨ {aiLoading ? (isHi ? "AI सोच रहा है..." : "Asking AI...") : (isHi ? "विस्तृत AI सहायता" : "Ask AI for detailed help")}
                </button>
              </div>

              {aiResponse && (
                <div className="ai-response-box" style={{ marginTop: "16px" }}>
                  <div className="ai-response-header">
                    <span className="ai-response-title">Suraksha AI Guidance</span>
                    <span className={aiResponse.badgeClass}>{aiResponse.badgeText}</span>
                  </div>
                  <p className="ai-response-text" style={{ whiteSpace: "pre-wrap" }}>
                    {aiResponse.text}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= 3 REASONS SECTION ================= */}
      <section style={{ paddingTop: "10px" }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>{copy.whyH || "3 Reasons To Choose Suraksha"}</h2>
            <p>
              {isHi
                ? "ताज़ा, सरल और हर वक्त तैयार — जैसे एक फ़र्स्ट-एड किट जो खुद आपको रास्ता दिखाए।"
                : "Fresh, simple and ready when you need it most — like a first-aid kit that talks you through it."}
            </p>
          </div>
          <div className="cards3">
            <div className="rcard">
              <div className="n">01</div>
              <h3>{copy.r1t || "Works 24/7, fully offline"}</h3>
              <p>
                {copy.r1p ||
                  "No signal in a village, lift, highway or basement? Suraksha still answers in seconds — the guides live on your device, not on a server."}
              </p>
            </div>
            <div className="rcard">
              <div className="n">02</div>
              <h3>{copy.r2t || "Hindi + English, spoken aloud"}</h3>
              <p>
                {copy.r2p ||
                  "Ask in Hinglish or Devanagari — “haath jal gaya”, “saans nahi aa rahi” — and tap Listen to hear the steps read out while your hands are busy helping."}
              </p>
            </div>
            <div className="rcard">
              <div className="n">03</div>
              <h3>{copy.r3t || "Clear do’s and don’ts"}</h3>
              <p>
                {copy.r3p ||
                  "Every guide shows the steps in order, the common mistakes to avoid, and a clear line on when home first aid is not enough and 112 must be called."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS BANNER ================= */}
      <section id="how" style={{ paddingTop: "6px" }}>
        <div className="wrap">
          <div className="banner">
            <div>
              <h2>{copy.howH || "Follow These 3 Simple Steps"}</h2>
              <p>{copy.howP || "From panic to action in under a minute."}</p>
              <div className="banner-steps">
                <div className="bstep">
                  <b>1</b>
                  <div>
                    <strong>{copy.st1t || "Describe the emergency"}</strong>
                    <span>
                      {copy.st1p ||
                        "Type or tap what happened — in English, Hindi or Hinglish. No medical words needed."}
                    </span>
                  </div>
                </div>
                <div className="bstep">
                  <b>2</b>
                  <div>
                    <strong>{copy.st2t || "Follow the instant steps"}</strong>
                    <span>
                      {copy.st2p ||
                        "Get numbered first-aid steps instantly, on-device. Listen to them aloud if you can’t look at the screen."}
                    </span>
                  </div>
                </div>
                <div className="bstep">
                  <b>3</b>
                  <div>
                    <strong>{copy.st3t || "Call & share for help"}</strong>
                    <span>
                      {copy.st3p ||
                        "One tap calls 112. Copy the steps and send them to family on WhatsApp so everyone knows what to do."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="banner-visual">
              <div>
                <div className="big-cross">✚</div>
                <h3>
                  {isHi ? (
                    <>
                      10 सेकंड में<br />मदद तैयार
                    </>
                  ) : (
                    <>
                      Help in<br />under 10 seconds
                    </>
                  )}
                </h3>
                <p style={{ color: "#405347", margin: "8px 0 0" }}>
                  {isHi ? (
                    <>
                      न लॉगिन। न लोडिंग।<br />सिर्फ़ साफ़ स्टेप्स, तुरंत।
                    </>
                  ) : (
                    <>
                      No login. No loading.<br />Just clear steps, instantly.
                    </>
                  )}
                </p>
                <a href="#ask" className="cta-dark" style={{ marginTop: "18px" }}>
                  {isHi ? "अभी आज़माएँ →" : "Try it now →"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HELPLINES SECTION ================= */}
      <section id="helplines" style={{ paddingTop: "10px" }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>{copy.helpH || "India Emergency Helplines"}</h2>
            <p>{copy.helpP || "Tap any number to call. All are free, 24×7."}</p>
          </div>

          <AshaDoctorCard
            contacts={ashaContacts}
            copy={copy}
            onAddClick={handleOpenAddAsha}
            onEditClick={handleOpenEditAsha}
            onDeleteClick={handleDeleteAshaContact}
          />

          <div className="phones">
            <div className="phone">
              <div className="num">112</div>
              <h3>{copy.p1t || "National Emergency"}</h3>
              <p>{copy.p1p || "Police, fire and ambulance — one number for all emergencies across India."}</p>
              <a className="btn red" href="tel:112">
                📞 Call 112
              </a>
            </div>
            <div className="phone">
              <div className="num">108</div>
              <h3>{copy.p2t || "Ambulance"}</h3>
              <p>{copy.p2p || "Free government ambulance service in most states."}</p>
              <a className="btn red" href="tel:108">
                📞 Call 108
              </a>
            </div>
            <div className="phone">
              <div className="num">102</div>
              <h3>{copy.p3t || "Medical Transport"}</h3>
              <p>{copy.p3p || "Ambulance / patient transport helpline, including pregnancy cases."}</p>
              <a className="btn red" href="tel:102">
                📞 Call 102
              </a>
            </div>
            <div className="phone">
              <div className="num">1091</div>
              <h3>{copy.p4t || "Women Helpline"}</h3>
              <p>{copy.p4p || "Help and support for women in distress."}</p>
              <a className="btn red" href="tel:1091">
                📞 Call 1091
              </a>
            </div>
            <div className="phone">
              <div className="num">1098</div>
              <h3>{copy.p5t || "Child Helpline"}</h3>
              <p>{copy.p5p || "CHILDLINE — for any child in danger or in need of care."}</p>
              <a className="btn red" href="tel:1098">
                📞 Call 1098
              </a>
            </div>
            <div className="phone">
              <div className="num">1075</div>
              <h3>{copy.p6t || "Health Helpline"}</h3>
              <p>{copy.p6p || "National health helpline for medical information and guidance."}</p>
              <a className="btn red" href="tel:1075">
                📞 Call 1075
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT & FAQ MODAL ================= */}
      {isAboutFaqOpen && (
        <div
          className="about-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aboutFaqHeading"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseAboutFaq();
          }}
        >
          <div className="about-modal-sheet" id="about-faq">
            <button
              type="button"
              className="about-modal-close"
              onClick={onCloseAboutFaq}
              aria-label={isHi ? "बंद करें" : "Close About & FAQ"}
            >
              ✕
            </button>
            <div className="faqwrap">
              <div className="sec-head" style={{ marginBottom: "18px", paddingTop: "4px" }}>
                <h2 id="aboutFaqHeading">{copy.faqH || "About & FAQ"}</h2>
                <p>{copy.aboutSub || "What Suraksha is, how it works offline, and the questions people ask most."}</p>
              </div>
              <div className="about-card">
                <h3>{copy.aboutT || "About Suraksha"}</h3>
                <p>
                  {isHi
                    ? "सुरक्षा भारत के लिए एक ऑफ़लाइन-फ़र्स्ट फ़र्स्ट-एड फ़ील्ड मैनुअल है। यह 17 आम आपात स्थितियों के लिए साफ़, क्रमवार मदद देता है — हिंदी और अंग्रेज़ी में — सीधे आपके डिवाइस पर, बिना इंटरनेट, बिना लॉगिन और बिना इंतज़ार। सुरक्षा चिकित्सा देखभाल का विकल्प नहीं है — किसी भी गंभीर आपात स्थिति में पहले 112 बुलाएँ।"
                    : "Suraksha is an offline-first first-aid field manual for India. It gives clear, step-by-step help for 17 common emergencies — in Hindi and English — right on your device, with no internet, no login and no waiting. It is made for the first few minutes of an emergency: the time before an ambulance or doctor can reach you. Suraksha does not replace medical care — in any serious emergency, call 112 first, then follow the steps while help is on the way."}
                </p>
              </div>
              <details open>
                <summary>{isHi ? I18N.hi.q1 : "Does Suraksha really work without internet?"}</summary>
                <p>
                  {isHi
                    ? "हाँ। Ask बॉक्स और सभी 17 गाइड इसी पेज पर चलते हैं — पेज लोड होने के बाद एयरप्लेन मोड में भी सब काम करता है। सिर्फ़ फ़ोन कॉल के लिए नेटवर्क चाहिए।"
                    : "Yes. The Ask box and all 17 guides run on this page itself — once the page has loaded, you can switch to airplane mode and everything still works. Only phone calls need network, like any call."}
                </p>
              </details>
              <details>
                <summary>{isHi ? I18N.hi.q2 : "Can I ask in Hindi or Hinglish?"}</summary>
                <p>
                  {isHi
                    ? I18N.hi.a2
                    : "Yes. Try “saap ne kaata”, “haath jal gaya”, “khoon beh raha hai” or “लू लग गई”. Suraksha understands English, Hinglish and Devanagari, and the हिंदी button switches the whole page to Hindi."}
                </p>
              </details>
              <details>
                <summary>{isHi ? I18N.hi.q3 : "Does Suraksha replace a doctor?"}</summary>
                <p>
                  {isHi
                    ? I18N.hi.a3
                    : "No. Suraksha gives first aid — the help you give in the first minutes before medical help arrives. For anything serious, always call 112 and get the person to a hospital."}
                </p>
              </details>
              <details>
                <summary>{isHi ? I18N.hi.q4 : "Can I hear the steps instead of reading them?"}</summary>
                <p>
                  {isHi
                    ? I18N.hi.a4
                    : "Yes. Open any guide or ask a question, then tap “Listen to steps”. Your phone reads the steps aloud in Hindi or English, so your hands stay free."}
                </p>
              </details>
              <details>
                <summary>{isHi ? I18N.hi.q5 : "What emergencies does Suraksha cover?"}</summary>
                <p>
                  {isHi
                    ? "17 आपात स्थितियाँ: साँप का काटना, जलना, गले में अटकना, CPR, तेज़ खून बहना, हड्डी टूटना, लू लगना, दिल का दौरा, बिजली का झटका, डूबना, दौरा / मिर्गी, अस्थमा अटैक, लो शुगर, ज़हर, और आँख में चोट। ऊपर “Emergency Guides” दबाकर कोई भी खोलें।"
                    : "17 emergencies: snake bite, burns, choking, CPR (no breathing), heavy bleeding, fracture, heat stroke (loo), heart attack, electric shock, drowning, seizure / mirgi, asthma attack, low sugar, poisoning, and eye injury. Tap “Emergency Guides” above to open any of them, or type what happened in the Ask box."}
                </p>
              </details>
              <details>
                <summary>{isHi ? I18N.hi.q6 : "What should I say when I call 112?"}</summary>
                <p>
                  {isHi
                    ? I18N.hi.a6
                    : "Speak slowly and say, in this order: (1) where you are — city, area and a nearby landmark, (2) what happened, (3) how many people are hurt and their condition, and (4) your phone number. Follow the operator’s instructions and stay on the line until they say you can cut the call."}
                </p>
              </details>
              <details>
                <summary>{isHi ? I18N.hi.q7 : "How does Madad SMS work?"}</summary>
                <p>
                  {isHi
                    ? I18N.hi.a7
                    : "Save a family or friend’s number in the Madad SMS section above. In an emergency, tap “Madad SMS Bhejo” or “Send Madad on WhatsApp” — Suraksha gets your GPS location and opens your SMS or WhatsApp app with “Madad chahiye, main yahan hoon” plus a Google Maps location link ready to send."}
                </p>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* ================= ASHA / DOCTOR MODAL ================= */}
      <AshaDoctorModal
        isOpen={ashaModalOpen}
        editingContact={editingAshaContact}
        existingContacts={ashaContacts}
        copy={copy}
        onClose={handleCloseAshaModal}
        onSave={handleSaveAshaContact}
        onToast={showToast}
      />

      {/* ================= TOAST NOTIFICATION ================= */}
      <div className={`toast ${toastMsg ? "show" : ""}`} id="toast" role="status">
        {toastMsg}
      </div>
    </main>
  );
}
