import { get, ref } from 'firebase/database';
import { auth, db, googleAuth } from '../firebase'
import {createWithGoogle, createViaEmailAndPassword} from './create'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export async function registerViaGoogle(){
    const result = await signInWithPopup(auth, googleAuth).catch((err)=>{
      localStorage.setItem("toastMessage", err.message);
      localStorage.setItem("toastType", "error");
    });
    const user = result.user;
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if(!snapshot.exists()){
      const currDate = new Date().toLocaleString();
      await createWithGoogle(user.uid, user.email, user.phoneNumber, user.displayName, user.photoURL, currDate);
    }    
  }

export async function registerViaEmailPass(email, firstName, lastName, phoneNumber, password){
  try{
    const user = await createUserWithEmailAndPassword(auth, email, password)
    const res = user.user;
    const currDate = new Date().toLocaleString();
    await createViaEmailAndPassword(res.uid, firstName, lastName, phoneNumber, res.email, currDate);
    localStorage.setItem("toastMessage", "Account successfully created!");
    localStorage.setItem("toastType", "success");
    window.location.href = '/';
    return res;
  }catch(err){
    let message = err && err.code ? err.code : "An unexpected error occurred";
    switch(err?.code){
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists. Try logging in instead.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. It must be at least 6 characters.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password sign-ups are disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Check your internet connection and try again.';
        break;
      default:
        message = err?.message || 'Registration failed. Please try again.';
    }
    localStorage.setItem("toastMessage", message);
    localStorage.setItem("toastType", "error");
    window.location.reload();
    return;
  }
}
