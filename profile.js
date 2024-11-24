import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCo5NR_s6Pbd_ZypP_5tgp2joEHmA7RcT8",
    authDomain: "login-form-9e415.firebaseapp.com",
    projectId: "login-form-9e415",
    storageBucket: "login-form-9e415.appspot.com",
    messagingSenderId: "900436401273",
    appId: "1:900436401273:web:d09d181852913621e048a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth
const db = getFirestore(app); // Initialize Firestore

// Load user profile data from Firestore
const loadUserProfile = async (uid) => {
    const userRef = doc(db, 'users', uid); // Reference to the user's document in Firestore

    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            displayProfile(userData);
        } else {
            console.log("No user data found");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
};

// Display the profile data on the page
const displayProfile = (userData) => {
    document.getElementById('first-name').value = userData.firstName || '';
    document.getElementById('last-name').value = userData.lastName || '';
    document.getElementById('email').value = userData.email || '';
};

// Update profile data
const updateUserProfile = async () => {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;

    if (firstName && lastName && email) {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                }, { merge: true }); // Merge updates without overwriting entire document
                console.log('Profile updated successfully');
                alert('Profile updated successfully');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile. Please try again.');
            }
        }
    } else {
        alert('Please fill out all fields');
    }
};

// Check if the user is logged in and load the profile
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid; // Get the user UID
        loadUserProfile(uid);
    } else {
        window.location.href = 'login.html'; // Redirect to login page if user is not logged in
    }
});

// Logout function
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
            window.location.href = 'login.html'; // Redirect to login page after logout
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});

// Add an event listener to handle profile updates
document.getElementById('update-profile-btn').addEventListener('click', updateUserProfile);
