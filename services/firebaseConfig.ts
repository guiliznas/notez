// Fix: Corrected the modular import for initializeApp from 'firebase/app' to ensure proper type resolution and availability
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log("Firebase");

// NOTE: In a real production environment, these should be environment variables.
// For this demo, you must replace these placeholders with your actual Firebase project config.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: import.meta.env.VITE_G4_MEASUREMENT_ID || "YOUR_MEASURMENT_ID",
};

console.log("[FIREBASE] Inicializando Firebase com config:", {
  apiKey: firebaseConfig.apiKey ? "***" : "MISSING",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("[FIREBASE] Firebase inicializado com sucesso");
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export { auth, db };
