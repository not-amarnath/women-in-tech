
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDJyyJF950dCGJDjKI4xuqowxWc7RdjOtg",
    authDomain: "sheconnect-empowering-women.firebaseapp.com",
    projectId: "sheconnect-empowering-women",
    storageBucket: "sheconnect-empowering-women.firebasestorage.app",
    messagingSenderId: "336776014409",
    appId: "1:336776014409:web:7afdcd22801e38caa76d98",
    measurementId: "G-HF43PPXHY0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const updateUserInfo = async (user) => {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const name = userData.fullName || "User"; 
            const role = (userData.role || "User").charAt(0).toUpperCase() + (userData.role || "User").slice(1);

           
            document.getElementById("sidebar-user-name").textContent = name;
            document.getElementById("sidebar-user-role").textContent = role;
            document.getElementById("user-name").textContent = name;
            document.getElementById("profile-name").textContent = name;
            document.getElementById("profile-email").textContent = user.email;
            document.getElementById("profile-role").textContent = role;
            document.getElementById("profile-date").textContent = new Date(user.metadata.creationTime).toLocaleDateString();
        } else {
            console.log("No user data found in Firestore.");
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
};


onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserInfo(user);
    } else {
        window.location.href = "mentor_login.html";
    }
});


document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
        animateLogout();
        setTimeout(() => signOut(auth), 1000); 
    }
});

document.getElementById("header-logout-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
        animateLogout();
        setTimeout(() => signOut(auth), 1000); 
    }
});


const animateLogout = () => {
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = "0";
};


const loadProfileForm = async () => {
    const profileSection = document.querySelector('#profile');
    profileSection.innerHTML = '<p>Loading...</p>'; 

    try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const role = userData.role;

            
            if (role === 'mentor') {
                profileSection.innerHTML = `
                    <iframe src="mentor.html" style="width: 100%; height: 100%; border: none;"></iframe>
                `;
            } else if (role === 'mentee') {
                profileSection.innerHTML = `
                    <iframe src="mentee.html" style="width: 100%; height: 100%; border: none;"></iframe>
                `;
            } else {
                profileSection.innerHTML = '<p>Unknown role. Please contact support.</p>';
            }
        } else {
            profileSection.innerHTML = '<p>No user data found. Please contact support.</p>';
        }
    } catch (error) {
        console.error("Error loading profile form:", error);
        profileSection.innerHTML = '<p>Error loading profile form. Please try again later.</p>';
    }
};

document.querySelector('a[href="#profile"]').addEventListener('click', (e) => {
    e.preventDefault(); 
    loadProfileForm();  
});
