let cart = []; 
const BASE_URL = 'https://groceryhub-backend-2.onrender.com';
 
async function loadCart() {
    
    const token = localStorage.getItem('authToken');
    console.log('Token in loadCart:', token); 

    
    if (!token) {
        console.warn("No auth token found in localStorage.");
        displayCart([]);
        alert("please log in to view cart") 
        return;
    }

   
    try {
        console.log('Fetching cart...');
        const response = await fetch(`${BASE_URL}/Cart/getallproducts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  
            },
        });

       
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }

      
        const data = await response.json();
        console.log('Cart Data:', data); 

        
        cart = data;
        displayCart(cart);
    } catch (error) {
        console.error("Error loading cart:", error);
        cart = [];  
        displayCart(cart);
    }
}


async function displayCart(cart) {
    console.log("Displaying cart:", cart);

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
        itemDiv.setAttribute('data-product-id', item.product_id);      


      
        itemDiv.setAttribute('data-cart-id', item.cart_id);
        let total1=item.price_per_unit/1000

        itemDiv.innerHTML = `
            <div class="new">
                <h2>${item.product_name}</h2>
                <p class="weight">Weight: ${item.selected_weight}</p>
                <p class="price">Price: ₹${ item.price_per_unit.toFixed(2)}</p>
                <p class="price">Quantity: 
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity_in_cart}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </p>
                <p class="total">Total: ₹${item.quantity_in_cart * total1* parseInt(item.selected_weight)}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
            <div>
                <img src="${item.product_image}" alt="${item.product_name}">
            </div>
        `;
        cartContainer.appendChild(itemDiv);
        totalPrice += item.quantity_in_cart * total1* parseInt(item.selected_weight);
    });

    document.getElementById('cart-total').innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;

    attachEventListeners(); 
}

async function updateQuantity(cartId, action) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.warn("No token found for updating quantity.");
        return;
    }

    console.log("Cart ID being sent:", cartId);
    console.log("Action being sent:", action);

    try {
        const response = await fetch(`${BASE_URL}/Cart/cart/updatequantity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                cart_id: cartId,  
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



async function removeFromCart(productId) {
    const token = localStorage.getItem('authToken'); 

    if (!token) {
        console.warn("No token found for removal.");
        return;
    }

    if (!productId) {
        console.error("Invalid cart item or missing product_id.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/Cart/deleteproducts?product_id=${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to remove item from cart.");
            return;
        }

       
        cart = cart.filter(item => item.product_id !== productId);

       
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

    decreaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartId = e.target.closest('.cart-item').getAttribute('data-cart-id');  // Correct cart ID
            updateQuantity(cartId, 'decrease');
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartId = e.target.closest('.cart-item').getAttribute('data-cart-id');  // Correct cart ID
            updateQuantity(cartId, 'increase');
        });
    });

    
removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
       
        const productId = e.target.closest('.cart-item').getAttribute('data-product-id');
        
       
        removeFromCart(productId);
    });
});

}
document.querySelector('.checkout-btn').addEventListener('click', () => {
    window.location.href = '../html/ordersummary.html';  
});


window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    if (token) {
        loadCart(); 
    }
});
