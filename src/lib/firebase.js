const firebaseConfig = {
  apiKey: "AIzaSyAfc1D4KJJbA7s0oQm-xbqMaa3wlxhy404",
  authDomain: "amigostudy-app.firebaseapp.com",
  projectId: "amigostudy-app",
  storageBucket: "amigostudy-app.appspot.com",
  messagingSenderId: "724180986077",
  appId: "1:724180986077:web:7e6148dc5a57abca541334",
  measurementId: "G-V4ZCKN6T1Y",
};
// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { writable } from "svelte/store";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure the Google Sign-In provider
const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Signed in with Google:", user.email);
    // Redirect to the user's dashboard or other protected area
  } catch (error) {
    console.error("Error signing in with Google:", error);
    // Handle errors (e.g., user canceled the sign-in flow)
  }
};

export const loggedin = writable(false);
onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedin.set(true);
  } else {
    loggedin.set(false);
  }
});
