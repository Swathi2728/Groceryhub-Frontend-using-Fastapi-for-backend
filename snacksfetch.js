import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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

// Fetch the data
async function fetchSnacks() {
    const snacksRef = collection(db, 'snacks'); // Firestore collection reference for snacks
    const snapshot = await getDocs(snacksRef); // Get documents in the 'snacks' collection
    const snacks = snapshot.docs.map(doc => doc.data()); // Map documents to data

    displaySnacks(snacks); // Call the function to display snacks
}

// Display snacks with weight selection, dynamic price change, and Add to Cart button
function displaySnacks(snacks) {
    const container = document.getElementById('snacks-container');
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

        // Price display (initial price will be based on the first weight option)
        const priceDisplay = document.createElement('p');
        priceDisplay.classList.add('price');
        priceDisplay.innerText = 'Price: ₹' + snack.price[snack.weight[0]]; // Default to first weight option
        snackElement.appendChild(priceDisplay);

        // Create dropdown for weight options
        const weightSelect = document.createElement('select');
        weightSelect.classList.add('weight-select');
        snack.weight.forEach(weight => {
            const option = document.createElement('option');
            option.value = weight;
            option.innerText = weight;
            weightSelect.appendChild(option);
        });

        snackElement.appendChild(weightSelect);
        const lineBreak = document.createElement('br'); // Create <br> tag
        snackElement.appendChild(lineBreak);

        // Update the price when weight is changed
        weightSelect.addEventListener('change', function () {
            const selectedWeight = weightSelect.value;
            const selectedPrice = snack.price[selectedWeight];
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

        // Append snack element to the container
        container.appendChild(snackElement);
    });
}

// Example addToCart function (using localStorage to store cart)
function addToCart(name, price, img, weight) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name && item.weight === weight);

    if (existingItem) {
        existingItem.quantity += 1;  // Increment quantity if item is already in the cart
    } else {
        cart.push({
            name: name,
            price: price,
            img: img,
            weight: weight,
            quantity: 1
        });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optionally, show a message or redirect
    alert('Product added to cart!');
    window.location.href = 'addtocart.html'; // Redirect to the cart page
}

// Call the function to fetch and display snack products
fetchSnacks();

