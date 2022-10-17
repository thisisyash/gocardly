import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "postermaker-53a0a.firebaseapp.com",
  projectId: "postermaker-53a0a",
  storageBucket: "postermaker-53a0a.appspot.com",
  messagingSenderId: "812160275286",
  appId: "1:812160275286:web:fcbcf9d2ac461832933cf7",
  measurementId: "G-5FPWLBB4HS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
const analytics = getAnalytics(app);
export const auth = getAuth();