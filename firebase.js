// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJyyJF950dCGJDjKI4xuqowxWc7RdjOtg",
  authDomain: "sheconnect-empowering-women.firebaseapp.com",
  projectId: "sheconnect-empowering-women",
  storageBucket: "sheconnect-empowering-women.firebasestorage.app",
  messagingSenderId: "336776014409",
  appId: "1:336776014409:web:7afdcd22801e38caa76d98",
  measurementId: "G-HF43PPXHY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);