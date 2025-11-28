import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBeaU8XCeSyBL5gyTpuPyyPHAIM0-km1V0",
  authDomain: "ife-grand-resort.firebaseapp.com",
  projectId: "ife-grand-resort",
  storageBucket: "ife-grand-resort.firebasestorage.app",
  messagingSenderId: "109466591932",
  appId: "1:109466591932:web:cb6d1405bdac9b503a26b9",
  measurementId: "G-19MY63W071"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { app, analytics, auth, db, functions };
