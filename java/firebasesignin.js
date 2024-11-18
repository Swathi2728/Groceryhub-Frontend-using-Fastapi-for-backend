import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCo5NR_s6Pbd_ZypP_5tgp2joEHmA7RcT8",
    authDomain: "login-form-9e415.firebaseapp.com",
    projectId: "login-form-9e415",
    storageBucket: "login-form-9e415.appspot.com",
    messagingSenderId: "900436401273",
    appId: "1:900436401273:web:d09d181852913621e048a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const signIn = document.getElementById("loginbtn");
signIn.addEventListener("click", (event) => {
    event.preventDefault();
  
    const email = document.getElementById("email1").value.trim();
    const password = document.getElementById("pwd1").value.trim();
  
    // Basic Validation for empty fields
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    if (!password) {
        alert('Please enter your password.');
        return;
    }
  
    // Email Format Validation (Basic Regex)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
  
    // Sign in with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Login is Successful');
            const user = userCredential.user;
            localStorage.setItem("logged In userId", user.uid);
            window.location.href = '/Groceryhub/html/index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
  
            // Handle different Firebase authentication errors
            if (errorCode === 'auth/wrong-password') {
                alert('Invalid password. Please try again.');
            } else if (errorCode === 'auth/user-not-found') {
                alert('No account found with this email address.');
            } else if (errorCode === 'auth/invalid-email') {
                alert('The email address is not valid.');
            } else if (errorCode === 'auth/too-many-requests') {
                alert('Too many login attempts. Please try again later.');
            } else {
                alert('Login Failed: ' + error.message);
            }
        });
  });
  