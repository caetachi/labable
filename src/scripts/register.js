import { auth } from './firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export async function registerViaGoogle(){
    let res;
    await signInWithPopup(auth, provider)
    .then((result)=>{
      const user = result.user;
      console.log('user: '+user.email);
      console.log('user: '+user.uid);
      console.log('user: '+user.phoneNumber);
      console.log('user: '+user.displayName); // walang separate
      console.log('user: '+user.photoURL);
      res = user;
    })
    .catch((err)=>{
      alert(err.message);
    })
    const currDate = new Date().toLocaleString();
    await createWithGoogle(res.uid, res.email, res.phoneNumber, res.displayName, res.photoURL, currDate);
  }

  export async function registerViaEmailPass(email, password){
    let res;
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
      const user = userCredential.user;
      res = user;
      console.log(user);
    })
    .catch((err)=>{
      alert(err.message);
    })
    const currDate = new Date().toLocaleString();
    await createViaEmailAndPassword(res.uid, res.email, currDate);
  }