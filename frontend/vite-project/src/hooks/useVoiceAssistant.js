import { useState, useEffect, useRef, useCallback } from "react";
import { findBestMatches, hasDevanagari } from "../utils/voiceMatcher";
import { SURAKSHA_GUIDES } from "../utils/data";

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceLang, setVoiceLang] = useState("hi-IN"); // 'hi-IN' or 'en-IN'
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [activeSpeakingStep, setActiveSpeakingStep] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const speechRunIdRef = useRef(0);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
      setStatusMessage("Voice recognition not supported in this browser. Please type below.");
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setStatusMessage(
          voiceLang.startsWith("hi")
            ? "सुन रहे हैं... कृपया बोलें"
            : "Listening... speak now"
        );
      };

      rec.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      rec.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setIsListening(false);
        if (e.error === "not-allowed") {
          setStatusMessage("Microphone permission denied. Please allow microphone access or type your query.");
        } else if (e.error === "no-speech") {
          setStatusMessage("No speech detected. Tap the mic and try again.");
        } else {
          setStatusMessage("Could not hear clearly. Try speaking again or type below.");
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } catch (err) {
      console.warn("SpeechRec init error:", err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      stopSpeaking();
    };
  }, [voiceLang]);

  // When transcript updates and is final, match guide
  const processQuery = useCallback((queryText) => {
    if (!queryText || !queryText.trim()) return;
    const matches = findBestMatches(queryText, SURAKSHA_GUIDES);
    if (matches.length > 0) {
      const top = matches[0];
      setMatchedGuide(top);
      setStatusMessage(`Found guide: ${top.en} / ${top.hi}`);
      // Auto speak steps in the preferred language
      const isHindiQuery = hasDevanagari(queryText) || voiceLang.startsWith("hi");
      const stepsToSpeak = isHindiQuery ? top.stepsHi : top.steps;
      speakSteps(stepsToSpeak, isHindiQuery ? "hi-IN" : "en-IN");
    } else {
      setMatchedGuide(null);
      setStatusMessage("No exact guide found — please call 112 for urgent emergency assistance.");
    }
  }, [voiceLang]);

  const startListening = () => {
    stopSpeaking();
    setTranscript("");
    setMatchedGuide(null);
    if (!recognitionRef.current) {
      setStatusMessage("Voice recognition unavailable. Please type your query.");
      return;
    }

    try {
      recognitionRef.current.lang = voiceLang;
      recognitionRef.current.start();
    } catch (err) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        processQuery(transcript);
      }
    } else {
      startListening();
    }
  };

  // Helper to pick regional voice
  const pickVoice = (langCode) => {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    const exact = voices.find((v) => (v.lang || "").toLowerCase() === langCode.toLowerCase());
    if (exact) return exact;
    const prefix = langCode.toLowerCase().slice(0, 2);
    return voices.find((v) => (v.lang || "").toLowerCase().startsWith(prefix)) || null;
  };

  const stopSpeaking = () => {
    speechRunIdRef.current++;
    setIsSpeaking(false);
    setActiveSpeakingStep(-1);
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  };

  const speakSteps = (steps, langCode = voiceLang) => {
    if (!("speechSynthesis" in window) || !steps || steps.length === 0) return;

    stopSpeaking();
    const currentRun = speechRunIdRef.current;
    setIsSpeaking(true);

    const voice = pickVoice(langCode);
    let idx = 0;

    const next = () => {
      if (currentRun !== speechRunIdRef.current) return;
      if (idx >= steps.length) {
        setIsSpeaking(false);
        setActiveSpeakingStep(-1);
        return;
      }

      setActiveSpeakingStep(idx);
      const prefix = langCode.startsWith("hi") ? `कदम ${idx + 1}. ` : `Step ${idx + 1}. `;
      const utter = new SpeechSynthesisUtterance(prefix + steps[idx]);
      utter.lang = langCode;
      utter.rate = 0.95;
      if (voice) utter.voice = voice;

      utter.onend = () => {
        if (currentRun !== speechRunIdRef.current) return;
        idx++;
        next();
      };

      utter.onerror = () => {
        if (currentRun !== speechRunIdRef.current) return;
        setIsSpeaking(false);
        setActiveSpeakingStep(-1);
      };

      window.speechSynthesis.speak(utter);
    };

    next();
  };

  return {
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
  };
}
