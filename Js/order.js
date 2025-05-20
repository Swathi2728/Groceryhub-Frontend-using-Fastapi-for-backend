let cartItems = []; 
const BASE_URL = 'https://groceryhub-backend-2.onrender.com';


document.addEventListener('DOMContentLoaded', () => {

    
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please log in to view your cart.');
        window.location.href = '../html/login.html'; 
        return;
    }

    async function fetchCartItems() {
        try {
            const response = await fetch(`${BASE_URL}/Cart/getallproducts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();  

            cartItems = data; 
            displayCart(cartItems);
        } catch (error) {
            console.error('Error fetching cart:', error);
            alert('There was an issue fetching your cart. Please try again later.');
        }
    }

   
    function displayCart(cartItems) {
        const orderContainer = document.getElementById('order-container');
        const totalPriceContainer = document.getElementById('total-price-container');
        let totalPrice = 0;

        
        orderContainer.innerHTML = '';

        if (cartItems.length === 0) {
            orderContainer.innerHTML = '<p>Your cart is empty.</p>';
            totalPriceContainer.innerHTML = 'Total Price: ₹0.00';
            return;
        }

        
        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('order-item');

            itemDiv.innerHTML = `
                <div>
                    <h2>${item.product_name}</h2>
                    <p class="weight">Weight: ${item.selected_weight}</p>
                    <p class="price">Price: ₹${item.price_per_unit}</p>
                    <p class="price">Quantity: ${item.quantity_in_cart}</p>
                    <p class="total">Total: ₹${item.quantity_in_cart * item.price_per_unit * parseInt(item.selected_weight)}</p>
                </div>
                <div>
                    <img src="${item.product_image}" alt="${item.product_name}" width="80">
                </div>
            `;
            orderContainer.appendChild(itemDiv);
            totalPrice += item.quantity_in_cart * item.price_per_unit * parseInt(item.selected_weight);
        });

    
        totalPriceContainer.innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;
    }

    
    fetchCartItems();
});


document.getElementById('payment-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before proceeding.');
        return;
    }

    const fullName = document.getElementById('full-name').value.trim();
    const addressLine1 = document.getElementById('address-line1').value.trim();
    const addressLine2 = document.getElementById('address-line2').value.trim();
    const state = document.getElementById('state').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();
    const paymentOption = document.getElementById('payment-option').value;
    const totalPriceContainer = document.getElementById('total-price-container');

 
    if (!fullName || !addressLine1 || !state || !city || !zipcode || !paymentOption) {
        alert('Please fill all required address and payment fields.');
        return;
    }

    if (!/^\d{6}$/.test(zipcode)) {
        alert('ZIP code must be 6 digits.');
        return;
    }

    
    if (paymentOption === 'credit-debit-card') {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!/^\d{15,16}$/.test(cardNumber)) {
            alert('Card number must be 15–16 digits.');
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            alert('Expiry date must be in MM/YY format.');
            return;
        }

        if (!/^\d{3}$/.test(cvv)) {
            alert('CVV must be 3 digits.');
            return;
        }
    }

    const total = parseFloat(totalPriceContainer.innerText.replace(/[^\d.]/g, ''));

    const fullAddress = `${fullName}, ${addressLine1}, ${addressLine2}, ${city}, ${state} - ${zipcode}`;

    const items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity_in_cart,
        weight: item.selected_weight,
        price_per_unit: item.price_per_unit
    }));

    const orderData = {
        address: fullAddress,
        total: total,
        items: items
    };

    try {
        const response = await fetch(`${BASE_URL}/Order/placeorder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Order placed successfully!`);
            window.location.href = "../html/ordersummary.html";
            console.log(result.order_id) 
        } else {
            alert(` Failed to place order: ${result.message || result.detail}`);
        }
    } catch (error) {
        console.error("Order error:", error);
        alert("An unexpected error occurred while placing the order.");
    }
});


document.getElementById('payment-option').addEventListener('change', function () {
    const cardDetailsDiv = document.getElementById('card-details');
    if (this.value === 'credit-debit-card') {
        cardDetailsDiv.style.display = 'block';
    } else {
        cardDetailsDiv.style.display = 'none'; 
    }
});

