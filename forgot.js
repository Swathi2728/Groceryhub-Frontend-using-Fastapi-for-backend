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

function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        messageDiv.style.display = "none";
    }, 5000);
}

function forgot() {
    const email3 = document.getElementById("email3").value;
    if (email3) {
        sendPasswordResetEmail(auth, email3) 
            .then(() => {
                window.alert("Password reset email has been sent.");
            })
            .catch((error) => {
                const errorMessage = error.message;
                showMessage('Error: ' + errorMessage, 'loginmsg');
            });
    } else {
        showMessage('Please enter your email address.', 'loginmsg');
    }
}


document.getElementById("resetBtn").addEventListener("click", forgot);