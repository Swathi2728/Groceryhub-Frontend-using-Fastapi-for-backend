// Import Firebase modules from Firebase SDK v9 and above
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Firebase Configuration
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

let vegetables = []; // Global variable to store vegetables

// Fetch the data
async function fetchVegetables() {
    const vegetablesRef = collection(db, 'vegetables'); // Firestore collection reference for vegetables
    const snapshot = await getDocs(vegetablesRef); // Get documents in the 'vegetables' collection
    vegetables = snapshot.docs.map(doc => doc.data()); // Store data in the global vegetables array

    displayVegetables(vegetables); // Call the function to display vegetables
}

// Display vegetables with weight selection, dynamic price change, and Add to Cart button
function displayVegetables(vegetables) {
    const container = document.getElementById('vegetables-container');
    container.innerHTML = ''; // Clear previous vegetables

    vegetables.forEach(vegetable => {
        const vegetableElement = document.createElement('div');
        vegetableElement.classList.add('vegetable-card');

        // Add vegetable image
        const img = document.createElement('img');
        img.src = vegetable.img;
        img.alt = vegetable.name;
        img.style.height='200px';
        img.style.width='200px';
        img.style.borderRadius='5px';
        vegetableElement.appendChild(img);

        // Add vegetable name
        const name = document.createElement('h2');
        name.innerText = vegetable.name;
        vegetableElement.appendChild(name);

        // Price display (initial price will be based on the first weight option)
        const priceDisplay = document.createElement('p');
        priceDisplay.classList.add('price');
        priceDisplay.innerText = 'Price: ₹' + vegetable.price[vegetable.kilogram[0]]; // Default to first weight option
        vegetableElement.appendChild(priceDisplay);

        // Create dropdown for weight options
        const weightSelect = document.createElement('select');
        weightSelect.classList.add('weight-select');
        vegetable.kilogram.forEach(weight => {
            const option = document.createElement('option');
            option.value = weight;
            option.innerText = weight;
            weightSelect.appendChild(option);
        });

        vegetableElement.appendChild(weightSelect);
        const lineBreak = document.createElement('br'); // Create <br> tag
        vegetableElement.appendChild(lineBreak);

        // Update the price when weight is changed
        weightSelect.addEventListener('change', function () {
            const selectedWeight = weightSelect.value;
            const selectedPrice = vegetable.price[selectedWeight];
            priceDisplay.innerText = 'Price: ₹' + selectedPrice; // Update price
        });

        // Create Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add to Cart';
        addToCartButton.classList.add('add-to-cart');
        vegetableElement.appendChild(addToCartButton);

        // Handle Add to Cart button click
        addToCartButton.addEventListener('click', function () {
            const selectedWeight = weightSelect.value; // Get selected weight
            const selectedPrice = vegetable.price[selectedWeight]; // Get price for selected weight

            // Log or perform action to add item to cart
            console.log('Added to cart:', {
                name: vegetable.name,
                price: selectedPrice,
                weight: selectedWeight,
                img: vegetable.img
            });

            addToCart(vegetable.name, selectedPrice, vegetable.img, selectedWeight);
        });

        // Append vegetable element to the container
        container.appendChild(vegetableElement);
    });
}

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
        if (existingItem.quantity < 10) {
            existingItem.quantity += 1; // Increment quantity if item is already in the cart
        } else {
            alert('Maximum quantity of 10 reached for this item And already in cart');
            return;
        }
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

// Search function for filtering vegetables by name
function searchVegetables(searchTerm) {
    // Filter vegetables by name
    const filteredVegetables = vegetables.filter(vegetable => 
        vegetable.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredVegetables.length === 0) {
        alert("No items found matching your search.");
    } else {
        displayVegetables(filteredVegetables); // Display filtered vegetables
    }
}

// Event listener for search input
document.getElementById('search-bar').addEventListener('input', function (event) {
    const searchTerm = event.target.value; // Get the search term from the input field
    searchVegetables(searchTerm); // Filter and display vegetables based on search term
});

// Call the function to fetch and display vegetables
fetchVegetables();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        document.getElementById('signinButton').style.display = 'none';
    } else {
        // User is logged out
        document.getElementById('signinButton').style.display = 'inline-block';
    }
});
