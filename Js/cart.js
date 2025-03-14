import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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
const db = getFirestore(app);
let cart = [];

async function loadCart(userEmail) {
    const cartDocRef = doc(db, 'carts', userEmail);
    const cartDoc = await getDoc(cartDocRef);
    if (cartDoc.exists()) {
        cart = cartDoc.data().items || [];
    } else {
        cart = [];
    }
    displayCart(cart);
}

async function displayCart(cart) {
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (!cartContainer) {
        console.error("No element with id 'cart-container' found.");
        return;
    }

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        document.getElementById('cart-total').innerHTML = 'Total Price: ₹0.00';
        return;
    }

    emptyCartMessage.style.display = 'none';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
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
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('cart-total').innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;
    
    attachEventListeners(); 
}


function attachEventListeners() {
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove-btn');

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


async function removeFromCart(index) {
    cart.splice(index, 1);

    const userEmail = auth.currentUser.email.replace('.', '_');
    await updateCartInFirestore(userEmail);
    displayCart(cart); 
}

async function updateQuantity(index, action) {
    const item = cart[index];
    
    if (action === 'increase') {
        if (item.quantity < 10) {
            item.quantity += 1; 
        } else {
            alert('Maximum quantity of 10 reached for this item.');
            return;
        }
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
    }

    const userEmail = auth.currentUser.email.replace('.', '_');
    await updateCartInFirestore(userEmail);
    displayCart(cart);
}

   

async function updateCartInFirestore(userEmail) {
    const cartDocRef = doc(db, 'carts', userEmail);
    await setDoc(cartDocRef, { items: cart });
}

function logout() {
    const user = auth.currentUser;
    if (user) {
        const userEmail = user.email.replace('.', '_');
        const cartDocRef = doc(db, 'carts', userEmail);
        setDoc(cartDocRef, { items: [] });
        signOut(auth).then(() => {
            alert('Logged out successfully!');
            window.location.href = '../html/login.html';
        }).catch(error => {
            console.error('Logout error: ', error);
        });
    }
}

async function checkout() {
    const user = auth.currentUser;
    if (!user) {
        alert('Please log in to proceed with checkout.');
        window.location.href = '../html/login.html';
        return;
    }

    const userEmail = user.email.replace('.', '_');

    const cartDocRef = doc(db, 'carts', userEmail);
    const cartDoc = await getDoc(cartDocRef);
    const cart = cartDoc.exists() ? cartDoc.data().items : [];

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    localStorage.setItem('orderItems', JSON.stringify(cart));


    window.location.href = '../html/order.html';
}

const checkoutButton = document.querySelector('.checkout-btn');
if (checkoutButton) {
    checkoutButton.addEventListener('click', checkout);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userEmail = user.email.replace('.', '_');
        loadCart(userEmail); 
    } else {
        displayCart([]);
    }
    console.log('Auth state changed:', user);
});
