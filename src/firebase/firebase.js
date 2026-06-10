import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChiYDtHaCJHk-UZBWrkeSHoZZiEA7R7Q0",
  authDomain: "piano-4db45.firebaseapp.com",
  projectId: "piano-4db45",
  storageBucket: "piano-4db45.firebasestorage.app",
  messagingSenderId: "275964485987",
  appId: "1:275964485987:web:7f7bd77fdf784aca67b356",
  measurementId: "G-6B6YK5QNGB",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;