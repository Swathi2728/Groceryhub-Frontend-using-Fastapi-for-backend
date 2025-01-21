
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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
const auth = getAuth(app); // Firebase Auth instance
const db =  getFirestore(app); // Firestore instance

// Event listener for the signup button
const signup = document.getElementById("signupbtn");
signup.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("pwd1").value;
  const firstName = document.getElementById("f_name").value;
  const lastName = document.getElementById("l_name").value;
  console.log('Email:', email, 'Password:', password, 'First Name:', firstName, 'Last Name:', lastName);


  // Validation for empty fields
  if (!email || !password || !firstName || !lastName) {
    alert("All fields must be filled out!");
    return;
  }

  // Check that first name and last name start with an uppercase letter,
  // are between 3 and 30 characters long, contain only alphabetic characters (no spaces),
  // and do not contain any spaces
  const nameRegex = /^[A-Za-z]+$/; // Only alphabetic characters
  const spaceCheck = /\s/;  // To check for spaces

  // First name validation
  // if (spaceCheck.test(firstName)) {
  //   alert("First name must not contain spaces!");
  //   return;
  // }7

  // if (!/^[A-Z]/.test(firstName)) {
  //   alert("First name must start with an uppercase letter!");
  //   return;
  // }

  if (firstName.length < 3 || firstName.length > 15) {
    alert("First name must be between 3 and 15 characters long!");
    return;
  }

  if (!nameRegex.test(firstName)) {
    alert("First name must contain only letters!");
    return;
  }

  // Last name validation
  if (spaceCheck.test(lastName)) {
    alert("Last name must not contain spaces!");
    return;
  }

  // if (!/^[A-Z]/.test(lastName)) {
  //   alert("Last name must start with an uppercase letter!");
  //   return;
  // }

  if (lastName.length < 1|| lastName.length > 30) {
    alert("Last name must be between 1 and 30 characters long!");
    return;
  }

  if (!nameRegex.test(lastName)) {
    alert("Last name must contain only letters!");
    return;
  }

  // Validate the email format
  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Please enter a valid email address!");
   }

  // Validate the password with the custom regex
  if (!validatePassword(password)) {
    alert("Password must be at least 8 characters long, contain at least one uppercase letter, one special character, and one number!");
    return;
  }

  // Create a user with email and password
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };

      alert('Account Created Successfully');
      
      // Store user data in Firestore
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = '/index.html'; // Redirect to home page
        })
        .catch((error) => {
          console.log("Error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        alert("Email Address Already Exists!");
      } else if (errorCode === 'auth/weak-password') {
        alert("Password is too weak");
      } else {
        alert("Unable to create user");
      }
    });
});

// Password validation function
function validatePassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

