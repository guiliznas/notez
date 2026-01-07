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

// Adicionar permissão para acessar o Google Calendar
googleProvider.addScope("https://www.googleapis.com/auth/calendar.readonly");

// Chave para armazenar o token no localStorage
const GOOGLE_ACCESS_TOKEN_KEY = "google_access_token";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Obter o access token do OAuth
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential && credential.accessToken) {
      // Salvar no localStorage
      localStorage.setItem(GOOGLE_ACCESS_TOKEN_KEY, credential.accessToken);
      console.log("[FIREBASE] Access token obtido e salvo no localStorage");
    } else {
      console.warn("[FIREBASE] Access token não encontrado no resultado");
    }

    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const getGoogleAccessToken = (): string | null => {
  const token = localStorage.getItem(GOOGLE_ACCESS_TOKEN_KEY);
  console.log(
    "[FIREBASE] Recuperando access token do localStorage:",
    token ? "Encontrado" : "Não encontrado"
  );
  return token;
};

export const logout = async () => {
  try {
    // Limpar o access token do localStorage
    localStorage.removeItem(GOOGLE_ACCESS_TOKEN_KEY);
    console.log("[FIREBASE] Access token removido do localStorage");
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export { auth, db };
