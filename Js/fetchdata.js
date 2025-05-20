document.addEventListener('DOMContentLoaded', fetchGroceryData);

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
        redirectURL = "html/fruits.html"; 
    } else if (item.name === 'Vegetable') {
        redirectURL = "html/vegetable.html"; 
    } else if (item.name === 'Dairy') {
        redirectURL = "html/dairy.html";
    } else if (item.name === 'Snacks') {
        redirectURL = "html/snacks.html";
    } else {
        redirectURL = "index.html"; 
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

        const data = await response.json();

        if (data['Featured product']) {
            displayFeaturedProducts(data['Featured product'], productsDiv);
        } else {
            console.warn("Category 'Featured product' is missing in the data.");
        }

       

    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}
