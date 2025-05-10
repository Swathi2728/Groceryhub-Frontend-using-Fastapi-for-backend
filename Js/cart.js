let cart = [];  // Global cart variable

// Function to load the cart data
async function loadCart() {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    console.log('Token in loadCart:', token); // Debug log to confirm token

    // If no token exists, show an empty cart and return early
    if (!token) {
        console.warn("No auth token found in localStorage.");
        displayCart([]);
        alert("please log in to view cart")  // Show empty cart
        return;
    }

    // If token exists, try to fetch cart data from backend
    try {
        console.log('Fetching cart...');
        const response = await fetch('http://127.0.0.1:8000/Cart/getallproducts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send token in Authorization header
            },
        });

        // Check if the response is ok (status 200)
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }

        // Parse the JSON response data
        const data = await response.json();
        console.log('Cart Data:', data); // Debug log to confirm the cart data

        // Update the cart array with the received data
        cart = data;  // Store cart items globally
        displayCart(cart);  // Display cart after data is fetched
    } catch (error) {
        console.error("Error loading cart:", error); // Log any errors
        cart = [];  // Reset cart
        displayCart(cart);  // Show empty cart in case of an error
    }
}

// Function to display the cart items in the DOM
async function displayCart(cart) {
    console.log("Displaying cart:", cart); // Debug log to confirm cart data

    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    // Check if cart container exists in the DOM
    if (!cartContainer) {
        console.error("No element with id 'cart-container' found.");
        return;
    }

    // Clear any existing content in the cart container
    cartContainer.innerHTML = '';

    // If the cart is empty, display a message and set the total price to 0
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        document.getElementById('cart-total').innerHTML = 'Total Price: ₹0.00';
        return;
    }

    // Hide the empty cart message and calculate the total price
    emptyCartMessage.style.display = 'none';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.setAttribute('data-product-id', item.product_id);      


      
        itemDiv.setAttribute('data-cart-id', item.cart_id);

        itemDiv.innerHTML = `
            <div class="new">
                <h2>${item.product_name}</h2>
                <p class="weight">Weight: ${item.selected_weight}</p>
                <p class="price">Price: ₹${item.price_per_unit}</p>
                <p class="price">Quantity: 
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity_in_cart}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </p>
                <p class="total">Total: ₹${item.quantity_in_cart * item.price_per_unit * parseInt(item.selected_weight)}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
            <div>
                <img src="${item.product_image}" alt="${item.product_name}">
            </div>
        `;
        cartContainer.appendChild(itemDiv);
        totalPrice += item.quantity_in_cart * item.price_per_unit * parseInt(item.selected_weight);
    });

    // Update the total price at the bottom
    document.getElementById('cart-total').innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;

    // Attach event listeners for quantity and remove buttons
    attachEventListeners(); 
}

// Function to attach event listeners to quantity buttons (increase/decrease) and remove buttons
async function updateQuantity(cartId, action) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.warn("No token found for updating quantity.");
        return;
    }

    // Debug log
    console.log("Cart ID being sent:", cartId);
    console.log("Action being sent:", action);

    try {
        const response = await fetch('http://127.0.0.1:8000/Cart/cart/updatequantity', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                cart_id: cartId,  // ✅ Ensure this is not undefined
                action: action
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Update failed:", error.detail);
            return;
        }

        const result = await response.json();
        console.log("Quantity updated:", result);

        loadCart();

    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}


// Function to remove an item from the cart
async function removeFromCart(productId) {
    const token = localStorage.getItem('authToken');  // Get token from localStorage

    if (!token) {
        console.warn("No token found for removal.");
        return;
    }

    if (!productId) {
        console.error("Invalid cart item or missing product_id.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/Cart/deleteproducts?product_id=${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to remove item from cart.");
            return;
        }

        // Filter the item out from the cart array
        cart = cart.filter(item => item.product_id !== productId);  // Remove the item from the array

        // Re-render the cart with updated data
        displayCart(cart);
    } catch (error) {
        console.error("Error during cart item removal:", error);
    }
}


//


function attachEventListeners() {
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove-btn');

    // Decrease quantity button
    decreaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartId = e.target.closest('.cart-item').getAttribute('data-cart-id');  // Correct cart ID
            updateQuantity(cartId, 'decrease');
        });
    });

    // Increase quantity button
    increaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartId = e.target.closest('.cart-item').getAttribute('data-cart-id');  // Correct cart ID
            updateQuantity(cartId, 'increase');
        });
    });

    // Remove item from cart
   // Attach event listeners to the remove buttons
removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Get the product_id from the data attribute of the closest cart-item
        const productId = e.target.closest('.cart-item').getAttribute('data-product-id');
        
        // Call the removeFromCart function with the productId
        removeFromCart(productId);
    });
});

}
document.querySelector('.checkout-btn').addEventListener('click', () => {
    window.location.href = '../html/ordersummary.html';  // Adjust path if needed
});


window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    if (token) {
        loadCart(); // If token exists, try loading the cart
    }
});
