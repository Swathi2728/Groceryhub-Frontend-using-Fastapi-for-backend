// function displayCartItems() {
//     // Get the cart from localStorage or initialize an empty array if no cart is found
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
//     const cartContainer = document.getElementById('cart-container'); // Get the container where cart items will go
//     cartContainer.innerHTML = ''; // Clear any existing items

//     if (cart.length === 0) {
//         cartContainer.innerHTML = '<p>Your cart is empty.</p>';
//         return;
//     }

//     let totalPrice = 0;

//     cart.forEach(item => {
//         const cartItemDiv = document.createElement('div');
//         cartItemDiv.classList.add('cart-item');

//         cartItemDiv.innerHTML = `
//             <div><img src="${item.img}" alt="${item.name}" style="width: 100px;"></div>
//             <div><strong>${item.name}</strong><br>${item.weight}</div>
//             <div>Price: ${item.price}</div>
//             <div class="total">Total: ${item.price }</div>
//         `;
        
//         totalPrice += item.price ;

//         cartContainer.appendChild(cartItemDiv);
//     });

//     // Display the total price of the cart
//     const cartTotalDiv = document.getElementById('cart-total');
//     cartTotalDiv.innerHTML = `Total Price: ${totalPrice}`;
// }

// // Call the displayCartItems function when the page is fully loaded
// document.addEventListener('DOMContentLoaded', displayCartItems);

// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// // Firebase Configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCo5NR_s6Pbd_ZypP_5tgp2joEHmA7RcT8",
//     authDomain: "login-form-9e415.firebaseapp.com",
//     projectId: "login-form-9e415",
//     storageBucket: "login-form-9e415.appspot.com",
//     messagingSenderId: "900436401273",
//     appId: "1:900436401273:web:d09d181852913621e048a8"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app); // Initialize Firebase Authentication
// const db = getFirestore(app);

// // Function to display "Add to Cart" message and redirect to the cart page
// function showAddedMessage() {
//     alert('Product added to cart!');
//     window.location.href = 'addtocart.html'; // Redirect to the cart page
// }

// // Function to add an item to the cart
// function addToCart(name, price, img, weight) {
//     const user = auth.currentUser; // Get the current authenticated user

//     if (!user) {
//         alert('Please log in to add items to your cart.');
//         return; // If the user is not logged in, return early
//     }

//     const userEmail = user.email.replace('.', '_'); // Firebase doesn't allow '.' in keys, so we replace it with '_'

//     // Get cart data from localStorage using the user's email as the key
//     const cart = JSON.parse(localStorage.getItem(userEmail)) || [];

//     // Check if the item already exists in the cart
//     const existingItem = cart.find(item => item.name === name && item.weight === weight);

//     if (existingItem) {
//         // If the item exists, increment the quantity
//         existingItem.quantity += 1;
//     } else {
//         // Otherwise, add a new item to the cart
//         cart.push({
//             name: name,
//             price: price,
//             img: img,
//             weight: weight,
//             quantity: 1
//         });
//     }

//     // Save the updated cart back to localStorage under the user's email
//     localStorage.setItem(userEmail, JSON.stringify(cart));

//     // Show a message and redirect to the cart page
//     showAddedMessage();
// }

