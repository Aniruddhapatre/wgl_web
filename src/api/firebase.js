// src/api/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWMIsyHe5rRLJO_zoLjAeY8wjmeGDeEy4",
  authDomain: "login-944bb.firebaseapp.com",
  projectId: "login-944bb",
  storageBucket: "login-944bb.firebasestorage.app",
  messagingSenderId: "690719745309",
  appId: "1:690719745309:web:cb35fab0fa8147885b6df4",
  measurementId: "G-4WVDGYPJ5H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
