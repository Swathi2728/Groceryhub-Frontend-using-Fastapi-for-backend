// Import Firebase modules from Firebase SDK v9 and above
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

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

// Fetch the data
async function fetchFruits() {
    const fruitsRef = collection(db, 'fruits'); // Firestore collection reference
    const snapshot = await getDocs(fruitsRef); // Get documents in the 'fruits' collection
    const fruits = snapshot.docs.map(doc => doc.data()); // Map documents to data

    displayFruits(fruits); // Call the function to display fruits
}
// Display fruits with weight selection, dynamic price change, and Add to Cart button
function displayFruits(fruits) {
    const container = document.getElementById('fruits-container');
    fruits.forEach(fruit => {
        const fruitElement = document.createElement('div');
        // fruitElement.style.border = '1px solid #ccc';
        // fruitElement.style.margin = '10px';
        // fruitElement.style.padding = '10px';
        // fruitElement.classList.add('maindiv')

        // Create fruit name
    

        // Add fruit image
        const img = document.createElement('img');
        img.src = fruit.img;
        img.alt = fruit.name;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.borderRadius='5px';
        fruitElement.appendChild(img);

        const name = document.createElement('h2');
        name.innerText = fruit.name;
        fruitElement.appendChild(name);

        const priceDisplay = document.createElement('p');
        priceDisplay.classList.add('price');
        priceDisplay.innerText = 'Price: ' + fruit.price[fruit.kilogram[0]]; // Default to first weight option
        fruitElement.appendChild(priceDisplay);


        // Create dropdown for weight options
        const weightSelect = document.createElement('select');
        weightSelect.classList.add('weight-select'); // Add a class for styling if needed
        fruit.kilogram.forEach(weight => {
            const option = document.createElement('option');
            option.value = weight;
            option.innerText = weight;
            weightSelect.appendChild(option);`br`
        });

        fruitElement.appendChild(weightSelect);
        const lineBreak = document.createElement('br'); // Create <br> tag
        fruitElement.appendChild(lineBreak); 

        // Create price display (initial price will be based on the first option)
        
        // Update the price when weight is changed
        weightSelect.addEventListener('change', function () {
            const selectedWeight = weightSelect.value;
            const selectedPrice = fruit.price[selectedWeight];
            priceDisplay.innerText = 'Price: ' + selectedPrice; // Update price
        });

        // Create Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add to Cart';
        addToCartButton.classList.add('add-to-cart'); // Add class for styling if needed
        fruitElement.appendChild(addToCartButton);
        // const addToCartButton1 = document.createElement('button');
        // addToCartButton1.innerText = 'Add to Cart';
        // addToCartButton1.classList.add('add-to-cart'); // Add class for styling if needed
        // fruitElement.appendChild(addToCartButton1);

        // Handle Add to Cart button click
        addToCartButton.addEventListener('click', function () {
            const selectedWeight = weightSelect.value; // Get selected weight
            const selectedPrice = fruit.price[selectedWeight]; // Get price for selected weight

            // Log or perform action to add item to cart (for now we will just log the info)
            console.log('Added to cart:', {
                name: fruit.name,
                price: selectedPrice,
                weight: selectedWeight,
                img: fruit.img
            });

            // You can also add the item to a shopping cart here, for example:
            addToCart(fruit.name, selectedPrice, fruit.img, selectedWeight);
        });

        // Append fruit element to the container
        container.appendChild(fruitElement);
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

// Call the function to fetch and display fruits
fetchFruits();
