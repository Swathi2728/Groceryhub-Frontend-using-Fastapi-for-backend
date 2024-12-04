import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

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

// Fetch the data
async function fetchSnacks() {
    const snacksRef = collection(db, 'snacks');
    const snapshot = await getDocs(snacksRef);

    if (snapshot.empty) {
        console.log('No snacks found in Firestore');
    } else {
        const snacks = snapshot.docs.map(doc => doc.data());
        console.log('Snacks fetched:', snacks);
        displaySnacks(snacks);
    }
}

function displaySnacks(snacks) {
    const container = document.getElementById('snacks-container');
    snacks.forEach(snack => {
        console.log(snack);  // Log the snack object to check the structure
        console.log('Snack weight:', snack.kilogram); // Log weight array
        console.log('Snack price:', snack.price);    // Log price map
        
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

        // Price display (initial price will be based on the first weight option)
        const priceDisplay = document.createElement('p');
        priceDisplay.classList.add('price');
        
        // Check if 'kilogram' exists and has values
        if (snack.kilogram && Array.isArray(snack.kilogram) && snack.kilogram.length > 0) {
            // Use the first weight in the array to get the price from the price map
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
            const lineBreak = document.createElement('br'); // Create <br> tag
            snackElement.appendChild(lineBreak);

            // Update the price when weight is changed
            weightSelect.addEventListener('change', function () {
                const selectedWeight = weightSelect.value;
                const selectedPrice = snack.price[selectedWeight]; // Get price from the map using the selected weight
                priceDisplay.innerText = 'Price: ₹' + selectedPrice; // Update price
            });

            // Create Add to Cart button
            const addToCartButton = document.createElement('button');
            addToCartButton.innerText = 'Add to Cart';
            addToCartButton.classList.add('add-to-cart');
            snackElement.appendChild(addToCartButton);

            // Handle Add to Cart button click
            addToCartButton.addEventListener('click', function () {
                const selectedWeight = weightSelect.value; // Get selected weight
                const selectedPrice = snack.price[selectedWeight]; // Get price for selected weight

                // Log or perform action to add item to cart
                console.log('Added to cart:', {
                    name: snack.name,
                    price: selectedPrice,
                    weight: selectedWeight,
                    img: snack.img
                });

                addToCart(snack.name, selectedPrice, snack.img, selectedWeight);
            });
        } else {
            // Fallback if no weight options exist
            const addToCartButton = document.createElement('button');
            addToCartButton.innerText = 'Out of stock';
            addToCartButton.disabled = true;
            snackElement.appendChild(addToCartButton);
        }

        // Append snack element to the container
        container.appendChild(snackElement);
    });
}

fetchSnacks();
// Example addToCart function (using localStorage to store cart)
function addToCart(name, price, img, weight) {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Use the user's email as the key for localStorage
    const cart = JSON.parse(localStorage.getItem(userEmail)) || []; // Retrieve the user's cart from localStorage (or initialize as empty array)

    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.name === name && item.weight === weight);

    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item is already in the cart
    } else {
        // Add a new item to the cart
        cart.push({
            name: name,
            price: price,
            img: img,
            weight: weight,
            quantity: 1
        });
    }

    // Save the updated cart to localStorage under the user's email
    localStorage.setItem(userEmail, JSON.stringify(cart));

    // Optionally, show a message or redirect
    alert('Product added to cart!');
    window.location.href = 'addtocart.html'; // Redirect to the cart page
}