document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('Please log in to view your orders.');
        window.location.href = '../html/login.html';
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/Order/vieworder/history", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch order history");
        }

        const data = await response.json();
        
        console.log("Order history response:", data); // ✅ Log the full response

        const orders = data // ✅ Safe fallback to empty array


        const ordersContainer = document.getElementById('orders-container');

        if (!orders.length) {
            ordersContainer.innerHTML = '<h3>You have no past orders.</h3>';
            return;
        }

        orders.forEach((order, index) => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order-item');

            let orderDetailsHTML = `
                <div class="details">
                    <h2>Order #${index + 1}</h2>
                    <div>
                        <p><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span class="status">${order.status}</span></p>
                    </div>
            `;

            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    orderDetailsHTML += `
                        <div>
                        <img src=${item.product_img}>
                            <h3>${item.product_name || 'Unnamed Product'}</h3>
                            <p>Weight: ${item.weight}</p>
                            <p>Price: ₹${item.price_per_unit}</p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Total: ₹${item.price_per_unit * item.quantity}</p>
                        </div>
                        ${item.img ? `<div><img src="${item.img}" alt="${item.name}"></div>` : ""}
                    `;
                });
            } else {
                orderDetailsHTML += `<p>No items found in this order.</p>`;
            }

            orderDetailsHTML += `</div>`;
            orderDiv.innerHTML = orderDetailsHTML;
            ordersContainer.appendChild(orderDiv);
        });

    } catch (error) {
        console.error("Error fetching orders from API:", error);
        alert("There was an error fetching your orders. Please try again later.");
    }
});
