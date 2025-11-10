import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { get, ref } from 'firebase/database';
import { auth, googleAuth, db } from "../firebase.js";
import {createWithGoogle } from './create'

export async function loginViaEmailAndPassword(email, password) {
	let userCredential = null;

	try {
		userCredential = await signInWithEmailAndPassword(auth, email, password);

		localStorage.setItem("toastMessage", "Successfully logged in.");
		localStorage.setItem("toastType", "success");
		console.log("Logged in user:", userCredential.user);
		if (userCredential.user.role === "admin") {
			console.log("Redirecting to admin dashboard");
			window.location.href = "/admin/dashboard";
		} else {
			window.location.href = "/";
		}

		return userCredential.user;
	} catch (error) {
		let message = error && error.code ? error.code : "An unexpected error occurred";
		switch (error?.code) {
			case "auth/invalid-credential":
			case "auth/wrong-password":
				message = "Incorrect email or password.";
				break;
			case "auth/user-not-found":
				message = "No account found with this email.";
				break;
			case "auth/invalid-email":
				message = "Please enter a valid email address.";
				break;
			case "auth/user-disabled":
				message = "This account has been disabled. Please contact support.";
				break;
			case "auth/too-many-requests":
				message = "Too many attempts. Please try again later.";
				break;
			case "auth/network-request-failed":
				message = "Network error. Check your internet connection and try again.";
				break;
			default:
				message = error?.message || "Login failed. Please try again.";
		}
		localStorage.setItem("toastMessage", message);
		localStorage.setItem("toastType", "error");
		console.log("Login error:", error);
		window.location.reload();
	}
	return null;
}

export async function loginViaGoogle() {
	const result = await signInWithPopup(auth, googleAuth).catch((error) => {
		console.log("Login error:", error);
		localStorage.setItem("toastMessage", "An unexpected error occured!");
		localStorage.setItem("toastType", "error");
		window.location.reload();
	});

	const user = result.user;
	const userRef = ref(db, `users/${user.uid}`);
	const snapshot = await get(userRef);

	if(!snapshot.exists()){
		const currDate = new Date().toLocaleString();
		await createWithGoogle(user.uid, user.email, user.phoneNumber, user.displayName, user.photoURL, currDate);
	}else{
		localStorage.setItem("toastMessage", "Successfully logged in!");
		localStorage.setItem("toastType", "success");
		if(snapshot.val().role === "admin"){
			console.log("Redirecting to admin dashboard");
			window.location.href = "/admin/dashboard";
		}else{
			window.location.href = "/";
		}
	}

	return user;
}
