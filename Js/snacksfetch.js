import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, collection, getDocs, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


// Firebase configuration
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
const auth = getAuth(app); // Initialize Firebase Authentication

let allSnacks = []; // Store all snacks data

// Fetch the data
async function fetchSnacks() {
    const snacksRef = collection(db, 'snacks');
    const snapshot = await getDocs(snacksRef);

    if (snapshot.empty) {
        console.log('No snacks found in Firestore');
    } else {
        allSnacks = snapshot.docs.map(doc => doc.data()); // Store all snacks
        console.log('Snacks fetched:', allSnacks);
        displaySnacks(allSnacks); // Display all snacks initially
    }
}

function displaySnacks(snacks) {
    const container = document.getElementById('snacks-container');
    container.innerHTML = ''; // Clear the container before displaying new snacks

    snacks.forEach(snack => {
        const snackElement = document.createElement('div');
        snackElement.classList.add('snack-card');

        // Add snack image
        const img = document.createElement('img');
        img.src = snack.img;
        img.alt = snack.name;
        img.style.height = '200px';
        img.style.width = '200px';
        img.style.borderRadius = '5px';
        snackElement.appendChild(img);

        // Add snack name
        const name = document.createElement('h2');
        name.innerText = snack.name;
        snackElement.appendChild(name);

        // Price display (initial price based on the first weight option)
        const priceDisplay = document.createElement('p');
        priceDisplay.classList.add('price');
        
        // Check if 'kilogram' exists and has values
        if (snack.kilogram && Array.isArray(snack.kilogram) && snack.kilogram.length > 0) {
            const firstWeight = snack.kilogram[0];
            priceDisplay.innerText = 'Price: ₹' + snack.price[firstWeight]; // Default to first weight option
        } else {
            priceDisplay.innerText = 'Price: ₹0'; // Default price if weight is not available
        }
        snackElement.appendChild(priceDisplay);

        // Create dropdown for weight options if they exist
        if (snack.kilogram && Array.isArray(snack.kilogram) && snack.kilogram.length > 0) {
            const weightSelect = document.createElement('select');
            weightSelect.classList.add('weight-select');
            snack.kilogram.forEach(weight => {
                const option = document.createElement('option');
                option.value = weight;
                option.innerText = weight; // Show weight (e.g., 1kg, 500g)
                weightSelect.appendChild(option);
            });

            snackElement.appendChild(weightSelect);
            const lineBreak = document.createElement('br');
            snackElement.appendChild(lineBreak);

            // Update the price when weight is changed
            weightSelect.addEventListener('change', function () {
                const selectedWeight = weightSelect.value;
                const selectedPrice = snack.price[selectedWeight]; // Get price from the map using selected weight
                priceDisplay.innerText = 'Price: ₹' + selectedPrice; // Update price
            });

            // Create Add to Cart button
            const addToCartButton = document.createElement('button');
            addToCartButton.innerText = 'Add to Cart';
            addToCartButton.classList.add('add-to-cart');
            snackElement.appendChild(addToCartButton);

            // Handle Add to Cart button click
            addToCartButton.addEventListener('click', function () {
                const selectedWeight = weightSelect.value;
                const selectedPrice = snack.price[selectedWeight];
                addToCart(snack.name, selectedPrice, snack.img, selectedWeight);
            });
        } else {
            // If no weight options are available, show "Out of stock"
            const addToCartButton = document.createElement('button');
            addToCartButton.innerText = 'Out of stock';
            addToCartButton.disabled = true;
            snackElement.appendChild(addToCartButton);
        }

        // Append snack element to the container
        container.appendChild(snackElement);
    });
}

async function addToCart(name, price, img, weight) {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Use the user's email as the document ID in Firestore
    const cartRef = doc(db, 'carts', userEmail); // Reference to the user's cart document in Firestore

    // Fetch the user's current cart from Firestore
    const cartDoc = await getDoc(cartRef);
    let cart = cartDoc.exists() ? cartDoc.data().items : []; // Retrieve cart items or initialize as an empty array

    const existingItem = cart.find(item => item.name === name && item.weight === weight);

    if (existingItem) {
        if (existingItem.quantity < 10) {
            existingItem.quantity += 1; // Increment quantity if item is already in the cart
        } else {
            alert('Maximum quantity of 10 reached for this item');
            return;
        }
    } else {
        cart.push({
            name: name,
            price: price,
            img: img,
            weight: weight,
            quantity: 1
        });
    }

    // Update the cart in Firestore
    await setDoc(cartRef, { items: cart });

    alert('Product added to cart!');
    window.location.href = '../html/addtocart.html'; // Redirect to cart page
}

// Handle search functionality
document.getElementById('search-bar').addEventListener('input', function (e) {
    const searchQuery = e.target.value.toLowerCase();
    const filteredSnacks = allSnacks.filter(snack =>
        snack.name.toLowerCase().includes(searchQuery) ||
        snack.kilogram.some(weight => weight.toString().includes(searchQuery)) ||
        Object.values(snack.price).some(price => price.toString().includes(searchQuery))
    );

    // Display products or show an alert if no matches found
    if (filteredSnacks.length === 0) {
        alert('No matches found');
    } else {
        displaySnacks(filteredSnacks); // Re-display products based on search query
    }
});

// Fetch snacks when the page loads
fetchSnacks();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        document.getElementById('signinButton').style.display = 'none';
        document.getElementById('profileButton').style.display = 'inline-block';


    } else {
        // User is logged out
        document.getElementById('signinButton').style.display = 'inline-block';
        document.getElementById('profileButton').style.display = 'none';

    }
});