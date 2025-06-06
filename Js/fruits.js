let category = '';
const BASE_URL = 'https://groceryhub-backend-2.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
   
    category =  'Fruits'; 

    fetchAndDisplayProducts('', category); 
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function (event) {
            const searchQuery = event.target.value;

           
            if (searchQuery.trim() === '') {
                console.log(fetchAndDisplayProducts('', category));
                
            } else {
                fetchAndDisplayProducts(searchQuery, category);
            }
        });
    }
});



let latestRequestId = 0; 

async function fetchAndDisplayProducts(query = '', category = '') {
    const currentRequestId = ++latestRequestId; 
    try {
        let url = `${BASE_URL}/products/get/${category}`;
        if (query.trim() !== '') {
            url = `${BASE_URL}/products/search?name=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
        }

        console.log("Fetching:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        console.log(response)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        console.log(products)


        
        if (currentRequestId === latestRequestId) {
            console.log('Products received:', products);
            displayProducts(products, 'products-container');
        } else {
            console.log('Outdated response ignored');
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container element not found:", containerId);
        return;
    }

    container.innerHTML = ''; 

    if (!products || products.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card');

        const img = document.createElement('img');
        img.src = product.p_img;
        img.alt = product.product_name;
        img.style.height = '200px';
        img.style.width = '200px';
        img.style.borderRadius = '5px';
        productElement.appendChild(img);

        const name = document.createElement('h2');
        name.innerText = product.product_name;
        productElement.appendChild(name);

        const priceDisplay = document.createElement('p');
        priceDisplay.classList.add('price');
        productElement.appendChild(priceDisplay);

        const weightSelect = document.createElement('select');
        weightSelect.classList.add('weight-select');
        const quantityOptions = ['1kg', '500g', '250g'];
        quantityOptions.forEach(weight => {
            const option = document.createElement('option');
            option.value = weight;
            option.innerText = weight;
            weightSelect.appendChild(option);
        });

        productElement.appendChild(weightSelect);
        productElement.appendChild(document.createElement('br'));

        let selectedWeight = weightSelect.value;
        let updatedPrice = product.p_price;
        priceDisplay.innerText = `Price: ₹${updatedPrice}`;

        weightSelect.addEventListener('change', function () {
            selectedWeight = weightSelect.value;
            updatedPrice = product.p_price;
            if (selectedWeight === '500g') updatedPrice /= 2;
            if (selectedWeight === '250g') updatedPrice /= 4;
            priceDisplay.innerText = `Price: ₹${updatedPrice}`;
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add to Cart';
        addToCartButton.classList.add('add-to-cart');
        addToCartButton.addEventListener('click', function () {
            addToCart(product, selectedWeight, updatedPrice);
        });

        productElement.appendChild(addToCartButton);
        container.appendChild(productElement);
    });
}


async function addToCart(product, selectedWeight, updatedPrice) {
    try {
        const payload = {
            product_id: product.id,
            weight: selectedWeight,  
            quantity: 1,
            product_name: product.product_name,
            product_price: updatedPrice,
            product_image: product.p_img
        };

        const response = await fetch(`${BASE_URL}/Cart/addproduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Added to cart:', data);
        alert('Product added to cart!');
    } catch (error) {
        console.error('Add to cart failed:', error);
        alert('Failed to add product to cart.');
    }
}
