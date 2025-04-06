import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCo5NR_s6Pbd_ZypP_5tgp2joEHmA7RcT8",
    authDomain: "login-form-9e415.firebaseapp.com",
    projectId: "login-form-9e415",
    storageBucket: "login-form-9e415.appspot.com",
    messagingSenderId: "900436401273",
    appId: "1:900436401273:web:d09d181852913621e048a8"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function pushdashbordjsondata() {
    try {
        const response = await fetch('Json/dashboard.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const groceryData = await response.json();
        const categories = Object.keys(groceryData);


for (let i = 0; i < categories.length; i++) {
    const category = categories[i];


    const categoryRef = doc(db, "groceryData", category); 

    
    await setDoc(categoryRef, { items: groceryData[category] });

    console.log(`Data for ${category} pushed successfully!`);
}

      
    } catch (error) {
        console.error("Error pushing data: ", error);
    }
}


pushdashbordjsondata()