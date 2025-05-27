// src/lib/firebase.js

// Import core Firebase and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore
import { getAnalytics } from "firebase/analytics"; // Optional: keep if you want analytics

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBkY2RXEPiaayoW3emEhnLiUUP3dSp3Xsw",
  authDomain: "sari-sari-pos-966a5.firebaseapp.com",
  projectId: "sari-sari-pos-966a5",
  storageBucket: "sari-sari-pos-966a5.firebasestorage.app",
  messagingSenderId: "713360116202",
  appId: "1:713360116202:web:218b142085dc835ec28a93",
  measurementId: "G-GJ8M3FM6VQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ This lets you use Firestore
const analytics = getAnalytics(app); // Optional

// Export Firestore so you can use it in other files
export { db };
