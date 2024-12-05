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
    // Fetch the cart data from sessionStorage (or localStorage)
    const orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];
    const orderContainer = document.getElementById('order-container');
    const totalPriceContainer = document.getElementById('total-price-container');

    if (orderItems.length === 0) {
        orderContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceContainer.innerHTML = ''; // No price display if cart is empty
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

    if (paymentOption === 'credit-debit-card' ) {
        cardNumber = document.getElementById('card-number').value.trim();
        expiryDate = document.getElementById('expiry-date').value.trim();
        cvv = document.getElementById('cvv').value.trim();
    }
  

    // Validate Full Name (First letter uppercase, no spaces)
    const fullNameRegex = /^[A-Z][a-z]*([ ]?[A-Z][a-z]*)*$/;
    if (!fullName || !fullNameRegex.test(fullName)) {
        alert('Please enter a valid full name. The first letter should be uppercase, and no spaces in the name.');
        return;
    }

    // Validate required fields (Address, State, City, Zipcode, Payment Option)
    if (!addressLine1 || !state || !city || !zipcode || !paymentOption) {
        alert('Please fill out all the required fields.');
        return;
    }

    // Validate Zipcode (must be exactly 6 digits, no alphabet or spaces)
    const zipcodeRegex = /^[0-9]{6}$/;
    if (!zipcodeRegex.test(zipcode)) {
        alert('Please enter a valid ZIP code with exactly 6 digits.');
        return;
    }

    // Validate card details if Credit/Debit Card is selected
    if (paymentOption === 'credit-debit-card') {
        // Credit Card Number (15 to 16 digits)
        const cardNumberRegex = /^[0-9]{15,16}$/;
        if (!cardNumber || !cardNumberRegex.test(cardNumber)) {
            alert('Please enter a valid credit/debit card number (15 to 16 digits).');
            return;
        }

        // Expiry Date (MM/YY format)
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryDate || !expiryDateRegex.test(expiryDate)) {
            alert('Please enter a valid expiry date in the format MM/YY.');
            return;
        }

        // CVV (exactly 3 digits)
        const cvvRegex = /^[0-9]{3}$/;
        if (!cvv || !cvvRegex.test(cvv)) {
            alert('Please enter a valid CVV (3 digits).');
            return;
        }
    }

    // Ask for confirmation
    const isConfirmed = window.confirm('Payment successful! Your order has been placed. Do you want to continue?');
   

    // Only clear the cart if the user clicks "OK"
    if (isConfirmed) {
        // After payment, clear sessionStorage and localStorage
        sessionStorage.removeItem('orderItems');

        // Optionally clear the localStorage if necessary
        const user = auth.currentUser;
        if (user) {
            const userEmail = user.email.replace('.', '_');
            localStorage.removeItem(userEmail); // Remove cart from localStorage
        }

        // Display success message
        alert('Thank you for your purchase!');
        // Redirect to a thank you page or any other page
        window.location.href = 'index.html'; // Redirect to your homepage
    } else {
        // If the user clicked "Cancel", simply return without doing anything
        alert('Your order has been canceled');
        window.location.href = 'index.html';
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

