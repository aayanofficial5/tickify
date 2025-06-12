// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDHS75TKI-ujVVgZcKrqF1_p6e27GT35w0",
  authDomain: "ticket-booking-app-celebal.firebaseapp.com",
  projectId: "ticket-booking-app-celebal",
  storageBucket: "ticket-booking-app-celebal.firebasestorage.app",
  messagingSenderId: "555661733008",
  appId: "1:555661733008:web:5f9064614134b08200fc15",
  measurementId: "G-C5KLML7PDM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };
