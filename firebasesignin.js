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

function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        messageDiv.style.display = "none"; // Hide after fading out
    }, 5000);
}

const signIn = document.getElementById("loginbtn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("email1").value.trim();
  const password = document.getElementById("pwd1").value.trim();

  // Basic validation
  if (!email) {
      showMessage('Please enter your email address.', 'loginmsg');
      return;
  }
  if (!password) {
      showMessage('Please enter your password.', 'loginmsg');
      return;
  }

  // Sign in with Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          showMessage('Login is Successful', 'loginmsg');
          const user = userCredential.user;
          localStorage.setItem("logged In userId", user.uid);
          window.location.href = 'index.html';
      })
      .catch((error) => {
          const errorCode = error.code;
          switch (errorCode) {
              case 'auth/wrong-password':
                  showMessage('The password you entered is incorrect.', 'loginmsg');
                  break;
              case 'auth/user-not-found':
                  showMessage('No account found with this email address.', 'loginmsg');
                  break;
              case 'auth/invalid-email':
                  showMessage('The email address is not valid.', 'loginmsg');
                  break;
              case 'auth/too-many-requests':
                  showMessage('Too many login attempts. Please try again later.', 'loginmsg');
                  break;
              default:
                  showMessage('Login Failed: ' + error.message, 'loginmsg');
                  break;
          }
      });
});