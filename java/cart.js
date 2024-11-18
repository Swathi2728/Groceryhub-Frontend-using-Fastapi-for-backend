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
            <img src="${item.img}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>Weight: ${item.weight}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <p class="total">Total: ${item.price * item.quantity}</p>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        // Add the item to the cart container
        cartContainer.appendChild(cartItem);

        // Update the total price
        totalPrice += item.price * item.quantity;

        // Add event listener to the remove button
        const removeButton = cartItem.querySelector('.remove-btn');
        removeButton.addEventListener('click', () => {
            removeItemFromCart(index);
        });
    });

    // Display the total price
    cartTotal.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
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