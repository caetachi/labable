// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADjFtpHYaScp27kFO094K31F4iy8m-GOQ",
  authDomain: "labable-55008.firebaseapp.com",
  databaseURL: "https://labable-55008-default-rtdb.firebaseio.com",
  projectId: "labable-55008",
  storageBucket: "labable-55008.firebasestorage.app",
  messagingSenderId: "282718692559",
  appId: "1:282718692559:web:803c185513913d6faa83ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
