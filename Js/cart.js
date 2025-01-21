import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore database

// Function to display the cart
async function displayCart(user) {
    console.log('User:', user); // Check if user is logged in

    if (!user) {
        alert('Please log in to view your cart.');
        window.location.href = '../html/login.html'; // Redirect to login if not logged in
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Use email as Firestore document ID
    console.log("Fetching cart data for:", userEmail);

    // Get cart data from Firestore
    const cartDocRef = doc(db, 'carts', userEmail);
    const cartDoc = await getDoc(cartDocRef);

    let cart = [];
    if (cartDoc.exists()) {
        cart = cartDoc.data().items || [];
        console.log('Cart data:', cart); // Check if cart data is retrieved
    }

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
        const totalDiv = document.getElementById('cart-total');
        if (totalDiv) {
            totalDiv.innerHTML = 'Total Price: ₹0.00';
        }
        return;
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
            updateQuantity(userEmail, index, 'decrease');
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            updateQuantity(userEmail, index, 'increase');
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeFromCart(userEmail, index);
        });
    });
}

// Function to remove item from the cart
async function removeFromCart(userEmail, index) {
    const cartDocRef = doc(db, 'carts', userEmail);
    const cartDoc = await getDoc(cartDocRef);
    let cart = cartDoc.exists() ? cartDoc.data().items : [];

    // Remove the item from the cart by index
    cart.splice(index, 1);

    // Update the cart in Firestore
    await setDoc(cartDocRef, { items: cart });

    // Refresh the cart page to reflect changes
    displayCart(auth.currentUser);
}

// Function to update quantity (increase or decrease)
async function updateQuantity(userEmail, index, action) {
    const cartDocRef = doc(db, 'carts', userEmail);
    const cartDoc = await getDoc(cartDocRef);
    let cart = cartDoc.exists() ? cartDoc.data().items : [];

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

    // Update the cart in Firestore
    await setDoc(cartDocRef, { items: cart });

    // Refresh the cart page to reflect changes
    displayCart(auth.currentUser);
}

// Function to log out the user
function logout() {
    const user = auth.currentUser;
    if (user) {
        // Optionally, you can clear the user's cart when they log out
        const userEmail = user.email.replace('.', '_');
        const cartDocRef = doc(db, 'carts', userEmail);
        setDoc(cartDocRef, { items: [] }); // Clear the cart from Firestore

        // Sign out the user
        signOut(auth).then(() => {
            alert('Logged out successfully!');
            window.location.href = '../html/login.html'; // Redirect to login page
        }).catch(error => {
            console.error('Logout error: ', error);
        });
    }
}

// Function to checkout
async function checkout() {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to proceed with checkout.');
        window.location.href = '../html/login.html'; // Redirect to login if not logged in
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Use email as Firestore document ID

    // Get cart data from Firestore
    const cartDocRef = doc(db, 'carts', userEmail);
    const cartDoc = await getDoc(cartDocRef);
    const cart = cartDoc.exists() ? cartDoc.data().items : [];

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Save the cart data to sessionStorage (or localStorage) for the order page
    localStorage.setItem('orderItems', JSON.stringify(cart));

    // Do not clear the cart here; wait until payment is completed

    // Redirect to the order page (payment page)
    window.location.href = '../html/order.html'; // Replace 'order.html' with your order page URL
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
