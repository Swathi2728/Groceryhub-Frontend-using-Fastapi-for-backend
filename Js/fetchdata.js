import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
 import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
 import { getFirestore, doc, collection, getDocs, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
 
 
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
 const auth = getAuth(app); 
 
 
 function createProductHTML(item) {
     const itemDiv = document.createElement('div');
     itemDiv.classList.add('item');
 
     const itemDiv1 = document.createElement('div');
     const itemDiv2 = document.createElement('div');
     itemDiv1.classList.add('bname');
     itemDiv2.classList.add('img');
 
     let itemHTML = `<div class="itemname">${item.name}</div>`;
 
     let redirectURL = "";
     if (item.name === 'Fruits') {
         redirectURL = "html/fruits.html"; // Redirect to fruits page
     } else if (item.name=== 'Vegetable') {
         redirectURL = "html/vegetable.html"; // Redirect to vegetables page
     }else if(item.name=='Dairy'){
         redirectURL = "html/dairy.html";
     }
     else if(item.name=='Snacks'){
         redirectURL = "html/snacks.html";
     }
     else {
         redirectURL = "index.html"; // Default product page
     }
 
     itemHTML += `<button class="shop-now" id="shop-now-${item.name}" onclick="window.location.href='${redirectURL}'">Shop Now</button>`;
     itemDiv1.innerHTML = itemHTML;
 
     const itemHTML1 = `<div><img src="${item.img}" alt="${item.name}" class="allimg" style="max-width: 150px; margin-top: 10px;"></div>`;
     itemDiv2.innerHTML = itemHTML1;
 
     itemDiv.appendChild(itemDiv1);
     itemDiv.appendChild(itemDiv2);
 
     return itemDiv;
 }
 
 function displayFeaturedProducts(products, container) {
     const headdiv = document.createElement('div');
     headdiv.classList.add('head');
     const categoryTitle = document.createElement('h2');
     categoryTitle.textContent = "Explore Our Categories";
     categoryTitle.classList.add('subhead');
     headdiv.appendChild(categoryTitle);
 
     const categoryDiv = document.createElement('div');
     categoryDiv.classList.add('category');
     headdiv.appendChild(categoryDiv);
 
     const fruitsVegDiv = document.createElement('div');
     fruitsVegDiv.classList.add('fruits-vegetables');
 
     const othersDiv = document.createElement('div');
     othersDiv.classList.add('others');
 
     const fruitsVegItems = products.slice(0, 2); 
     const othersItems = products.slice(2, 4);   
 
     fruitsVegItems.forEach(item => {
         fruitsVegDiv.appendChild(createProductHTML(item));
     });
 
     othersItems.forEach(item => {
         othersDiv.appendChild(createProductHTML(item));
     });
 
     categoryDiv.appendChild(fruitsVegDiv);
     categoryDiv.appendChild(othersDiv);
 
     container.appendChild(headdiv);
 }
 
 function displayNewProducts(products, container) {
     const categoryDiv = document.createElement('div');
     categoryDiv.classList.add('category1');
     const head3 = document.createElement('div');
     head3.classList.add('container3');
 
     const categoryTitle = document.createElement('h2');
     categoryTitle.textContent = "Best Sellers";
     categoryTitle.classList.add('head2');
     categoryDiv.appendChild(categoryTitle);
 
     let mainContainer = document.createElement('div');
     mainContainer.classList.add('main-container'); // Optional: For styling
 
     let productGroup; 
 
     products.forEach((item, index) => {
         if (index % 2 === 0) {
             productGroup = document.createElement('div');
             productGroup.classList.add('product-group');
         }
 
         const itemDiv = document.createElement('div');
         const div1 = document.createElement('div');
         const div2 = document.createElement('div'); 
 
         itemDiv.classList.add('item1'); // Add class to itemDiv
         div2.classList.add('ihead');
         div1.classList.add('itemname2'); // Add class to div1
 
         let itemHTML = `<div><img src="${item.img}" alt="${item.name}" style="max-width: 150px; margin-top: 10px;"><br></div>`;
         let itemHTML2 = `<div>${item.name}</div>`;
         itemHTML2 += `Price:₹<span id="price-${item.name}">${item.price["1kg"]}</span><br>`; 
         itemHTML2 += `Weight: <select id="weight-${item.name}" class="select">`;
         item.kilogram.forEach(weight => {
             itemHTML2 += `<option value="${weight}" >${weight}</option>`;
         });
         itemHTML2 += `</select><br>`;
 
         itemHTML2 += `<button class="shop-now" id="shop-now-${item.name}"  >Add to cart</button> <br>`;
 
         div2.innerHTML = itemHTML2;
         div1.innerHTML = itemHTML;
 
         itemDiv.appendChild(div2);
         itemDiv.appendChild(div1); 
         const productPair = document.createElement('div');
         productPair.classList.add('product-pair');
         productPair.appendChild(itemDiv);
 
         productGroup.appendChild(productPair);
 
         const weightSelect = itemDiv.querySelector(`#weight-${item.name}`);
         weightSelect.addEventListener('change', function(event) {
             const selectedWeight = event.target.value;
             const priceSpan = document.getElementById(`price-${item.name}`);
             const selectedPrice = item.price[selectedWeight] || item.price["1kg"]; // Default to 1kg if not found
             priceSpan.textContent = ` ${selectedPrice}`;
         });
 
         const addToCartButton = itemDiv.querySelector(`#shop-now-${item.name}`);
         addToCartButton.addEventListener('click', function() {
             const selectedWeight = weightSelect.value; 
             const selectedPrice = item.price[selectedWeight]; // Get price for selected weight
 
             console.log('Adding to cart with:', {
                 name: item.name,
                 price: selectedPrice,
                 img: item.img,
                 weight: selectedWeight
             });
 
             addToCart(item.name, selectedPrice, item.img, selectedWeight);
         });
 
         if (index % 2 === 1 || index === products.length - 1) {
             mainContainer.appendChild(productGroup);
         }
     });
 
     container.appendChild(head3);
     head3.appendChild(categoryDiv);
     head3.appendChild(mainContainer);
 }
 
 document.addEventListener('DOMContentLoaded', fetchGroceryData);

 

 async function addToCart(name, price, img, weight) {
     const user = auth.currentUser; 
     if (!user) {
         alert('Please log in to add items to your cart.');
         return;
     }
 
     const userEmail = user.email.replace('.', '_'); 
     const cartRef = doc(db, 'carts', userEmail); 
 
     const cartDoc = await getDoc(cartRef);
     let cart = cartDoc.exists() ? cartDoc.data().items : []; 
 
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
 
     // Update the cart in Firestore
     await setDoc(cartRef, { items: cart });
 
     alert('Product added to cart!');
     window.location.href = 'html/addtocart.html'; // Redirect to cart page
 }
 
 
 
 async function fetchGroceryData() {
     const productsDiv = document.getElementById('products');
     if (!productsDiv) {
         console.error("No element with id 'products' found.");
         return;
     }
 
     try {
         const response = await fetch('Json/dashboard.json');
         if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
         }
 
         const data = await response.json();  // Parse the JSON data
 
         if (data['Featured product']) {
             displayFeaturedProducts(data['Featured product'], productsDiv);
         } else {
             console.warn("Category 'Featured product' is missing in the data.");
         }
 
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
         document.getElementById('profileButton').style.display = 'inline-block';
 
 
     } else {
         // User is logged out
         document.getElementById('signinButton').style.display = 'inline-block';
         document.getElementById('profileButton').style.display = 'none';
 
     }
 });