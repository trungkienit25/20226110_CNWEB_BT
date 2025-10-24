document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'kienpc_products';
    let currentProducts = []; 

    const productListContainer = document.getElementById('product-list');
    const newProductForm = document.getElementById('newProductFormInternal');
    const addProductFormSection = document.getElementById('addProductForm');
    
    const addProductBtn = document.getElementById('addProductBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('errorMsg');

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const priceFilter = document.getElementById('priceFilter');
    const sortOrder = document.getElementById('sortOrder');

    async function loadInitialProducts() {
        const storedProducts = localStorage.getItem(STORAGE_KEY); 

        if (storedProducts) {
            currentProducts = JSON.parse(storedProducts);
        } else {
            try {
                const response = await fetch('./products.json');
                if (!response.ok) {
                    throw new Error('Không thể tải products.json');
                }
                currentProducts = await response.json();
                saveProductsToLocalStorage();
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
                productListContainer.innerHTML = '<h2>Lỗi tải sản phẩm. Vui lòng thử lại.</h2>';
            }
        }
        renderProductList(currentProducts);
    }

    function saveProductsToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProducts));
    }

    function createProductElement(product) {
        const newItem = document.createElement('article');
        newItem.className = 'product-item';
        newItem.dataset.id = product.id; 
        
        const formattedPrice = Number(product.price).toLocaleString('vi-VN');

        newItem.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3 class="product-name">${product.name}</h3>
            <p>${product.desc}</p>
            <p class="price">Giá: ${formattedPrice} VNĐ</p>
            <button class="delete-btn" title="Xóa sản phẩm">&times;</button>
        `;
        return newItem;
    }

    function renderProductList(productsToRender) {
        const oldItems = productListContainer.querySelectorAll('.product-item');
        oldItems.forEach(item => item.remove());
        
        if (productsToRender.length === 0) {
            productListContainer.innerHTML += '<p style="width: 100%; text-align: center;">Không tìm thấy sản phẩm nào.</p>';
        } else {
            productsToRender.forEach(product => {
                const productElement = createProductElement(product);
                productListContainer.appendChild(productElement); 
            });
        }
    }

    function toggleAddProductForm() {
        if (addProductFormSection.classList.contains('form-visible')) {
            addProductFormSection.classList.remove('form-visible');
            addProductFormSection.style.maxHeight = null; 
            errorMsg.textContent = '';
            newProductForm.reset();
        } else {
            addProductFormSection.classList.add('form-visible');
            addProductFormSection.style.maxHeight = addProductFormSection.scrollHeight + "px";
        }
    }

    addProductBtn.addEventListener('click', toggleAddProductForm);
    cancelBtn.addEventListener('click', toggleAddProductForm);

    newProductForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const name = document.getElementById('newName').value.trim();
        const price = document.getElementById('newPrice').value.trim();
        const desc = document.getElementById('newDesc').value.trim();
        let imageUrl = document.getElementById('newImage').value.trim();

        if (name === '' || price === '' || isNaN(price) || Number(price) <= 0) {
            errorMsg.textContent = 'Vui lòng nhập tên và giá (số dương) hợp lệ.'; 
            return;
        }

        errorMsg.textContent = ''; 
        if (imageUrl === '') {
            imageUrl = 'https://placehold.co/400x400/2a2a2a/ccc?text=KienPC';
        }
        
        const newId = 'p' + Date.now(); 

        const newProductObject = {
            id: newId,
            name: name,
            price: Number(price),
            desc: desc,
            imageUrl: imageUrl
        };

        currentProducts.push(newProductObject); 
        saveProductsToLocalStorage(); 
        const newItemElement = createProductElement(newProductObject); 
        productListContainer.appendChild(newItemElement); 
        toggleAddProductForm();
    });

    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const priceRange = priceFilter.value;

        let filteredProducts = currentProducts.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(searchTerm);
            let priceMatch = false;
            if (priceRange === 'all') {
                priceMatch = true;
            } else {
                const [min, max] = priceRange.split('-').map(Number);
                priceMatch = (product.price >= min && product.price <= max);
            }
            return nameMatch && priceMatch;
        });

        renderProductList(filteredProducts);
    }

    searchBtn.addEventListener('click', filterAndRender);
    searchInput.addEventListener('keyup', filterAndRender);
    priceFilter.addEventListener('change', filterAndRender);

    sortOrder.addEventListener('change', function() {
        const sortValue = sortOrder.value;

        if (sortValue === 'price-asc') {
            currentProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            currentProducts.sort((a, b) => b.price - a.price);
        }
        
        saveProductsToLocalStorage();
        filterAndRender();
    });

    productListContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const productArticle = event.target.closest('.product-item');
            const productId = productArticle.dataset.id;
            
            if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                currentProducts = currentProducts.filter(p => p.id !== productId);
                saveProductsToLocalStorage();
                productArticle.remove();
            }
        }
    });

    loadInitialProducts();
});
