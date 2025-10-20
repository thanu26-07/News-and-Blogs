// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "newsblogsapp.firebaseapp.com",
  projectId: "newsblogsapp",
  storageBucket: "newsblogsapp.appspot.com",
  messagingSenderId: "1011761854333",
  appId: "1:1011761854333:web:9069bc30c8d7c739d13e14"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
