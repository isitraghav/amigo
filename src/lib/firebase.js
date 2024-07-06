const firebaseConfig = {
  apiKey: "AIzaSyAfc1D4KJJbA7s0oQm-xbqMaa3wlxhy404",
  authDomain: "amigostudy-app.firebaseapp.com",
  projectId: "amigostudy-app",
  storageBucket: "amigostudy-app.appspot.com",
  messagingSenderId: "724180986077",
  appId: "1:724180986077:web:7e6148dc5a57abca541334",
  measurementId: "G-V4ZCKN6T1Y",
};
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
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

export const loggedin = writable(false);
export let userData = writable({});
FirebaseAuthentication.addListener("authStateChange", (state) => {
  if (state.user) {
    userData.set(state.user);
    loggedin.set(true);
  }
});
