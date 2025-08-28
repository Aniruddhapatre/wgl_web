// src/firebase2.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const blogsFirebaseConfig = {
  apiKey: "AIzaSyCKcTl5Ce5jqguP0Q2XscdK714JyZ0P6I0",
  authDomain: "wglarticle.firebaseapp.com",
  databaseURL: "https://wglarticle-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wglarticle",
  storageBucket: "wglarticle.firebasestorage.app",
  messagingSenderId: "65759222712",
  appId: "1:65759222712:web:451c2b981ba3481e554d4d",
  measurementId: "G-HBHMNWTM5Q",
  databaseURL: "https://wglarticle-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const article = getApps().find(app => app.name === "article") 
  || initializeApp(blogsFirebaseConfig, "article");

export const blogsDatabase = getDatabase(article);