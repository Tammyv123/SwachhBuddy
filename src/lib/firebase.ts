import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";

// Firebase configuration with fallback values
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD2dMjIaCiZ_LmpLoMvVqHlSKPO31RquRE",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "swatchbharat-bcc5e.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "swatchbharat-bcc5e",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "swatchbharat-bcc5e.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "457734722716",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:457734722716:web:e2f4d770b47c0187c3c959",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-E7CMR0QNES",
};

// Debug: Log configuration (remove in production)
console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : 'MISSING'
});

const app = initializeApp(firebaseConfig);

// Initialize services
let analytics;
try {
    analytics = getAnalytics(app);
} catch (error) {
    console.warn('Analytics not available:', error);
}

const auth = getAuth(app);
const db = getFirestore(app);

// Enable network to ensure Firestore is online
enableNetwork(db).catch((error) => {
    console.warn('Failed to enable Firestore network:', error);
});

export { app, analytics, auth, db };
