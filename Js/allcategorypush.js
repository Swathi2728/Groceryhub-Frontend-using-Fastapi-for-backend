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

const uploadDataFromJSON = async (filePath, collectionName) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const collectionRef = collection(db, collectionName);

        const dataArray = Array.isArray(data) ? data : Object.values(data);

        for (const item of dataArray) {
            const docRef = doc(collectionRef, item.name || item.id);
            await setDoc(docRef, item);
            console.log(`Successfully added ${item.name || item.id} to Firestore`);
        }

    } catch (error) {
        console.error(`Error uploading data from ${filePath}:`, error);
    }
};


const uploadCategories = async () => {
    await uploadDataFromJSON('../Json/fruits.json', 'fruits');
    await uploadDataFromJSON('../Json/snaks.json', 'snacks');       
    await uploadDataFromJSON('../Json/vegetable.json', 'vegetables');
    await uploadDataFromJSON('../Json/dairy.json', 'dairyProducts');
};


uploadCategories();
