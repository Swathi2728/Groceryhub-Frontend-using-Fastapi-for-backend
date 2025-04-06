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

    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.log('Firebase Error Code:', error.code);  // Log the error code
            console.log('Firebase Error Message:', error.message);  // Log the error message
            console.log(error);  // Log the full error

            if (error.code === 'auth/wrong-password') {
                alert('Incorrect password. Please try again.');
            } else if (error.code === 'auth/invalid-email') {
                alert('The email address is not valid.');
            } else if (error.code === 'auth/too-many-requests') {
                alert('Too many login attempts. Please try again later.');
            } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
                alert('No account found with this email address. Please check your email or Password.');
            } else {
                alert('Login Failed: ' + error.message);
            }
        });
});
