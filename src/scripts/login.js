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
    if(userCredential.user.role === "admin"){
      console.log("Redirecting to admin dashboard");
      window.location.href = '/admin/dashboard';
    }else{
      window.location.href = '/';
    }
    return userCredential.user;
  } catch (error) {
    localStorage.setItem("toastMessage", error.message);
    localStorage.setItem("toastType", "error");
    window.location.reload();
    console.log("Login error:", error);
    throw error;
  }
}