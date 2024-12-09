import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCo5NR_s6Pbd_ZypP_5tgp2joEHmA7RcT8",
    authDomain: "login-form-9e415.firebaseapp.com",
    projectId: "login-form-9e415",
    storageBucket: "login-form-9e415.appspot.com",
    messagingSenderId: "900436401273",
    appId: "1:900436401273:web:d09d181852913621e048a8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// const auth = getAuth();


// auth.onAuthStateChanged(user => {
//     if (user) {
//         fetchGroceryData()
//         // If user is authenticated, call the fetchVegetables function
//     ;
//     } else {
//       // If user is not authenticated, show a message and redirect to login
//       alert('You must be logged in to view the products.');
//       window.location.href = 'login.html'; // Redirect to login page
//     }
//   });


// Function to generate product HTML
function createProductHTML(item) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const itemDiv1 = document.createElement('div');
    const itemDiv2 = document.createElement('div');
    itemDiv1.classList.add('bname');
    itemDiv2.classList.add('img');

    // HTML for displaying product name and button
    let itemHTML = `<div class="itemname">${item.name}</div>`;

    // Generate dynamic link based on item name (or category)
    let redirectURL = "";
    if (item.name === 'Fruits') {
        redirectURL = "fruits.html"; // Redirect to fruits page
    } else if (item.name=== 'Vegetable') {
        redirectURL = "vegetable.html"; // Redirect to vegetables page
    }else if(item.name=='Dairy'){
        redirectURL = "dairy.html";
    }
    else if(item.name=='Snacks'){
        redirectURL = "snacks.html";
    }
    else {
        redirectURL = "index.html"; // Default product page
    }

    itemHTML += `<button class="shop-now" id="shop-now-${item.name}" onclick="window.location.href='${redirectURL}'">Shop Now</button>`;
    itemDiv1.innerHTML = itemHTML;

    // HTML for displaying product image
    const itemHTML1 = `<div><img src="${item.img}" alt="${item.name}" class="allimg" style="max-width: 150px; margin-top: 10px;"></div>`;
    itemDiv2.innerHTML = itemHTML1;

    // Append name, button and image to itemDiv
    itemDiv.appendChild(itemDiv1);
    itemDiv.appendChild(itemDiv2);

    return itemDiv;
}

// Function to display Featured Products
function displayFeaturedProducts(products, container) {
    const headdiv = document.createElement('div');
    headdiv.classList.add('head');
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = "Featured Products";
    categoryTitle.classList.add('subhead');
    headdiv.appendChild(categoryTitle);

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    headdiv.appendChild(categoryDiv);

    // Create separate containers for fruits/vegetables and others
    const fruitsVegDiv = document.createElement('div');
    fruitsVegDiv.classList.add('fruits-vegetables');

    const othersDiv = document.createElement('div');
    othersDiv.classList.add('others');

    // Manually assigning two products to fruitsVegDiv and two to othersDiv
    const fruitsVegItems = products.slice(0, 2);  // First two products for fruits/vegetables
    const othersItems = products.slice(2, 4);    // Next two products for others

    // Add manually selected items to their respective divs
    fruitsVegItems.forEach(item => {
        fruitsVegDiv.appendChild(createProductHTML(item));
    });

    othersItems.forEach(item => {
        othersDiv.appendChild(createProductHTML(item));
    });

    // Append both category divs to the main categoryDiv
    categoryDiv.appendChild(fruitsVegDiv);
    categoryDiv.appendChild(othersDiv);

    // Append headdiv (which contains the categoryDiv) to the container
    container.appendChild(headdiv);
}

