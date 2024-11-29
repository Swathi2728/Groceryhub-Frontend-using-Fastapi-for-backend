// Function to display items in the cart
function displayCartItems() {
    const cartContainer = document.getElementById('cart-container');
    const cartTotal = document.getElementById('cart-total');

    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // If the cart is empty, display a message
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty!</p>';
        cartTotal.innerHTML = '';
        return;
    }

    // Clear the current cart container
    cartContainer.innerHTML = '';

    let totalPrice = 0;

    // Loop through each item in the cart and display it
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        // Item details
        cartItem.innerHTML = `
            <div>
                <h2>${item.name}</h2>
                <p class="weight">Weight: ${item.weight}</p>
                <p class="price">Price: ₹${item.price}</p>
                <p class="price">Quantity: 
                    <button class="quantity-btn decrease" data-index="${index}" id="btn" >-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}" id="btn"   >+</button>
                </p>
                <p class="total">Total: ₹${item.price * item.quantity}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
            <div>
                <img src="${item.img}" alt="${item.name}">
            </div>
        `;

        // Add the item to the cart container
        cartContainer.appendChild(cartItem);

        // Update the total price
        totalPrice += item.price * item.quantity;

        // Add event listeners for increasing and decreasing quantity
        const increaseButton = cartItem.querySelector('.increase');
        const decreaseButton = cartItem.querySelector('.decrease');
        
        increaseButton.addEventListener('click', () => {
            updateQuantity(index, item.quantity + 1); // Increase the quantity
        });
        
        decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) { // Ensure quantity doesn't go below 1
                updateQuantity(index, item.quantity - 1); // Decrease the quantity
            }
        });

        // Add event listener to the remove button
        const removeButton = cartItem.querySelector('.remove-btn');
        removeButton.addEventListener('click', () => {
            removeItemFromCart(index);
        });
    });

    // Display the total price
    cartTotal.textContent = `Total Price: ₹${totalPrice.toFixed(2)}`;
}

// Function to update the quantity of an item in the cart
function updateQuantity(index, newQuantity) {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update the quantity of the item
    cart[index].quantity = newQuantity;

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-display the cart after updating the quantity
    displayCartItems();
}

// Function to remove an item from the cart
function removeItemFromCart(index) {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the item from the cart array
    cart.splice(index, 1);

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-display the cart after removal
    displayCartItems();
}

// Call the displayCartItems function when the page loads
document.addEventListener('DOMContentLoaded', displayCartItems);
