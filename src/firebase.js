import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "labable-947e1.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_URL,
  projectId: "labable-947e1",
  storageBucket: "labable-947e1.firebasestorage.app",
  messagingSenderId: "280987492938",
  appId: "1:280987492938:web:5ae8b0405cb24165297cb3"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const db = getDatabase(app);
