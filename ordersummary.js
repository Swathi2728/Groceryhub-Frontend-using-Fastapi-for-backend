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

// Use `onAuthStateChanged` to check if user is logged in
auth.onAuthStateChanged((user) => {
    if (!user) {
        alert('Please log in to view your orders.');
        window.location.href = 'login.html'; // Redirect if not logged in
        return;
    }

    // Get the user's email to fetch their order history
    const userEmail = user.email.replace('.', '_'); // Convert email to a usable key

    // Fetch the user's order history from localStorage
    const userOrders = JSON.parse(localStorage.getItem(userEmail + '_orders')) || [];

    const ordersContainer = document.getElementById('orders-container');

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<p>You have no past orders.</p>';
        return;
    }

    // Loop through each order and display its details
    userOrders.forEach((order, orderIndex) => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-item');

        let orderDetailsHTML = `
            <div class="details">
                <h2>Order #${orderIndex + 1}</h2>
                <p><strong>Order Date:</strong> ${order.date}</p>
                <p><strong>Status:</strong> ${order.status}</p>
        `;

        // Display each item in this particular order
        order.items.forEach(item => {
            orderDetailsHTML += `
                <div>
                    <h3>${item.name}</h3>
                    <p>Weight: ${item.weight}</p>
                    <p>Price: ₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total: ₹${item.price * item.quantity}</p>
                </div>
                <div>
                    <img src="${item.img}" alt="${item.name}">
                </div>
            `;
        });

        orderDetailsHTML += `</div>`;

        orderDiv.innerHTML = orderDetailsHTML;
        ordersContainer.appendChild(orderDiv);
    });
});
