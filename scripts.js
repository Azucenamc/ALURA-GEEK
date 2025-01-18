document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search');
    const addProductForm = document.getElementById('addProductForm');
    const clearButton = document.getElementById('clearButton');
    const products = [];

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products.push(...data);
            displayProducts(products);
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
        displayProducts(filteredProducts);
    });

    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = addProductForm.productName.value;
        const productPrice = addProductForm.productPrice.value;
        const productImageInput = addProductForm.productImage.value;
        const productFileInput = addProductForm.productFile.files[0];

        if (!productName || !productPrice) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        let productImage = '';
        if (productImageInput) {
            productImage = productImageInput;
        } else if (productFileInput) {
            const reader = new FileReader();
            reader.onloadend = () => {
                productImage = reader.result;
                const newProduct = {
                    name: productName,
                    price: productPrice,
                    image: productImage
                };
                products.push(newProduct);
                displayProducts(products);
                addProductForm.reset();
            };
            reader.readAsDataURL(productFileInput);
            return;
        } else {
            alert('Por favor, proporciona un enlace de imagen o sube un archivo de imagen.');
            return;
        }

        const newProduct = {
            name: productName,
            price: productPrice,
            image: productImage
        };

        products.push(newProduct);
        displayProducts(products);
        addProductForm.reset();
    });

    clearButton.addEventListener('click', () => {
        addProductForm.reset();
    });

    function displayProducts(productsToDisplay) {
        productList.innerHTML = '';
        if (productsToDisplay.length === 0) {
            productList.innerHTML = '<p>No se han agregado productos</p>';
        } else {
            productsToDisplay.forEach((product, index) => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.image.startsWith('data') ? product.image : 'assets/' + product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Precio: ${product.price} <img src="assets/eliminar.jpg" alt="Eliminar" class="delete-icon" data-index="${index}"></p>
                `;
                productList.appendChild(productDiv);
            });

            document.querySelectorAll('.delete-icon').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const index = event.target.dataset.index;
                    products.splice(index, 1);
                    displayProducts(products);
                });
            });
        }
    }
});
