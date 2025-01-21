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

// Initialize Firestore
const db = getFirestore(app);

const loadData = async () => {
    try {
      // Adjust the path to 'dairy.json' depending on where it's located
      const response = await fetch('/Groceryhub/Json/dairy.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dairyProducts = await response.json();
  
      // Firestore reference to the 'dairyProducts' collection
      const collectionRef = collection(db, "dairyProducts");

      // Loop through the JSON array and add each product to Firestore
      for (let i = 0; i < dairyProducts.length; i++) {
        const product = dairyProducts[i];
  
        // Clean the image URL (remove query parameters)
        let cleanImageUrl = product.img.split('?')[0];
  
        // Generate custom document ID (e.g., using product name or a unique identifier)
        const docRef = doc(collectionRef, product.name); // Using `product.name` as the document ID
  
        // Add the product to Firestore using a specific document ID
        await setDoc(docRef, {
          name: product.name,
          img: cleanImageUrl, // Store cleaned image URL
          price: product.price,
          kilogram: product.kilogram
        });
      }
  
      console.log("Data successfully added to Firestore!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
};

// Call the function to load data
loadData();
