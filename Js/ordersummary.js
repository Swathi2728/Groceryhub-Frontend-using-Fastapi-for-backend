import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


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

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        alert('Please log in to view your orders.');
        window.location.href = '../html/login.html'; 
        return;
    }

    const userEmail = user.email.replace('.', '_'); 
    try {
        
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userEmail', '==', userEmail));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const ordersContainer = document.getElementById('orders-container');
            ordersContainer.innerHTML = '<h3>You have no past orders.</h3>';
            return;
        }

        const ordersContainer = document.getElementById('orders-container');
        
        const ordersArray = Array.from(querySnapshot.docs);

        ordersArray.forEach((doc, index) => {
            const order = doc.data();
            console.log('Order:', order);  
            console.log('Order Index:', index);  

            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order-item');
            
            const orderNumber = index + 1;

            let orderDetailsHTML = `
                <div class="details">
                    <h2>Order Id:${orderNumber}</h2>
                    <div>
                        <p><strong>Order Date:</strong> ${order.orderDate}</p>
                        <p><strong>Status:</strong> <span class="status">${order.status}</span></p>
                    </div>
            `;

            if (order.items && Array.isArray(order.items)) {
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
            } else {
                orderDetailsHTML += `<p>No items found in this order.</p>`;
            }

            orderDetailsHTML += `</div>`; 
            orderDiv.innerHTML = orderDetailsHTML;
            ordersContainer.appendChild(orderDiv);
        });
    } catch (error) {
        console.error('Error fetching orders from Firestore:', error);
        alert('There was an error fetching your orders. Please try again later.');
    }
});
