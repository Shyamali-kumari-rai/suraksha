import { SURAKSHA_GUIDES, HELPLINES } from "../utils/data";
import { findBestMatches } from "../utils/voiceMatcher";

const API_BASE = "/api";

export async function fetchGuides(tag = "all", query = "") {
  try {
    const params = new URLSearchParams();
    if (tag && tag !== "all") params.append("tag", tag);
    if (query && query.trim()) params.append("q", query.trim());

    const res = await fetch(`${API_BASE}/guides?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || SURAKSHA_GUIDES;
  } catch (err) {
    // Offline transparent fallback
    console.warn("Backend API unavailable, using offline dataset:", err.message);
    let results = SURAKSHA_GUIDES;
    if (tag && tag !== "all") {
      results = results.filter((g) => g.tags && g.tags.includes(tag));
    }
    if (query && query.trim()) {
      results = findBestMatches(query, results);
    }
    return results;
  }
}

export async function fetchGuideById(id) {
  try {
    const res = await fetch(`${API_BASE}/guides/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Backend API unavailable, resolving from offline data:", err.message);
    return SURAKSHA_GUIDES.find((g) => g.id === id) || null;
  }
}

export async function fetchHelplines() {
  try {
    const res = await fetch(`${API_BASE}/helplines`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || HELPLINES;
  } catch (err) {
    return HELPLINES;
  }
}

export async function sendEmergencyAlert(data) {
  try {
    const res = await fetch(`${API_BASE}/emergency-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.warn("Offline: Logged emergency call locally:", data);
    return { success: true, offline: true, data };
  }
}
