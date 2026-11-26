import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// App Check debug token enabled for local & staging development
if (typeof self !== "undefined") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// [PASTE YOUR firebaseConfig HERE]
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSy_SURAKSHA_DEMO_KEY",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "suraksha-offline-first-aid.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "suraksha-offline-first-aid",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "suraksha-offline-first-aid.appspot.com",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export let appCheck = null;
if (typeof window !== "undefined") {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        import.meta.env?.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      ),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn("App Check initialization (running in debug token mode):", err);
  }
}

export default app;
