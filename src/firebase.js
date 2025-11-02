import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "",
  authDomain: "labable-55008.firebaseapp.com",
  databaseURL: "https://labable-55008-default-rtdb.firebaseio.com",
  projectId: "labable-55008",
  storageBucket: "labable-55008.firebasestorage.app",
  messagingSenderId: "282718692559",
  appId: "1:282718692559:web:803c185513913d6faa83ba"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
