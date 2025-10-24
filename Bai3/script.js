document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductFormSection = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const newProductForm = document.getElementById('newProductFormInternal');
    const productListContainer = document.getElementById('product-list');
    const errorMsg = document.getElementById('errorMsg');

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

        const newItem = document.createElement('article');
        newItem.className = 'product-item';
        newItem.style.display = '';
        newItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}">
            <h3 class="product-name">${name}</h3>
            <p>${desc}</p>
            <p class="price">Giá: ${Number(price).toLocaleString('vi-VN')} VNĐ</p>
        `;

        productListContainer.prepend(newItem);
        newProductForm.reset();
        addProductFormSection.classList.add('hidden');
    });
});
