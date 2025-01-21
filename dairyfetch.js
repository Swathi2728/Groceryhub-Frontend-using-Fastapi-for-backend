import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, collection, getDocs, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


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

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

let allDairyProducts = []; // To store all the products

// Fetch and display dairy products
async function fetchDairyProducts() {
  const dairyRef = collection(db, 'dairyProducts'); // Firestore reference for dairy products
  const snapshot = await getDocs(dairyRef); // Get documents in the 'dairyProducts' collection
  allDairyProducts = snapshot.docs.map(doc => doc.data()); // Map documents to data

  displayDairyProducts(allDairyProducts); // Call the function to display dairy products
}

// Display dairy products with weight selection, dynamic price change, and Add to Cart button
function displayDairyProducts(dairyProducts) {
  const container = document.getElementById('dairy-products-container');
  container.innerHTML = ''; // Clear previous results

  dairyProducts.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product-card');

    // Add product image
    const img = document.createElement('img');
    img.src = product.img;
    img.alt = product.name;
    img.style.height = '200px';
    img.style.width = '200px';
    img.style.borderRadius = '5px';
    productElement.appendChild(img);

    // Add product name
    const name = document.createElement('h2');
    name.innerText = product.name;
    productElement.appendChild(name);

    // Price display (initial price will be based on the first weight option)
    const priceDisplay = document.createElement('p');
    priceDisplay.classList.add('price');
    priceDisplay.innerText = 'Price: ₹' + product.price[product.kilogram[0]]; // Default to first weight option
    productElement.appendChild(priceDisplay);

    // Create dropdown for weight options
    const weightSelect = document.createElement('select');
    weightSelect.classList.add('weight-select');
    product.kilogram.forEach(weight => {
      const option = document.createElement('option');
      option.value = weight;
      option.innerText = weight;
      weightSelect.appendChild(option);
    });

    productElement.appendChild(weightSelect);
    const lineBreak = document.createElement('br'); // Create <br> tag
    productElement.appendChild(lineBreak);

    // Update the price when weight is changed
    weightSelect.addEventListener('change', function () {
      const selectedWeight = weightSelect.value;
      const selectedPrice = product.price[selectedWeight];
      priceDisplay.innerText = 'Price: ₹' + selectedPrice; // Update price
    });

    // Create Add to Cart button
    const addToCartButton = document.createElement('button');
    addToCartButton.innerText = 'Add to Cart';
    addToCartButton.classList.add('add-to-cart')
    productElement.appendChild(addToCartButton);

    // Handle Add to Cart button click
    addToCartButton.addEventListener('click', function () {
      const selectedWeight = weightSelect.value; // Get selected weight
      const selectedPrice = product.price[selectedWeight]; // Get price for selected weight

      // Log or perform action to add item to cart
      console.log('Added to cart:', {
        name: product.name,
        price: selectedPrice,
        weight: selectedWeight,
        img: product.img
      });

      addToCart(product.name, selectedPrice, product.img, selectedWeight);
    });

    // Append product element to the container
    container.appendChild(productElement);
  });
}

// Example addToCart function (using localStorage to store cart)
// Add item to cart using Firestore
async function addToCart(name, price, img, weight) {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }

    const userEmail = user.email.replace('.', '_'); // Use the user's email as the document ID in Firestore
    const cartRef = doc(db, 'carts', userEmail); // Reference to the user's cart document in Firestore

    // Fetch the user's current cart from Firestore
    const cartDoc = await getDoc(cartRef);
    let cart = cartDoc.exists() ? cartDoc.data().items : []; // Retrieve cart items or initialize as an empty array

    const existingItem = cart.find(item => item.name === name && item.weight === weight);

    if (existingItem) {
        if (existingItem.quantity < 10) {
            existingItem.quantity += 1; // Increment quantity if item is already in the cart
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

    // Update the cart in Firestore
    await setDoc(cartRef, { items: cart });

    alert('Product added to cart!');
    window.location.href = 'addtocart.html'; // Redirect to cart page
}

// Handle search functionality
document.getElementById('search-bar').addEventListener('input', function (e) {
  const searchQuery = e.target.value.toLowerCase();
  const filteredProducts = allDairyProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery) || 
    product.kilogram.some(weight => weight.toString().includes(searchQuery)) || 
    Object.values(product.price).some(price => price.toString().includes(searchQuery))
  );

  // Display products or show an alert if no matches
  if (filteredProducts.length === 0) {
    alert('No matches found'); // Show alert if no products match the search
  } else {
    displayDairyProducts(filteredProducts); // Re-display products based on search query
  }
});

// Call the function to fetch and display dairy products
fetchDairyProducts();
onAuthStateChanged(auth, (user) => {
  if (user) {
      // User is logged in
      document.getElementById('signinButton').style.display = 'none';
  } else {
      // User is logged out
      document.getElementById('signinButton').style.display = 'inline-block';
  }
});
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        document.getElementById('signinButton').style.display = 'none';
        document.getElementById('profileButton').style.display = 'inline-block';


    } else {
        // User is logged out
        document.getElementById('signinButton').style.display = 'inline-block';
        document.getElementById('profileButton').style.display = 'none';

    }
});