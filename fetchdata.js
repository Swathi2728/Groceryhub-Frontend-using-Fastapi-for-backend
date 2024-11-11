import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase Configuration
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
const db = getFirestore(app);

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
        
        // Categories in the JSON data
        const categories = ['Featured product', 'Newproducts'];

        categories.forEach(category => {
            if (!data[category]) {
                console.warn(`Category ${category} is missing in the data.`);
                return;
            }

            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');

            // Category Title
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            // Loop through each item in the category
            data[category].forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                // Create the HTML structure for displaying item details
                let itemHTML = `<strong>${item.name}</strong><br>`;
                itemHTML += `<img src="${item.img}" alt="${item.name}" style="max-width: 150px; margin-top: 10px;">`;

                if (category === 'Newproducts') {
                    // If it's a New product, display the price and dropdown
                    itemHTML += `Price: <span id="price-${item.name}">${item.price["1kg"]}</span><br>`;  // Default to 1kg price
                    itemHTML += `Weight: <select id="weight-${item.name}">`;

                    // Generate the dropdown options for weights
                    item.kilogram.forEach(weight => {
                        itemHTML += `<option value="${weight}">${weight}</option>`;
                    });

                    itemHTML += `</select>`;
                }

                itemDiv.innerHTML = itemHTML;
                categoryDiv.appendChild(itemDiv);

                // Add event listener to the dropdown to change price based on selected weight
                const weightSelect = itemDiv.querySelector(`#weight-${item.name}`);
                if (weightSelect) {
                    weightSelect.addEventListener('change', (e) => {
                        const selectedWeight = e.target.value;
                        const priceSpan = itemDiv.querySelector(`#price-${item.name}`);
                        if (priceSpan) {
                            // Update the price based on selected weight
                            priceSpan.textContent = item.price[selectedWeight] || 'N/A';
                        }
                    });
                }
            });

            // Append the categoryDiv to the productsDiv on the webpage
            productsDiv.appendChild(categoryDiv);
        });
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}

// Call the function to fetch and display data once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchGroceryData);
