// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import{getFirestore,setDoc,doc} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
function showMessage(message,divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
      messageDiv.style.opacity=0;
    },5000);
}
const signup=document.getElementById("signupbtn");
signup.addEventListener("click",(event)=>{
event.preventDefault();
const email=document.getElementById("email").value;
const password=document.getElementById("pwd").value;
const firstName=document.getElementById("f_name").value;
const lastName=document.getElementById("l_name").value;

if (!email || !password || !firstName || !lastName) {
  showMessage("All fields must be filled out!", 'signupmsg');
  return;
}

if (!/^[A-Z]/.test(firstName) || !/^[A-Z]/.test(lastName)) {
  showMessage("Names must start with an uppercase letter!", 'signupmsg');
  return;
}

if (!/\S+@\S+\.\S+/.test(email)) {
  showMessage("Please enter a valid email address!", 'signupmsg');
  return;
}

if (!validatePassword(password)) {
  showMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one special character, and one number!", 'signupmsg');
  return;
}
const auth=getAuth();
const db=getFirestore();
createUserWithEmailAndPassword(auth,email,password)
.then((userCredential)=>{
  const user=userCredential.user;
  const userData={
    email:email,
    firstName:firstName,
    lastName:lastName
  };
  showMessage(' Account Created Succefully','signupmsg');
  const docRef=doc(db,"users",user.uid);
  setDoc(docRef,userData)
  .then(()=>{
    window.location.href='index.html';
  })
  .catch((error)=>{
     console.log("error writing document",error);
  });
})
.catch((error)=>{
  const errorCode=error.code;
  if(errorCode=='auth/email-already-in-use'){
    showMessage("Email Address Already Exists  !!!",'signupmsg')
  }
  else if (errorCode === 'auth/weak-password') {
    showMessage("Password is too weak", 'signupmsg');
  }
    else{
    showMessage("Unable to create user",'signupmsg')
  }
})
});

function validatePassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}