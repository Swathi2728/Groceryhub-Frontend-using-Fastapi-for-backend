let cartItems = []; // Global variable for cart items



document.addEventListener('DOMContentLoaded', () => {

    // Get token from local storage
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please log in to view your cart.');
        window.location.href = '../html/login.html'; // Redirect to login page
        return;
    }

    // Fetch user cart data from your backend API
    async function fetchCartItems() {
        try {
            const response = await fetch('http://127.0.0.1:8000/Cart/getallproducts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include token for authentication
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();   // ✅ Don't forget this line

            cartItems = data; // ✅ Store in global variable
            displayCart(cartItems); // Display cart items if fetched successfully
        } catch (error) {
            console.error('Error fetching cart:', error);
            alert('There was an issue fetching your cart. Please try again later.');
        }
    }

    // Display cart items
    function displayCart(cartItems) {
        const orderContainer = document.getElementById('order-container');
        const totalPriceContainer = document.getElementById('total-price-container');
        let totalPrice = 0;

        // Clear existing items before rendering new ones
        orderContainer.innerHTML = '';

        if (cartItems.length === 0) {
            orderContainer.innerHTML = '<p>Your cart is empty.</p>';
            totalPriceContainer.innerHTML = 'Total Price: ₹0.00';
            return;
        }

        // Loop through cart items and display them
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

        // Display the total price
        totalPriceContainer.innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;
    }

    // Call the fetchCartItems function to load cart data when page is ready
    fetchCartItems();
});

// Handle payment form submission
document.getElementById('payment-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Ensure cartItems is populated before proceeding
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

    // Validate basic address fields
    if (!fullName || !addressLine1 || !state || !city || !zipcode || !paymentOption) {
        alert('Please fill all required address and payment fields.');
        return;
    }

    if (!/^\d{6}$/.test(zipcode)) {
        alert('ZIP code must be 6 digits.');
        return;
    }

    // Validate card fields if payment method is card
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

    // Make sure the total price is calculated correctly
    const total = parseFloat(totalPriceContainer.innerText.replace(/[^\d.]/g, ''));

    const fullAddress = `${fullName}, ${addressLine1}, ${addressLine2}, ${city}, ${state} - ${zipcode}`;

    // Prepare items for order
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
        const response = await fetch("http://127.0.0.1:8000/Order/placeorder", {
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
            console.log(result.order_id) // Redirect to success page
        } else {
            alert(` Failed to place order: ${result.message || result.detail}`);
        }
    } catch (error) {
        console.error("Order error:", error);
        alert("An unexpected error occurred while placing the order.");
    }
});

// Handle payment option change (show card details if required)
document.getElementById('payment-option').addEventListener('change', function () {
    const cardDetailsDiv = document.getElementById('card-details');
    if (this.value === 'credit-debit-card') {
        cardDetailsDiv.style.display = 'block'; // Show card details
    } else {
        cardDetailsDiv.style.display = 'none'; // Hide card details
    }
});

