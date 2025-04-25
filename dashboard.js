// dashboard.js
// Handles dashboard functionality for both mentors and mentees

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import firebaseConfig from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const logoutBtn = document.getElementById('logout-btn');
const headerLogoutBtn = document.getElementById('header-logout-btn');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const sections = document.querySelectorAll('.dashboard-section');

// User info elements
const userNameElements = document.querySelectorAll('#user-name, #sidebar-user-name');
const userRoleElement = document.getElementById('sidebar-user-role');
const profileNameElement = document.getElementById('profile-name');
const profileEmailElement = document.getElementById('profile-email');
const profileRoleElement = document.getElementById('profile-role');
const profileDateElement = document.getElementById('profile-date');

// Get user role from localStorage
const userRole = localStorage.getItem('userRole') || 'mentee';

// Check if user is on the correct dashboard
function checkDashboardAccess() {
  const currentPage = window.location.pathname;
  const isMentorPage = currentPage.includes('mentor_dashboard');
  const isMenteePage = currentPage.includes('mentee_dashboard');
  
  if ((userRole === 'mentor' && isMenteePage) || (userRole === 'mentee' && isMentorPage)) {
    // User is on wrong dashboard, redirect to correct one
    window.location.href = userRole === 'mentor' ? 'mentor_dashboard.html' : 'mentee_dashboard.html';
  }
}

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    checkDashboardAccess();
    
    try {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Update UI with user data
        userNameElements.forEach(element => {
          if (element) element.textContent = userData.fullName || user.displayName || "User";
        });
        
        if (userRoleElement) userRoleElement.textContent = userData.role || "Member";
        if (profileNameElement) profileNameElement.textContent = userData.fullName || user.displayName || "User";
        if (profileEmailElement) profileEmailElement.textContent = user.email || "No email provided";
        if (profileRoleElement) profileRoleElement.textContent = userData.role || "Member";
        
        // Format the registration date
        const registrationDate = userData.registrationDate ? 
          new Date(userData.registrationDate.seconds * 1000).toLocaleDateString() : 
          new Date().toLocaleDateString();
        
        if (profileDateElement) profileDateElement.textContent = registrationDate;
        
        // Load role-specific data
        if (userData.role === 'mentor') {
          // Load mentor-specific data
          loadMentorDashboard(user.uid, userData);
        } else {
          // Load mentee-specific data
          loadMenteeDashboard(user.uid, userData);
        }
      } else {
        console.log("No user document found!");
        // Set default values if no document exists
        setDefaultUserData(user);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      setDefaultUserData(user);
    }
  } else {
    // User is not signed in, redirect to login page
    window.location.href = 'login.html';
  }
});

// Load mentor-specific dashboard data
async function loadMentorDashboard(userId, userData) {
  // Example: load mentees, sessions, etc.
  console.log("Loading mentor dashboard for:", userId);
  
  // Check if profile is complete
  if (!userData.profileComplete) {
    showNotification("Please complete your profile to unlock all features", "info");
  }
  
  // Additional mentor-specific functionality can be added here
}

// Load mentee-specific dashboard data
async function loadMenteeDashboard(userId, userData) {
  // Example: load mentor matches, sessions, etc.
  console.log("Loading mentee dashboard for:", userId);
  
  // Check if profile is complete
  if (!userData.profileComplete) {
    showNotification("Please complete your profile to find the right mentor", "info");
  }
  
  // Additional mentee-specific functionality can be added here
}

// Set default user data if Firestore fetch fails
function setDefaultUserData(user) {
  userNameElements.forEach(element => {
    if (element) element.textContent = user.displayName || "User";
  });
  
  if (userRoleElement) userRoleElement.textContent = userRole;
  if (profileNameElement) profileNameElement.textContent = user.displayName || "User";
  if (profileEmailElement) profileEmailElement.textContent = user.email || "No email provided";
  if (profileRoleElement) profileRoleElement.textContent = userRole;
  if (profileDateElement) profileDateElement.textContent = new Date().toLocaleDateString();
}

// Toggle sidebar on mobile
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('expanded');
  });
}

// Handle section navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active class from all links and add to clicked link
    navLinks.forEach(l => l.parentElement.classList.remove('active'));
    link.parentElement.classList.add('active');
    
    // Hide all sections and show the target section
    const targetId = link.getAttribute('href').substring(1);
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // On mobile, hide sidebar after navigation
    if (window.innerWidth <= 1024) {
      sidebar.classList.remove('active');
      mainContent.classList.add('expanded');
    }
  });
});

// Handle logout
function handleLogout() {
  signOut(auth).then(() => {
    // Clear localStorage
    localStorage.removeItem('userRole');
    
    // Sign-out successful, redirect to login page
    window.location.href = 'login.html';
  }).catch((error) => {
    // An error happened
    console.error("Logout error:", error);
    showNotification("Error signing out. Please try again.", "error");
  });
}

// Add event listeners for logout buttons
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', handleLogout);

// Show notification message
function showNotification(message, type = "info") {
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
  } else if (type === 'info') {
    notification.style.backgroundColor = '#2196F3';
    notification.style.color = 'white';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#ff9800';
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

// Responsive design adjustments
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    sidebar.classList.remove('active');
    mainContent.classList.remove('expanded');
  } else {
    mainContent.classList.add('expanded');
  }
});

// Initialize responsive state
if (window.innerWidth <= 1024) {
  mainContent.classList.add('expanded');
}