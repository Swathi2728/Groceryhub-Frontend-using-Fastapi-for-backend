import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    // Fetch the cart data from localStorage (or sessionStorage)
    const orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    const orderContainer = document.getElementById('order-container');
    const totalPriceContainer = document.getElementById('total-price-container');

    if (orderItems.length === 0) {
        alert('Your cart is empty. Please add items to your cart before proceeding.');
        
        // orderContainer.innerHTML = '<p>Your cart is empty.</p>';
        // totalPriceContainer.innerHTML = ''; // No price display if cart is empty
        return;
    }

    let totalPrice = 0;

    // Display each item in the order
    orderItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');

        itemDiv.innerHTML = `
            <div>
                <h2>${item.name}</h2>
                <p class="weight">Weight: ${item.weight}</p>
                <p class="price">Price: ₹${item.price}</p>
                <p class="price">Quantity: ${item.quantity}</p>
                <p class="total">Total: ₹${item.price * item.quantity}</p>
            </div>
            <div>
                <img src="${item.img}" alt="${item.name}">
            </div>
        `;

        orderContainer.appendChild(itemDiv);
        totalPrice += item.price * item.quantity;
    });

    // Display the total price
    totalPriceContainer.innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;
});

// Submit event for the payment form
document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    const fullName = document.getElementById('full-name').value.trim();
    const addressLine1 = document.getElementById('address-line1').value.trim();
    const addressLine2 = document.getElementById('address-line2').value.trim();
    const state = document.getElementById('state').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();
    const paymentOption = document.getElementById('payment-option').value;

    let cardNumber = '';
    let expiryDate = '';
    let cvv = '';

    if (paymentOption === 'credit-debit-card') {
        cardNumber = document.getElementById('card-number').value.trim();
        expiryDate = document.getElementById('expiry-date').value.trim();
        cvv = document.getElementById('cvv').value.trim();
    }

    // Validation for the payment form
    const fullNameRegex = /^[A-Z][a-z]*([ ]?[A-Z][a-z]*)*$/;
    if (!fullName || !fullNameRegex.test(fullName)) {
        alert('Please enter a valid full name. The first letter should be uppercase, and no spaces in the name.');
        return;
    }

    if (!addressLine1 || !state || !city || !zipcode || !paymentOption) {
        alert('Please fill out all the required fields.');
        return;
    }

    const zipcodeRegex = /^[0-9]{6}$/;
    if (!zipcodeRegex.test(zipcode)) {
        alert('Please enter a valid ZIP code with exactly 6 digits.');
        return;
    }

    // Validate card details if Credit/Debit Card is selected
    if (paymentOption === 'credit-debit-card') {
        const cardNumberRegex = /^[0-9]{15,16}$/;
        if (!cardNumber || !cardNumberRegex.test(cardNumber)) {
            alert('Please enter a valid credit/debit card number (15 to 16 digits).');
            return;
        }

        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryDate || !expiryDateRegex.test(expiryDate)) {
            alert('Please enter a valid expiry date in the format MM/YY.');
            return;
        }

        const cvvRegex = /^[0-9]{3}$/;
        if (!cvv || !cvvRegex.test(cvv)) {
            alert('Please enter a valid CVV (3 digits).');
            return;
        }
    }

    // Get current logged-in user
    const user = auth.currentUser;
    if (!user) {
        alert('Please log in to view your orders.');
        window.location.href = 'login.html'; // Redirect if not logged in
        return;
    }

    // Confirmation before completing the order
    
    const isConfirmed = window.confirm('Payment successful! Your order has been placed. Do you want to continue?');

    if (isConfirmed) {
        const userEmail = user.email.replace('.', '_'); // Convert email to a usable key
        const cartItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    
        const order = {
            date: new Date().toLocaleDateString(),
            status: 'Placed',
            items: cartItems
        };
    
        let userOrders = JSON.parse(localStorage.getItem(userEmail + '_orders')) || [];
        userOrders.push(order);
    
        localStorage.setItem(userEmail + '_orders', JSON.stringify(userOrders));
    
        // Remove cart items from localStorage after the order is placed
        localStorage.removeItem('orderItems');  // Clear cart data
        if (user) {
            const userEmail = user.email.replace('.', '_');
            localStorage.removeItem(userEmail); // Remove cart from localStorage
        }

    
        alert('Thank you for your purchase!');
        window.location.href = 'index.html'; // Redirect to home


    } else {
        alert('Your order has been canceled.');
        window.location.href = 'index.html'; // Redirect to home
    }
    
});

// Show/hide card details based on payment method selected
document.getElementById('payment-option').addEventListener('change', function () {
    const cardDetailsDiv = document.getElementById('card-details');
    if (this.value === 'credit-debit-card') {
        cardDetailsDiv.style.display = 'block'; // Show card details
    } else {
        cardDetailsDiv.style.display = 'none'; // Hide card details
    }
});
