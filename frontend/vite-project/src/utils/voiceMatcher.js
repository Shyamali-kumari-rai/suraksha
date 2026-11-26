/* =========================================================
   Suraksha — Bilingual Voice & Intent Matcher
   Supports Hindi (hi-IN), Indian English (en-IN), and Hinglish
   ========================================================= */

const STOP_WORDS = new Set([
  "hai", "hain", "ho", "raha", "rahi", "rahe", "gaya", "gayi", "gaye",
  "me", "mein", "ko", "ka", "ki", "ke", "se", "par", "pe", "mere", "mera",
  "meri", "mujhe", "bahut", "thoda", "de", "kar", "karo", "kya", "hua",
  "i", "am", "is", "are", "have", "has", "my", "the", "a", "an", "in", "on", "to", "for", "of",
  "है", "हैं", "हो", "रहा", "रही", "रहे", "गया", "गई", "में", "को", "का", "की", "के", "से", "मेरे", "मेरा", "मेरी", "मुझे", "बहुत", "दे"
]);

export function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[.,!?।;:"'()\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasDevanagari(text) {
  return /[\u0900-\u097F]/.test(text || "");
}

export function scoreGuide(item, rawQuery) {
  const q = normalizeText(rawQuery);
  if (!q) return 1;

  const en = normalizeText(item.en);
  const hi = normalizeText(item.hi);
  let score = 0;

  if (en === q || hi === q) score += 140;
  else if (en.startsWith(q) || hi.startsWith(q)) score += 90;
  else if (en.includes(q) || hi.includes(q) || q.includes(en) || q.includes(hi)) score += 70;

  // Exact or substring phrase match (spoken sentences)
  if (item.phrases) {
    for (let i = 0; i < item.phrases.length; i++) {
      const ph = normalizeText(item.phrases[i]);
      if (q === ph) score += 130;
      else if (q.includes(ph) || ph.includes(q)) score += 85;
    }
  }

  // Token-level intent matching
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

export function findBestMatches(query, guides) {
  const q = normalizeText(query);
  if (!q) return guides.slice();

  return guides
    .map(function (item) {
      return { item: item, score: scoreGuide(item, q) };
    })
    .filter(function (entry) {
      return entry.score > 0;
    })
    .sort(function (a, b) {
      return b.score - a.score;
    })
    .map(function (entry) {
      return entry.item;
    });
}
