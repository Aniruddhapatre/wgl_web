// src/firebase2.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const blogsFirebaseConfig = {
  apiKey: "AIzaSyABMWUp0BRK8UiJYEhqBpjqFUSyz1InHl0",
  authDomain: "wglblogs-a7667.firebaseapp.com",
  projectId: "wglblogs-a7667",
  storageBucket: "wglblogs-a7667.firebasestorage.app",
  messagingSenderId: "696180432352",
  appId: "1:696180432352:web:156f3d987c623304bc5f85",
  measurementId: "G-P5F73L9QEF",
  databaseURL: "https://wglblogs-a7667-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const blogsApp = getApps().find(app => app.name === "blogsApp") 
  || initializeApp(blogsFirebaseConfig, "blogsApp");

export const blogsDatabase = getDatabase(blogsApp);