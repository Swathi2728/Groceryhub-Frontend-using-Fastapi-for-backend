import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Your Firebase config
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
const db = getFirestore(app); // Initialize Firestore

// Function to upload snack data
const uploadSnacksFromJSON = async () => {
  try {
    // Fetch the snack JSON data (Make sure the path is correct)
    const response = await fetch('../Json/snaks.json'); // Adjust path to the actual location of snack.json
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    const snacks = await response.json();

    // Reference to the Firestore collection
    const snacksCollection = collection(db, 'snacks'); // Firestore collection "snacks"

    // Loop through the snack data and push each item to Firestore
    for (const snack of snacks) {
      try {
        // Use setDoc with snack name or any unique identifier as document ID
        await setDoc(doc(snacksCollection, snack.name), snack);
        console.log(`Successfully added ${snack.name} to Firestore`);
      } catch (error) {
        console.error(`Error adding ${snack.name}:`, error);
      }
    }

    // alert('All snacks have been successfully uploaded to Firestore!');
  } catch (error) {
    console.error('Error uploading snacks:', error);
    alert('Error uploading snacks!');
  }
};

// Call the function to upload snacks
uploadSnacksFromJSON();