// Function to display New Products
function displayNewProducts(products, container) {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category1');
    const head3 = document.createElement('div');
    head3.classList.add('container3');

    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = "Best sellers";
    categoryTitle.classList.add('head2');
    categoryDiv.appendChild(categoryTitle);

    // Create the main container div to hold all product groups
    let mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container'); // Optional: For styling

    // Loop through the new products and display them
    let productGroup;   // This will hold two product-pair divs

    products.forEach((item, index) => {
        // If index is even (0, 2, 4, ...) create a new wrapper div for the pair
        if (index % 2 === 0) {
            productGroup = document.createElement('div');
            productGroup.classList.add('product-group'); // Optional class for styling
        }

        // Create the item div and div1 (item name container)
        const itemDiv = document.createElement('div');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div'); // Create div1 for image

        itemDiv.classList.add('item1'); // Add class to itemDiv
        div2.classList.add('ihead');
        div1.classList.add('itemname2'); // Add class to div1

        // HTML for displaying each New Product item
        let itemHTML = `<div><img src="${item.img}" alt="${item.name}" style="max-width: 150px; margin-top: 10px;"><br></div>`;
        let itemHTML2 = `<div>${item.name}</div>`;
        itemHTML2 += `Price: <span id="price-${item.name}">${item.price["1kg"]}</span><br>`; // Default to 1kg price

        // Weight dropdown
        itemHTML2 += `Weight: <select id="weight-${item.name}" class="select">`;
        item.kilogram.forEach(weight => {
            itemHTML2 += `<option value="${weight}" >${weight}</option>`;
        });
        itemHTML2 += `</select><br>`;

        itemHTML2 += `<button class="shop-now" id="shop-now-${item.name}"  >Add to cart</button> <br>`;

        // Add the itemHTML to the itemDiv
        div2.innerHTML = itemHTML2;
        div1.innerHTML = itemHTML;

        // Append div1 to itemDiv
        itemDiv.appendChild(div2);
        itemDiv.appendChild(div1); // Now div1 is added after setting the innerHTML

        // Create a product-pair div for this item and append it to the productGroup
        const productPair = document.createElement('div');
        productPair.classList.add('product-pair');
        productPair.appendChild(itemDiv);

        // Append productPair to the productGroup
        productGroup.appendChild(productPair);

        // Add change event listener to the weight dropdown
        const weightSelect = itemDiv.querySelector(`#weight-${item.name}`);
        weightSelect.addEventListener('change', function(event) {
            const selectedWeight = event.target.value;
            const priceSpan = document.getElementById(`price-${item.name}`);
            const selectedPrice = item.price[selectedWeight] || item.price["1kg"]; // Default to 1kg if not found
            priceSpan.textContent = ` ${selectedPrice}`;
        });

        // Attach the event listener to the "Add to cart" button
        const addToCartButton = itemDiv.querySelector(`#shop-now-${item.name}`);
        addToCartButton.addEventListener('click', function() {
            const selectedWeight = weightSelect.value; // Get selected weight
            const selectedPrice = item.price[selectedWeight]; // Get price for selected weight

            console.log('Adding to cart with:', {
                name: item.name,
                price: selectedPrice,
                img: item.img,
                weight: selectedWeight
            });

            // Call addToCart function (make sure it's defined elsewhere)
            addToCart(item.name, selectedPrice, item.img, selectedWeight);
        });

        // If we've processed two items (index 1, 3, 5, ...) or it's the last item, append the productGroup to mainContainer
        if (index % 2 === 1 || index === products.length - 1) {
            mainContainer.appendChild(productGroup);
        }
    });

    // Append the main container to the final container (e.g., categoryDiv)
    container.appendChild(head3);
    head3.appendChild(categoryDiv);
    head3.appendChild(mainContainer);
}

// Make sure to call fetchGroceryData to load the products
document.addEventListener('DOMContentLoaded', fetchGroceryData);
function showAddedMessage() {
    // Show alert message
    alert('Product added to cart!');
    
    // After the alert closes, redirect to the cart page
    window.location.href = 'addtocart.html'; // Redirect to the cart page
}

// Assuming addToCart is defined somewhere, here is an example implementation of addToCart():
// Example addToCart function (using localStorage to store cart)
function addToCart(name, price, img, weight) {
    const user = auth.currentUser; // Get the current authenticated user
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }
  
    const userEmail = user.email.replace('.', '_'); // Use the user's email as the key for localStorage
    const cart = JSON.parse(localStorage.getItem(userEmail)) || []; // Retrieve the user's cart from localStorage (or initialize as empty array)
  
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.name === name && item.weight === weight);
  
    if (existingItem) {
        if (existingItem.quantity < 10) {
            existingItem.quantity += 1; // Increment quantity if item is already in the cart
        } else {
            alert('Maximum quantity of 10 reached for this item And already in cart');
            return;
        }    } else {
        // Add a new item to the cart
        cart.push({
            name: name,
            price: price,
            img: img,
            weight: weight,
            quantity: 1
        });
    }
  
    // Save the updated cart to localStorage under the user's email
    localStorage.setItem(userEmail, JSON.stringify(cart));
  
    // Optionally, show a message or redirect
    alert('Product added to cart!');
    window.location.href = 'addtocart.html'; // Redirect to the cart page
  }



// Fetch and display grocery data from the JSON file
async function fetchGroceryData() {
    const productsDiv = document.getElementById('products');
    if (!productsDiv) {
        console.error("No element with id 'products' found.");
        return;
    }

    try {
        // Fetch the JSON file (adjust the path if needed)
        const response = await fetch('dashboard.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();  // Parse the JSON data

        // Handle Featured Products
        if (data['Featured product']) {
            displayFeaturedProducts(data['Featured product'], productsDiv);
        } else {
            console.warn("Category 'Featured product' is missing in the data.");
        }

        // Handle New Products
        if (data['Newproducts']) {
            displayNewProducts(data['Newproducts'], productsDiv);
        } else {
            console.warn("Category 'Newproducts' is missing in the data.");
        }

    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        document.getElementById('signinButton').style.display = 'none';
    } else {
        // User is logged out
        document.getElementById('signinButton').style.display = 'inline-block';
    }
});