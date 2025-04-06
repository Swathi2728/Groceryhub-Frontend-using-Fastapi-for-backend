import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app);

function forgot() {
    const email3 = document.getElementById("email3").value.trim();  
    if (!email3) {
        alert("Please enter your email address.");
        return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email3)) {
        alert("Please enter a valid email address.");
        return;
    }

    sendPasswordResetEmail(auth, email3)
        .then(() => {
            alert("Password reset email has been sent.");
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert("Error: " + errorMessage);  
        });
}

document.getElementById("resetBtn").addEventListener("click", forgot);
