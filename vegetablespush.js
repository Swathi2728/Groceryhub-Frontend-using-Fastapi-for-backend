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

// Function to upload vegetable data
const uploadVegetablesFromJSON = async () => {
  try {
    // Fetch the JSON data (Make sure the path is correct)
    const response = await fetch('vegetable.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    const vegetables = await response.json();

    // Reference to the Firestore collection
    const vegetablesCollection = collection(db, 'vegetables'); // Correct usage of collection()

    // Loop through the vegetable data and push each item to Firestore
    for (const vegetable of vegetables) {
      try {
        // Use setDoc with vegetable name or any unique identifier as document ID
        await setDoc(doc(vegetablesCollection, vegetable.name), vegetable);
        console.log(`Successfully added ${vegetable.name} to Firestore`);
      } catch (error) {
        console.error(`Error adding ${vegetable.name}:`, error);
      }
    }

    // alert('All vegetables have been successfully uploaded to Firestore!');
  } catch (error) {
    console.error('Error uploading vegetables:', error);
    alert('Error uploading vegetables!');
  }
};

// Call the function to upload vegetables
uploadVegetablesFromJSON();
