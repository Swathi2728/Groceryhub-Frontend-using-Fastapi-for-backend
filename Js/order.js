import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js"; // Make sure to import onAuthStateChanged
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js"; 


const firebaseConfig = {
    apiKey: "AIzaSyCo5NR_s6Pbd_ZypP_5tgp2joEHmA7RcT8",
    authDomain: "login-form-9e415.firebaseapp.com",
    projectId: "login-form-9e415",
    storageBucket: "login-form-9e415.appspot.com",
    messagingSenderId: "900436401273",
    appId: "1:900436401273:web:d09d181852913621e048a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userEmail = user.email.replace('.', '_'); 

            const cartRef = doc(db, 'carts', userEmail);
            const cartSnap = await getDoc(cartRef);

            let orderItems = [];
            if (cartSnap.exists()) {
                orderItems = cartSnap.data().items;
            } else {
                alert('Your cart is empty. Please add items to your cart before proceeding.');
                return;
            }

            const orderContainer = document.getElementById('order-container');
            const totalPriceContainer = document.getElementById('total-price-container');

            let totalPrice = 0;

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

            totalPriceContainer.innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;
        } else {
            alert('Please log in to view your cart and orders.');
            window.location.href = '../html/login.html'; // Redirect to login page if not logged in
        }
    });
});

document.getElementById('payment-form').addEventListener('submit', async function (e) {
    e.preventDefault(); 
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

    if (!fullName || !addressLine1 || !state || !city || !zipcode || !paymentOption) {
        alert('Please fill out all the required fields.');
        return;
    }

    const zipcodeRegex = /^[0-9]{6}$/;
    if (!zipcodeRegex.test(zipcode)) {
        alert('Please enter a valid ZIP code with exactly 6 digits.');
        return;
    }

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

    const user = auth.currentUser;
    if (!user) {
        alert('Please log in to view your orders.');
        window.location.href = '../html/login.html'; 
        return;
    }

    const userEmail = user.email.replace('.', '_'); 
    const cartRef = doc(db, 'carts', userEmail);
    const cartSnap = await getDoc(cartRef);

    let cartItems = [];
    if (cartSnap.exists()) {
        cartItems = cartSnap.data().items;
    } else {
        alert('Your cart is empty. Please add items to your cart before proceeding.');
        return;
    }

    const order = {
        date: new Date().toLocaleDateString(),
        status: 'Placed',
        items: cartItems
    };

    const ordersRef = collection(db, 'orders');
    await addDoc(ordersRef, {
        userEmail: userEmail,
        orderDate: order.date,
        status: order.status,
        items: order.items,
    });

    await setDoc(cartRef, { items: [] });

    alert('Thank you for your purchase!');
    window.location.href = '../index.html'; // Redirect to home
});

document.getElementById('payment-option').addEventListener('change', function () {
    const cardDetailsDiv = document.getElementById('card-details');
    if (this.value === 'credit-debit-card') {
        cardDetailsDiv.style.display = 'block'; // Show card details
    } else {
        cardDetailsDiv.style.display = 'none'; // Hide card details
    }
});
