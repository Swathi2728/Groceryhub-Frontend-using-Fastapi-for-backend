function displayCartItems() {
    // Get the cart from localStorage or initialize an empty array if no cart is found
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartContainer = document.getElementById('cart-container'); // Get the container where cart items will go
    cartContainer.innerHTML = ''; // Clear any existing items

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
            <div><img src="${item.img}" alt="${item.name}" style="width: 100px;"></div>
            <div><strong>${item.name}</strong><br>${item.weight}</div>
            <div>Price: ${item.price}</div>
            <div class="total">Total: ${item.price }</div>
        `;
        
        totalPrice += item.price ;

        cartContainer.appendChild(cartItemDiv);
    });

    // Display the total price of the cart
    const cartTotalDiv = document.getElementById('cart-total');
    cartTotalDiv.innerHTML = `Total Price: ${totalPrice}`;
}

// Call the displayCartItems function when the page is fully loaded
document.addEventListener('DOMContentLoaded', displayCartItems);
