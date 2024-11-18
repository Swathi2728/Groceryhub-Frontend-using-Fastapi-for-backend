import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


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

// Check authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User logged in:", user);
    try {
      await loadUserProfile(user.uid);  // Load user profile using their UID
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  } else {
    console.log("No user logged in");
    window.location.href = '/Groceryhub/html/login.html'; // Redirect to login page if no user is logged in
  }
});

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
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Display the profile data on the page
const displayProfile = (userData) => {
  document.getElementById('first-name').textContent = userData.firstname;
  document.getElementById('last-name').textContent = userData.lastname;
  document.getElementById('email').textContent = userData.email;
};

// Logout function
document.getElementById('logout-btn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
      window.location.href = '/login.html';
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
});