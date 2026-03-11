/**
 * firebase.js
 * -----------
 * Firebase configuration and initialization for SemantiCast.
 * Sets up Firebase App, Authentication (Google Sign-In), and Analytics.
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration for the mlclim project
const firebaseConfig = {
  apiKey: "AIzaSyBw1Zo6kdCZtLr76XobHx5z8UXRW45imBw",
  authDomain: "mlclim.firebaseapp.com",
  projectId: "mlclim",
  storageBucket: "mlclim.firebasestorage.app",
  messagingSenderId: "586097213139",
  appId: "1:586097213139:web:279bf080038a720e161e26",
  measurementId: "G-JY492HSD7J",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (optional, only works in browser)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, googleProvider, analytics };
export default app;
