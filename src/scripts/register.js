import { get, ref } from 'firebase/database';
import { auth, db, googleAuth } from '../firebase'
import {createWithGoogle, createViaEmailAndPassword} from './create'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';


export async function registerViaGoogle(){
    let res;
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
    }else{
      localStorage.setItem("toastMessage", "Account already exists!");
      localStorage.setItem("toastType", "info");
      if(snapshot.val().role === "admin"){
        console.log("Redirecting to admin dashboard");
        window.location.href = '/admin/dashboard';
      }else{
        window.location.href = '/';
      }
      return;
    }
    
  }

  export async function registerViaEmailPass(email, firstName, lastName, phoneNumber, password){
    // const res;
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
      localStorage.setItem("toastMessage", err.message);
      localStorage.setItem("toastType", "error");
      window.location.reload();
      return;
    }
  }
