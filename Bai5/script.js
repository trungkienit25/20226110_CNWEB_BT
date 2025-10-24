document.addEventListener('DOMContentLoaded', function() {
    
    const STORAGE_KEY = 'kienpc_products';
    let currentProducts = []; 

    const addProductBtn = document.getElementById('addProductBtn');
    const addProductFormSection = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const newProductForm = document.getElementById('newProductFormInternal');
    const productListContainer = document.getElementById('product-list');
    const errorMsg = document.getElementById('errorMsg');

    function saveProductsToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProducts));
    }

    function createProductElement(product) {
        const newItem = document.createElement('article');
        newItem.className = 'product-item';
        newItem.style.display = ''; 
        
        const formattedPrice = Number(product.price).toLocaleString('vi-VN');

        newItem.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3 class="product-name">${product.name}</h3>
            <p>${product.desc}</p>
            <p class="price">Giá: ${formattedPrice} VNĐ</p>
        `;
        return newItem;
    }

    function renderProductList() {
        const oldItems = productListContainer.querySelectorAll('.product-item');
        oldItems.forEach(item => item.remove());
        
        currentProducts.forEach(product => {
            const productElement = createProductElement(product);
            productListContainer.appendChild(productElement); 
        });
    }

    (function loadInitialProducts() {
        const storedProducts = localStorage.getItem(STORAGE_KEY); 

        if (storedProducts) {
            currentProducts = JSON.parse(storedProducts);
            renderProductList(); 
        } else {
            const initialItems = productListContainer.querySelectorAll('.product-item');
            
            initialItems.forEach(item => {
                const nameElement = item.querySelector('h3');
                const descElement = item.querySelector('p'); // Lấy <p> đầu tiên
                const priceElement = item.querySelector('.price');
                const imgElement = item.querySelector('img');

                if (nameElement && descElement && priceElement && imgElement) {
                    const priceText = priceElement.textContent;
                    const price = priceText.replace(/[^0-9]/g, '');

                    currentProducts.push({ 
                        name: nameElement.textContent, 
                        price: price, 
                        desc: descElement.textContent, 
                        imageUrl: imgElement.src 
                    });

                    nameElement.classList.add('product-name');
                }
            });
            
            saveProductsToLocalStorage();
        }
    })();

    addProductBtn.addEventListener('click', function() {
        addProductFormSection.classList.toggle('hidden');
    });

    cancelBtn.addEventListener('click', function() {
        addProductFormSection.classList.add('hidden');
        errorMsg.textContent = '';
        newProductForm.reset();
    });

    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const allProducts = productListContainer.querySelectorAll('.product-item');
        
        allProducts.forEach(function(item) {
            const productName = item.querySelector('.product-name').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    newProductForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const name = document.getElementById('newName').value.trim();
        const price = document.getElementById('newPrice').value.trim();
        const desc = document.getElementById('newDesc').value.trim();
        let imageUrl = document.getElementById('newImage').value.trim();

        if (name === '' || price === '') {
            errorMsg.textContent = 'Vui lòng nhập Tên và Giá sản phẩm.'; 
            return;
        }
        if (isNaN(price) || Number(price) <= 0) {
            errorMsg.textContent = 'Giá sản phẩm phải là một số lớn hơn 0.'; 
            return;
        }

        errorMsg.textContent = ''; 

        if (imageUrl === '') {
            imageUrl = 'https://placehold.co/400x400/2a2a2a/ccc?text=KienPC';
        }

        const newProductObject = {
            name: name,
            price: price,
            desc: desc,
            imageUrl: imageUrl
        };

        currentProducts.push(newProductObject); 
        saveProductsToLocalStorage(); 

        const newItemElement = createProductElement(newProductObject); 
        
        productListContainer.appendChild(newItemElement); 

        newProductForm.reset(); 
        addProductFormSection.classList.add('hidden'); 
    });
});