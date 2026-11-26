import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SURAKSHA_GUIDES } from "../utils/data";
import { fetchGuides, fetchHelplines } from "../services/apiService";
import { findBestMatches } from "../utils/voiceMatcher";

const GuidesContext = createContext();

export function GuidesProvider({ children }) {
  const [guides, setGuides] = useState(SURAKSHA_GUIDES);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGuide, setActiveGuide] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_checked_steps");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("suraksha_checked_steps", JSON.stringify(checkedSteps));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }, [checkedSteps]);

  // Load guides from API or offline fallback
  const loadGuides = useCallback(async (tag = filter, q = searchQuery) => {
    setLoading(true);
    try {
      const data = await fetchGuides(tag, q);
      setGuides(data);
    } catch (e) {
      console.error(e);
      let local = SURAKSHA_GUIDES;
      if (tag && tag !== "all") {
        local = local.filter((g) => g.tags && g.tags.includes(tag));
      }
      if (q && q.trim()) {
        local = findBestMatches(q, local);
      }
      setGuides(local);
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery]);

  useEffect(() => {
    loadGuides(filter, searchQuery);
  }, [filter, searchQuery, loadGuides]);

  const toggleStep = (guideId, stepIndex) => {
    setCheckedSteps((prev) => {
      const current = prev[guideId] || [];
      const isChecked = current.includes(stepIndex);
      const updated = isChecked
        ? current.filter((idx) => idx !== stepIndex)
        : [...current, stepIndex];
      return { ...prev, [guideId]: updated };
    });
  };

  const isStepChecked = (guideId, stepIndex) => {
    return Boolean(checkedSteps[guideId]?.includes(stepIndex));
  };

  const getCompletedCount = (guideId) => {
    return checkedSteps[guideId]?.length || 0;
  };

  const resetCheckedSteps = (guideId) => {
    setCheckedSteps((prev) => ({ ...prev, [guideId]: [] }));
  };

  const openGuide = (guide) => {
    setActiveGuide(guide);
  };

  const closeGuide = () => {
    setActiveGuide(null);
  };

  const openVoiceModal = (prefillPhrase = "") => {
    setIsVoiceModalOpen(true);
  };

  const closeVoiceModal = () => {
    setIsVoiceModalOpen(false);
  };

  return (
    <GuidesContext.Provider
      value={{
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
        getCompletedCount,
        resetCheckedSteps,
        refreshGuides: loadGuides
      }}
    >
      {children}
    </GuidesContext.Provider>
  );
}

export function useGuides() {
  const ctx = useContext(GuidesContext);
  if (!ctx) throw new Error("useGuides must be used within GuidesProvider");
  return ctx;
}
