import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function loginViaEmailAndPassword(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(user.uid);
  }