import { get, ref } from 'firebase/database';
import { auth, db, googleAuth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';
import { createUser } from './create';

export async function registerViaGoogle(){
    let res;
    const result = await signInWithPopup(auth, googleAuth).catch((err)=>{
      console.log(err.message);
      toast.error("An error has occured!");
    });
    const user = result.user;
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if(!snapshot.exists()){
      const currDate = new Date().toLocaleString();
      await createUser(res.uid, res.email, res.phoneNumber, res.displayName, res.photoURL, currDate);
      toast.success("Account successfully created!");
    }else{
      toast.error("Account already exists!");
    }
  }

  export async function registerViaCredentials(email, firstName, lastName, phoneNumber, password){
    try{
      const user = await createUserWithEmailAndPassword(auth, email, password)
      const res = user.user;
      const currDate = new Date().toLocaleString();
      await createUser(res.uid,  res.email, phoneNumber, (firstName + ' ' + lastName), null, phoneNumber, currDate);
      toast.success("Account successfully created!");
    }catch(err){
      if (err.code == 'auth/email-already-in-use') {
        toast.error('Account with that email already exists');
      }
      return;
    }
  }
