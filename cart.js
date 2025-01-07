// Import necessary Firebase modules
// Import necessary Firebase modules
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";

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
const auth = getAuth(app); // Initialize Firebase Authentication

// Function to display the cart
function displayCart(user) {
    console.log('User:', user); // Check if user is logged in

    if (!user) {
        alert('Please log in to view your cart.');
        window.location.href = 'login.html'; // Redirect to login if not logged in
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Replace '.' with '_' for the key
    console.log("Storing and retrieving cart with key:", userEmail); // Log the key used for localStorage

    // Get cart data from localStorage using the user's email as the key
    const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
    console.log('Cart data:', cart); // Check if cart data is retrieved

    // Get the cart container where you want to display cart items
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message'); // Assuming this is the element for empty cart message

    if (!cartContainer) {
        console.error("No element with id 'cart-container' found.");
        return;
    }

    // Clear any existing cart content
    cartContainer.innerHTML = '';

    // Check if cart is empty and show the message
    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block'; // Show the empty cart message
        }
    // Exit the function if the cart is empty
        const totalDiv = document.getElementById('cart-total');
        if (totalDiv) {
            totalDiv.innerHTML = 'Total Price: ₹0.00';
        }

        return; //
    }

    // Hide the empty cart message if there are items
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }

    let totalPrice = 0;

    // Display each item in the cart
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        // HTML for displaying item name, image, weight, price, and quantity
        itemDiv.innerHTML = `
            <div>
                <h2>${item.name}</h2>
                <p class="weight">Weight: ${item.weight}</p>
                <p class="price">Price: ₹${item.price}</p>
                <p class="price">Quantity: 
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </p>
                <p class="total">Total: ₹${item.price * item.quantity}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
            <div>
                <img src="${item.img}" alt="${item.name}">
            </div>
        `;

        cartContainer.appendChild(itemDiv);

        // Calculate the total price
        totalPrice += item.price * item.quantity;
    });

    // Display the total price at the bottom
    const totalDiv = document.getElementById('cart-total');
    if (totalDiv) {
        totalDiv.innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;
    }

    // Attach event listeners for the dynamically added buttons
    const decreaseButtons = cartContainer.querySelectorAll('.decrease');
    const increaseButtons = cartContainer.querySelectorAll('.increase');
    const removeButtons = cartContainer.querySelectorAll('.remove-btn');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            updateQuantity(index, 'decrease');
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            updateQuantity(index, 'increase');
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        });
    });
}



// Function to remove item from the cart
function removeFromCart(index) {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to modify your cart.');
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Replace '.' with '_'

    // Get cart data from localStorage
    let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

    // Remove the item from the cart by index
    cart.splice(index, 1);

    // Save the updated cart to localStorage
    localStorage.setItem(userEmail, JSON.stringify(cart));

    // Refresh the cart page to reflect changes
    displayCart(user);
}

// Function to update quantity (increase or decrease)
function updateQuantity(index, action) {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to modify your cart.');
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Replace '.' with '_'

    // Get cart data from localStorage
    let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

    // Find the item in the cart
    const item = cart[index];

    if (action === 'increase') {
        if (item.quantity < 10) {
            item.quantity += 1; // Increment quantity if item is already in the cart
        } else {
            alert('Maximum quantity of 10 reached for this item.');
            return;
        }
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
    }

    // Save the updated cart to localStorage
    localStorage.setItem(userEmail, JSON.stringify(cart));

    // Refresh the cart page to reflect changes
    displayCart(user);
}

// Function to log out the user
function logout() {
    const user = auth.currentUser;
    if (user) {
        // Optionally, you can clear the user's cart when they log out
        localStorage.removeItem(user.email.replace('.', '_')); // Clear the cart from localStorage

        // Sign out the user
        signOut(auth).then(() => {
            alert('Logged out successfully!');
            window.location.href = 'login.html'; // Redirect to login page
        }).catch(error => {
            console.error('Logout error: ', error);
        });
    }
}

function checkout() {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to proceed with checkout.');
        window.location.href = 'login.html'; // Redirect to login if not logged in
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Replace '.' with '_'

    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem(userEmail)) || [];

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Save the cart data to sessionStorage (or localStorage) for the order page
    localStorage.setItem('orderItems', JSON.stringify(cart));

    // Do not clear the cart here; wait until payment is completed

    // Redirect to the order page (payment page)
    window.location.href = 'order.html'; // Replace 'order.html' with your order page URL
}

// Add event listener to the checkout button
const checkoutButton = document.querySelector('.checkout-btn');
if (checkoutButton) {
    checkoutButton.addEventListener('click', checkout);
}

// Monitor the authentication state
onAuthStateChanged(auth, (user) => {
    displayCart(user);
    console.log('Auth state changed:', user);
});