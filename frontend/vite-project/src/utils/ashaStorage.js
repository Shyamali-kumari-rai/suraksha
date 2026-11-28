export const ASHA_STORAGE_KEY = "suraksha_asha_doctor_v1";

/**
 * Strip spaces, dashes, parentheses, and dots from a phone input,
 * normalizing common Indian prefixes (+91, 91, 0).
 */
export function sanitizeIndianPhone(raw) {
  if (!raw || typeof raw !== "string") return "";
  let cleaned = raw.trim().replace(/[\s\-().]/g, "");
  // Keep only digits and a leading '+'
  cleaned = cleaned.replace(/(?!^\+)[^\d]/g, "");

  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return cleaned.slice(1);
  }
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return cleaned;
}

/**
 * Validate 10-digit Indian mobile numbers or +91XXXXXXXXXX format.
 */
export function isValidIndianPhone(raw) {
  const sanitized = sanitizeIndianPhone(raw);
  return /^(?:\+91)?[6-9]\d{9}$/.test(sanitized);
}

/**
 * Format sanitized phone number for readable display.
 */
export function formatDisplayPhone(phone) {
  if (!phone) return "";
  if (/^\+91\d{10}$/.test(phone)) {
    return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`;
  }
  if (/^\d{10}$/.test(phone)) {
    return `${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
}

/**
 * Load saved ASHA / Doctor contacts safely from localStorage.
 */
export function loadAshaContacts() {
  try {
    const raw = localStorage.getItem(ASHA_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const valid = [];
    const seenRoles = new Set();
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const role = item.role === "doctor" ? "doctor" : item.role === "asha" ? "asha" : null;
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const phone = sanitizeIndianPhone(typeof item.phone === "string" ? item.phone : "");
      if (!role || !name || !isValidIndianPhone(phone) || seenRoles.has(role)) continue;

      seenRoles.add(role);
      valid.push({
        id: typeof item.id === "string" && item.id ? item.id : `asha_${role}_${Date.now()}`,
        name,
        role,
        phone,
        location: typeof item.location === "string" ? item.location.trim() : "",
        isPrimary: Boolean(item.isPrimary)
      });
      if (valid.length >= 2) break;
    }

    if (valid.length > 0 && !valid.some((c) => c.isPrimary)) {
      valid[0].isPrimary = true;
    }
    return valid;
  } catch {
    return [];
  }
}

/**
 * Persist ASHA / Doctor contacts safely to localStorage.
 */
export function saveAshaContacts(contacts) {
  try {
    localStorage.setItem(ASHA_STORAGE_KEY, JSON.stringify(contacts));
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a unique contact ID.
 */
export function createAshaContactId(role) {
  return `asha_${role}_${Date.now()}`;
}

/**
 * Return the primary contact (or first saved contact) for 1-tap quick-call.
 */
export function getPrimaryAshaContact(contacts) {
  if (!Array.isArray(contacts) || contacts.length === 0) return null;
  return contacts.find((c) => c.isPrimary) || contacts[0];
}
