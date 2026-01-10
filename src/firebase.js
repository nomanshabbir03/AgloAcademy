import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

/* =======================
   Firebase Configuration
======================= */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/* =======================
   Initialize Firebase (Safe)
======================= */
// Prevents multiple initialization (important for Vite + HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/* =======================
   Firebase Services
======================= */
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics should only run in browser
const analytics =
  typeof window !== 'undefined' ? getAnalytics(app) : null;

/* =======================
   Email Domain Validation
======================= */
const ALLOWED_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com'];

export const isEmailDomainAllowed = (email) => {
  const domain = email?.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
};

/* =======================
   Exports
======================= */
export { app, auth, db, analytics };
