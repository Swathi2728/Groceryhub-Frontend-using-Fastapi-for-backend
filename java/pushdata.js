import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Your Firebase configuration (Replace with your actual config)
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
const db = getFirestore(app);

// Function to load JSON and push data to Firestore
async function loadJSONAndPushData() {
    try {
        // Fetch the JSON file (ensure the path is correct)
        const response = await fetch('/json/dashboard.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const groceryData = await response.json(); // Parse JSON data

        // Loop over each category in the groceryData
        for (const category in groceryData) {
            // Get a reference to the category document (create a unique document for each category)
            const categoryRef = doc(db, "groceryData", category); 

            // Set the data for that category (overwrite document if it exists)
            await setDoc(categoryRef, { items: groceryData[category] });

            console.log(`Data for ${category} pushed successfully!`);
        }
    } catch (error) {
        console.error("Error pushing data: ", error);
    }
}

// Call the function to push data to Firestore
loadJSONAndPushData();