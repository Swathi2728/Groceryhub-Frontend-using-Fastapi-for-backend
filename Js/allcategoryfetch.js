import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, collection, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


const firebaseConfig = {   apiKey: "AIzaSyCo5NR_s6Pbd_ZypP_5tgp2joEHmA7RcT8",
    authDomain: "login-form-9e415.firebaseapp.com",
    projectId: "login-form-9e415",
    storageBucket: "login-form-9e415.appspot.com",
    messagingSenderId: "900436401273",
    appId: "1:900436401273:web:d09d181852913621e048a8" };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let vegetables = [];
let fruits = [];
let allDairyProducts = [];
let allSnacks = [];



async function fetchAndDisplayProducts(collectionName, containerId) {
    const productRef = collection(db, collectionName);
    const snapshot = await getDocs(productRef);
    const products = snapshot.docs.map(doc => doc.data());
    displayProducts(products, containerId);
    return products; 
}

function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container element not found:", containerId);
        return;
    }
    container.innerHTML = ''; // Clear any existing content

    // Loop through the products and create sets of 4 products
    for (let i = 0; i < products.length; i += 4) {
        // Create a parent div to hold 4 product cards
        const parentDiv = document.createElement('div');
        parentDiv.classList.add('product-row'); // Style for the row of products
        
        // Loop through 4 products (or the remaining products if less than 4)
        for (let j = i; j < i + 4 && j < products.length; j++) {
            const product = products[j];
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');

            const img = document.createElement('img');
            img.src = product.img;
            img.alt = product.name;
            img.style.height = '200px';
            img.style.width = '200px';
            img.style.borderRadius = '5px';
            productElement.appendChild(img);

            const name = document.createElement('h2');
            name.innerText = product.name;
            productElement.appendChild(name);

            const priceDisplay = document.createElement('p');
            priceDisplay.classList.add('price');
            productElement.appendChild(priceDisplay);

            if (product.kilogram && Array.isArray(product.kilogram) && product.kilogram.length > 0) {
                priceDisplay.innerText = 'Price: ₹' + product.price[product.kilogram[0]];
                const weightSelect = document.createElement('select');
                weightSelect.classList.add('weight-select');
                product.kilogram.forEach(weight => {
                    const option = document.createElement('option');
                    option.value = weight;
                    option.innerText = weight;
                    weightSelect.appendChild(option);
                });
                productElement.appendChild(weightSelect);
                const lineBreak = document.createElement('br');
                productElement.appendChild(lineBreak);

                weightSelect.addEventListener('change', function () {
                    const selectedWeight = weightSelect.value;
                    const selectedPrice = product.price[selectedWeight];
                    priceDisplay.innerText = 'Price: ₹' + selectedPrice;
                });

                const addToCartButton = document.createElement('button');
                addToCartButton.innerText = 'Add to Cart';
                addToCartButton.classList.add('add-to-cart');
                productElement.appendChild(addToCartButton);

                addToCartButton.addEventListener('click', function () {
                    const selectedWeight = weightSelect.value;
                    const selectedPrice = product.price[selectedWeight];
                    addToCart(product.name, selectedPrice, product.img, selectedWeight);
                });
            } else {
                priceDisplay.innerText = 'Price: ₹0';
                const addToCartButton = document.createElement('button');
                addToCartButton.innerText = 'Out of stock';
                addToCartButton.disabled = true;
                productElement.appendChild(addToCartButton);
            }

            // Append the product card to the parent div
            parentDiv.appendChild(productElement);
        }

        // Append the parent div (with 4 product cards) to the main container
        container.appendChild(parentDiv);
    }
}


async function addToCart(name, price, img, weight) {
    const user = auth.currentUser; 
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }

    const userEmail = user.email.replace('.', '_');
    const cartRef = doc(db, 'carts', userEmail);

    try {

        const cartDoc = await getDoc(cartRef);
        let cart = cartDoc.exists() ? cartDoc.data().items : []; 
 
        
     
        console.log("Current cart items:", cart);

        const existingItem = cart.find(item => item.name === name && item.weight === weight);

        if (existingItem) {
            if (existingItem.quantity < 10) {
                existingItem.quantity += 1; 
            } else {
                alert('Maximum quantity of 10 reached for this item');
                return;
            }
        } else {
            cart.push({
                name: name,
                price: price,
                img: img,
                weight: weight,
                quantity: 1
            });
        }

        
        await setDoc(cartRef, { items: cart });

        alert('Product added to cart!');
     
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}



onAuthStateChanged(auth, (user) => {
    const signinButton = document.getElementById('signinButton');
    const profileButton = document.getElementById('profileButton');
    if (user) {
        signinButton.style.display = 'none';
        profileButton.style.display = 'inline-block';
    } else {
        signinButton.style.display = 'inline-block';
        profileButton.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch all the product data as before
    fetchAndDisplayProducts('vegetables', 'vegetables-container').then(products => vegetables = products).catch(error => console.error("Error fetching vegetables:", error));
    fetchAndDisplayProducts('fruits', 'fruits-container').then(products => fruits = products).catch(error => console.error("Error fetching fruits:", error));
    fetchAndDisplayProducts('dairyProducts', 'dairy-products-container').then(products => allDairyProducts = products).catch(error => console.error("Error fetching dairy:", error));
    fetchAndDisplayProducts('snacks', 'snacks-container').then(products => allSnacks = products).catch(error => console.error("Error fetching snacks:", error));

    // Search listener (without debounce)
    document.getElementById('search-bar').addEventListener('input', function (event) {
        const searchTerm = event.target.value;
        
        // Combine all products into one list
        const allProducts = [...vegetables, ...fruits, ...allDairyProducts, ...allSnacks];

        // Filter products based on the search term
        const allFilteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        });

        // If no matches found, show an alert
        if (allFilteredProducts.length === 0) {
            alert("No matches found.");
        } else {
            // Separate the filtered results into categories again
            const filteredVegetables = allFilteredProducts.filter(product => vegetables.includes(product));
            const filteredFruits = allFilteredProducts.filter(product => fruits.includes(product));
            const filteredDairy = allFilteredProducts.filter(product => allDairyProducts.includes(product));
            const filteredSnacks = allFilteredProducts.filter(product => allSnacks.includes(product));

            // Display filtered products in their respective categories
            displayProducts(filteredVegetables, 'vegetables-container');
            displayProducts(filteredFruits, 'fruits-container');
            displayProducts(filteredDairy, 'dairy-products-container');
            displayProducts(filteredSnacks, 'snacks-container');
        }
    });
});
