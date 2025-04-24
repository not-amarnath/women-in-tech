import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Firebase config (same one you already have)
const firebaseConfig = {
  apiKey: "AIzaSyDJyyJF950dCGJDjKI4xuqowxWc7RdjOtg",
  authDomain: "sheconnect-empowering-women.firebaseapp.com",
  projectId: "sheconnect-empowering-women",
  storageBucket: "sheconnect-empowering-women.firebasestorage.app",
  messagingSenderId: "336776014409",
  appId: "1:336776014409:web:7afdcd22801e38caa76d98",
  measurementId: "G-HF43PPXHY0"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle Sign-Up
document.querySelector(".submit-btn").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully!");
    window.location.href = "mentor_login.html";
  } catch (error) {
    alert(error.message);
  }
});
