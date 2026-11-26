const { GUIDES, HELPLINES } = require("../data/guidesData");

const STOP_WORDS = new Set([
  "hai", "hain", "ho", "raha", "rahi", "rahe", "gaya", "gayi", "gaye",
  "me", "mein", "ko", "ka", "ki", "ke", "se", "par", "pe", "mere", "mera",
  "meri", "mujhe", "bahut", "thoda", "de", "kar", "karo", "kya", "hua",
  "i", "am", "is", "are", "have", "has", "my", "the", "a", "an", "in", "on", "to", "for", "of",
  "है", "हैं", "हो", "रहा", "रही", "रहे", "गया", "गई", "में", "को", "का", "की", "के", "से", "मेरे", "मेरा", "मेरी", "मुझे", "बहुत", "दे"
]);

function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[.,!?।;:"'()\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreGuide(item, rawQuery) {
  const q = normalizeText(rawQuery);
  if (!q) return 1;

  const en = normalizeText(item.en);
  const hi = normalizeText(item.hi);
  let score = 0;

  if (en === q || hi === q) score += 140;
  else if (en.startsWith(q) || hi.startsWith(q)) score += 90;
  else if (en.includes(q) || hi.includes(q) || q.includes(en) || q.includes(hi)) score += 70;

  if (item.phrases) {
    for (let i = 0; i < item.phrases.length; i++) {
      const ph = normalizeText(item.phrases[i]);
      if (q === ph) score += 130;
      else if (q.includes(ph) || ph.includes(q)) score += 85;
    }
  }

  const tokens = q.split(" ").filter(function (t) {
    return t.length > 1 && !STOP_WORDS.has(t);
  });

  const kwSet = (item.keywords || []).map(normalizeText);
  const stepsBlob = normalizeText((item.steps || []).join(" ") + " " + (item.stepsHi || []).join(" "));

  if (tokens.length === 0) {
    for (let i = 0; i < kwSet.length; i++) {
      if (kwSet[i].includes(q) || q.includes(kwSet[i])) score += 25;
    }
    return score;
  }

  let matchedTokens = 0;
  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];
    let tokenBest = 0;

    if (en.includes(tok) || hi.includes(tok)) {
      tokenBest = Math.max(tokenBest, 35);
    }

    for (let k = 0; k < kwSet.length; k++) {
      const kw = kwSet[k];
      if (kw === tok) {
        tokenBest = Math.max(tokenBest, 45);
      } else if (kw.startsWith(tok) || (tok.length >= 3 && kw.includes(tok))) {
        tokenBest = Math.max(tokenBest, 26);
      }
    }

    if (tokenBest === 0 && tok.length >= 3 && stepsBlob.includes(tok)) {
      tokenBest = 10;
    }

    if (tokenBest > 0) {
      matchedTokens++;
      score += tokenBest;
    }
  }

  if (matchedTokens >= 2) {
    score += matchedTokens * 18;
  }

  return score;
}

// In-memory alert store for emergency dispatch events
const emergencyAlertLogs = [];

exports.getAllGuides = (req, res) => {
  try {
    const { category, tag, q } = req.query;
    let list = [...GUIDES];

    if (category && category !== "all") {
      list = list.filter((g) => g.group === category);
    }

    if (tag && tag !== "all") {
      list = list.filter((g) => g.tags && g.tags.includes(tag));
    }

    if (q && q.trim()) {
      list = list
        .map((item) => ({ item, score: scoreGuide(item, q) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.item);
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGuideById = (req, res) => {
  try {
    const { id } = req.params;
    const guide = GUIDES.find((g) => g.id === id);

    if (!guide) {
      return res.status(404).json({ success: false, message: `Guide '${id}' not found` });
    }

    res.json({ success: true, data: guide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchGuides = (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.json({ success: true, count: GUIDES.length, data: GUIDES });
    }

    const matches = GUIDES
      .map((item) => ({ item, score: scoreGuide(item, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    res.json({
      success: true,
      query,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHelplines = (req, res) => {
  try {
    res.json({ success: true, count: HELPLINES.length, data: HELPLINES });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEmergencyAlert = (req, res) => {
  try {
    const { guideId, helpline, location, timestamp } = req.body;
    const alertEntry = {
      id: "alert-" + Date.now(),
      guideId: guideId || null,
      helpline: helpline || "112",
      location: location || "Unknown / Client Location",
      timestamp: timestamp || new Date().toISOString(),
      status: "DISPATCHED"
    };

    emergencyAlertLogs.push(alertEntry);
    res.status(201).json({
      success: true,
      message: "Emergency response logged and simulated dispatch created",
      data: alertEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
