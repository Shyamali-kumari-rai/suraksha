import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// App Check debug token enabled for local & staging development
if (typeof self !== "undefined") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA21xkJMbQEOwhWtDdJejJDagb2q0CQKNo",
  authDomain: "suraksha-first-aid.firebaseapp.com",
  projectId: "suraksha-first-aid",
  storageBucket: "suraksha-first-aid.firebasestorage.app",
  messagingSenderId: "627383890589",
  appId: "1:627383890589:web:6c8140382d1eb41629da74",
  measurementId: "G-GN8KZJSSTT"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely in browser environments
export let analytics = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

// Initialize App Check (debug token active locally)
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
