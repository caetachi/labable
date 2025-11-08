import { get, ref } from 'firebase/database';
import { auth, db, googleAuth } from '../firebase'
import {createWithGoogle, createViaEmailAndPassword} from './create'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';


export async function registerViaGoogle(){
    let res;
    const result = await signInWithPopup(auth, googleAuth).catch((err)=>{
      alert(err.message);
    });
    const user = result.user;
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if(!snapshot.exists()){
      const currDate = new Date().toLocaleString();
      await createWithGoogle(res.uid, res.email, res.phoneNumber, res.displayName, res.photoURL, currDate);
    }else{
      alert("Account already exists")
    }
    
  }

  export async function registerViaEmailPass(email, password){
    // const res;
    try{
      const user = await createUserWithEmailAndPassword(auth, email, password)
      const res = user.user;
      const currDate = new Date().toLocaleString();
      await createViaEmailAndPassword(res.uid, res.email, currDate);
    }catch(err){
      alert(err.message);
      return;
    }
  }
