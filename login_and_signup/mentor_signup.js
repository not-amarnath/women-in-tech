// Import Firebase modules
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const mentorToggle = document.getElementById('mentor-toggle');
const menteeToggle = document.getElementById('mentee-toggle');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitBtn = document.querySelector('.submit-btn');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

// User role selection (mentor or mentee)
let userRole = 'mentor'; // Default role

mentorToggle.addEventListener('click', () => {
  setActiveRole('mentor');
});

menteeToggle.addEventListener('click', () => {
  setActiveRole('mentee');
});

function setActiveRole(role) {
  userRole = role;

  if (role === 'mentor') {
    mentorToggle.classList.add('active');
    menteeToggle.classList.remove('active');
  } else {
    menteeToggle.classList.add('active');
    mentorToggle.classList.remove('active');
  }
}

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const input = this.previousElementSibling;

    if (input.type === 'password') {
      input.type = 'text';
      this.classList.remove('fa-eye');
      this.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      this.classList.remove('fa-eye-slash');
      this.classList.add('fa-eye');
    }
  });
});

// Form validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// Form submission
submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Add loading animation
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
  submitBtn.disabled = true;

  const fullname = fullnameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Validate form
  if (!fullname || !email || !password || !confirmPassword) {
    showNotification('Please fill in all fields', 'error');
    resetButton();
    return;
  }

  if (!validateEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    resetButton();
    return;
  }

  if (!validatePassword(password)) {
    showNotification('Password must be at least 6 characters long', 'error');
    resetButton();
    return;
  }

  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    resetButton();
    return;
  }

  try {
    // Create user account with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullname,
      email: email,
      role: userRole,
      createdAt: new Date().toISOString(),
      profileComplete: false
    });

    // Store user role in localStorage
    localStorage.setItem('userRole', userRole);

    // Show success message
    showNotification('Account created successfully!', 'success');

    // Redirect to onboarding page after delay
    setTimeout(() => {
      window.location.href = userRole === 'mentor' ? 'dashboard.html' : 'mentor_onboarding.html';
    }, 1500);

  } catch (error) {
    console.error(error);
    let errorMessage = 'Account creation failed. Please try again.';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please sign in instead.';
    }

    showNotification(errorMessage, 'error');
    resetButton();
  }
});

// Reset button state
function resetButton() {
  submitBtn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
  submitBtn.disabled = false;
}

// Show notification message
function showNotification(message, type) {
  let notification = document.querySelector('.notification');

  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);

    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.fontWeight = '500';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
  }

  if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
    notification.style.color = 'white';
  } else if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
  }

  notification.textContent = message;

  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}
