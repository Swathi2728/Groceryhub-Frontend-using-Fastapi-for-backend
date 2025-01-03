// Import Firebase modules from Firebase SDK v9 and above
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

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

let fruits = []; // Global fruits array

// Fetch the data
async function fetchFruits() {
    const fruitsRef = collection(db, 'fruits'); // Firestore collection reference
    const snapshot = await getDocs(fruitsRef); // Get documents in the 'fruits' collection
    fruits = snapshot.docs.map(doc => doc.data()); // Use the global fruits array

    // Check if fruits array is empty and display a message or fruits
    if (fruits.length === 0) {
        displayNoFruits();
    } else {
        displayFruits(fruits); // Display all fruits after fetching
    }
}

// Display fruits with weight selection, dynamic price change, and Add to Cart button
function displayFruits(fruits) {
    const container = document.getElementById('fruits-container');
    container.innerHTML = ''; // Clear any previous fruits displayed

    fruits.forEach(fruit => {
        const fruitElement = document.createElement('div');

        // Add fruit image
        const img = document.createElement('img');
        img.src = fruit.img;
        img.alt = fruit.name;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.borderRadius = '5px';
        fruitElement.appendChild(img);

        const name = document.createElement('h2');
        name.innerText = fruit.name;
        fruitElement.appendChild(name);

        const priceDisplay = document.createElement('p');
        priceDisplay.classList.add('price');
        priceDisplay.innerText = 'Price: ₹' + fruit.price[fruit.kilogram[0]]; // Default to first weight option
        fruitElement.appendChild(priceDisplay);

        // Create dropdown for weight options
        const weightSelect = document.createElement('select');
        weightSelect.classList.add('weight-select');
        fruit.kilogram.forEach(weight => {
            const option = document.createElement('option');
            option.value = weight;
            option.innerText = weight;
            weightSelect.appendChild(option);
        });
        fruitElement.appendChild(weightSelect);

        const lineBreak = document.createElement('br');
        fruitElement.appendChild(lineBreak);

        // Update the price when weight is changed
        weightSelect.addEventListener('change', function () {
            const selectedWeight = weightSelect.value;
            const selectedPrice = fruit.price[selectedWeight];
            priceDisplay.innerText = 'Price: ₹' + selectedPrice; // Update price
        });

        // Create Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add to Cart';
        addToCartButton.classList.add('add-to-cart');
        fruitElement.appendChild(addToCartButton);

        addToCartButton.addEventListener('click', function () {
            const selectedWeight = weightSelect.value;
            const selectedPrice = fruit.price[selectedWeight];
            addToCart(fruit.name, selectedPrice, fruit.img, selectedWeight);
        });

        // Append fruit element to the container
        container.appendChild(fruitElement);
    });
}

function displayNoFruits() {
    const container = document.getElementById('fruits-container');
    container.innerHTML = '<p>No fruits available at the moment. Please check back later.</p>';
}

// Add item to cart
function addToCart(name, price, img, weight) {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Use the user's email as the key for localStorage
    const cart = JSON.parse(localStorage.getItem(userEmail)) || []; // Retrieve the user's cart from localStorage (or initialize as empty array)

    const existingItem = cart.find(item => item.name === name && item.weight === weight);

    if (existingItem) {
        if (existingItem.quantity < 10) {
            existingItem.quantity += 1; // Increment quantity if item is already in the cart
        } else {
            alert('Maximum quantity of 10 reached for this item And already in cart');
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

    localStorage.setItem(userEmail, JSON.stringify(cart));

    alert('Product added to cart!');
    window.location.href = 'addtocart.html'; // Redirect to cart page
}

// Search function for filtering fruits by name
function searchFruits(searchTerm) {
    // Check if fruits array is populated
    if (fruits.length === 0) {
        alert("No fruits available for search. Please wait until the data is fetched.");
        return;
    }

    const filteredFruits = fruits.filter(fruit => {
        return fruit.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (filteredFruits.length === 0) {
        alert("No items found matching your search.");
    } else {
        displayFruits(filteredFruits);  // Display filtered fruits
    }
}

// Event listener for search input
document.getElementById('search-bar').addEventListener('input', function (event) {
    const searchTerm = event.target.value;  // Get the search term from the input field
    searchFruits(searchTerm); // Filter and display fruits based on search term
});

// Call the function to fetch and display fruits
fetchFruits();
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
