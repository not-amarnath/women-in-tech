// Import Firebase modules
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

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

// DOM elements
const mentorToggle = document.getElementById('mentor-toggle');
const menteeToggle = document.getElementById('mentee-toggle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
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
  btn.addEventListener('click', function() {
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

// Form submission
submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  // Add loading animation
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
  submitBtn.disabled = true;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Validate form
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    resetButton();
    return;
  }
  
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Store user role in localStorage
    localStorage.setItem('userRole', userRole);
    
    // Show success message
    showNotification('Login successful!', 'success');
    
    // Redirect based on user role
    setTimeout(() => {
      window.location.href = userRole === 'mentor' ? 'dashboard.html' : 'mentee_dashboard.html';
    }, 1500);
    
  } catch (error) {
    // Handle login errors
    console.error(error);
    let errorMessage = 'Login failed. Please check your credentials.';
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later.';
    }
    
    showNotification(errorMessage, 'error');
    resetButton();
  }
});

// Reset button state
function resetButton() {
  submitBtn.innerHTML = 'Sign In <i class="fas fa-arrow-right"></i>';
  submitBtn.disabled = false;
}

// Show notification message
function showNotification(message, type) {
  // Check if notification element exists
  let notification = document.querySelector('.notification');
  
  // If not, create a new one
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    
    // Add styles
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
  
  // Set type-specific styles
  if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
    notification.style.color = 'white';
  } else if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
  }
  
  // Set message
  notification.textContent = message;
  
  // Show notification
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    // Remove from DOM after fade out
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}