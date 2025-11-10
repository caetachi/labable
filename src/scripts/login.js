import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuth, db } from "../firebase.js";
import { ref, get } from "firebase/database";

export async function loginViaEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("toastMessage", "Successfully logged in.");
    localStorage.setItem("toastType", "success");
    console.log("Logged in user:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    localStorage.setItem("toastMessage", error.message);
    localStorage.setItem("toastType", "error");
    console.log("Login error:", error);
    throw error;
  }
}

export async function loginViaGoogle() {
  try {
    const result = await signInWithPopup(auth, googleAuth);
    const user = result.user;
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      localStorage.setItem("toastMessage", "Successfully logged in with Google!");
      localStorage.setItem("toastType", "success");
      console.log("Logged in user:", user);
      return user;
    } else {
      localStorage.setItem("toastMessage", "No account found for this Google user.");
      localStorage.setItem("toastType", "error");
      console.warn("User does not exist in database:", user.uid);
      return null;
    }

  } catch (err) {
    localStorage.setItem("toastMessage", err.message);
    localStorage.setItem("toastType", "error");
    console.error("Google login error:", err);
    return null;
  }
}

