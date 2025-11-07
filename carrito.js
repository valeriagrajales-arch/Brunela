// CARROT DE COMPRAS - VERSIÓN FUNCIONAL SIMPLE
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== CARRITO INICIADO ===');
    loadCartItems();
    updateCartSummary();
    updateCartCount();
});

// Cargar elementos del carrito
function loadCartItems() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    console.log('Items en carrito:', cartItems.length);
    
    if (cartItems.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(emptyCart);
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach((item, index) => {
        const cartItemElement = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItemElement);
    });
}

// Crear elemento del carrito
function createCartItemElement(item, index) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.setAttribute('data-product-id', item.id);
    
    cartItemDiv.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-description">${item.description}</p>
            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
        </div>
        
        <div class="cart-item-controls">
            <div class="quantity-controls">
                <button class="quantity-btn minus-btn" onclick="decreaseQuantity('${item.id}')">
                    -
                </button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" 
                       onchange="changeQuantity('${item.id}', this.value)">
                <button class="quantity-btn plus-btn" onclick="increaseQuantity('${item.id}')">
                    +
                </button>
            </div>
            
            <div class="cart-item-total">
                $${(item.price * item.quantity).toLocaleString()}
            </div>
            
            <button class="remove-btn" onclick="removeItem('${item.id}')">
                Eliminar
            </button>
        </div>
    `;
    
    return cartItemDiv;
}

// FUNCIONES GLOBALES SIMPLES CON ACTUALIZACIÓN INMEDIATA
function increaseQuantity(productId) {
    console.log('AUMENTAR:', productId);
    const cartItems = getCartItems();
    const item = cartItems.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        saveCartItems(cartItems);
        
        // Actualizar inmediatamente sin recargar
        updateItemDisplay(productId);
        updateCartSummary();
        updateCartCount();
        showNotification('Cantidad aumentada');
    }
}

function decreaseQuantity(productId) {
    console.log('DISMINUIR:', productId);
    const cartItems = getCartItems();
    const item = cartItems.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartItems(cartItems);
        
        // Actualizar inmediatamente sin recargar
        updateItemDisplay(productId);
        updateCartSummary();
        updateCartCount();
        showNotification('Cantidad disminuida');
    }
}

function changeQuantity(productId, newQuantity) {
    console.log('CAMBIAR CANTIDAD:', productId, newQuantity);
    const quantity = parseInt(newQuantity);
    
    if (quantity >= 1 && quantity <= 99) {
        const cartItems = getCartItems();
        const item = cartItems.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            saveCartItems(cartItems);
            
            // Actualizar inmediatamente sin recargar
            updateItemDisplay(productId);
            updateCartSummary();
            updateCartCount();
            showNotification('Cantidad actualizada');
        }
    } else {
        // Solo recargar si el valor es inválido
        loadCartItems();
    }
}

function removeItem(productId) {
    console.log('ELIMINAR:', productId);
    const cartItems = getCartItems();
    const filteredItems = cartItems.filter(item => item.id !== productId);
    
    saveCartItems(filteredItems);
    
    // Eliminar elemento del DOM inmediatamente
    const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
    if (itemElement) {
        itemElement.remove();
    }
    
    // Si no quedan items, mostrar carrito vacío
    if (filteredItems.length === 0) {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        emptyCart.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(emptyCart);
    }
    
    updateCartSummary();
    updateCartCount();
    showNotification('Producto eliminado');
}

// Actualizar display de un item específico sin recargar todo
function updateItemDisplay(productId) {
    const cartItems = getCartItems();
    const item = cartItems.find(item => item.id === productId);
    
    if (!item) return;
    
    // Buscar el elemento en el DOM
    const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
    if (!itemElement) return;
    
    // Actualizar input de cantidad
    const quantityInput = itemElement.querySelector('.quantity-input');
    if (quantityInput) {
        quantityInput.value = item.quantity;
    }
    
    // Actualizar total del item
    const itemTotal = itemElement.querySelector('.cart-item-total');
    if (itemTotal) {
        itemTotal.textContent = `$${(item.price * item.quantity).toLocaleString()}`;
    }
}

// Actualizar resumen
function updateCartSummary() {
    const cartItems = getCartItems();
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + shipping;
    
    // Actualizar elementos básicos
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}`;
    if (totalElement) totalElement.textContent = `$${total.toLocaleString()}`;
    
    // Actualizar resumen detallado
    updateDetailedSummary(cartItems, subtotal, shipping, total);
    
    // Botón de checkout
    if (checkoutBtn) {
        checkoutBtn.disabled = cartItems.length === 0;
        checkoutBtn.textContent = cartItems.length === 0 ? 'Carrito Vacío' : 'Proceder al Pago';
    }
}

// Resumen detallado
function updateDetailedSummary(cartItems, subtotal, shipping, total) {
    const summaryDetails = document.querySelector('.summary-details');
    if (!summaryDetails) return;
    
    let html = '';
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        html += `
            <div class="product-summary-item">
                <div class="product-summary-name">${item.name}</div>
                <div class="product-summary-details">
                    <div class="product-summary-row">
                        <span>Precio unitario:</span>
                        <span>$${item.price.toLocaleString()}</span>
                    </div>
                    <div class="product-summary-row">
                        <span>Cantidad:</span>
                        <span>${item.quantity}</span>
                    </div>
                    <div class="product-summary-row product-summary-total">
                        <span>Subtotal:</span>
                        <span>$${itemTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="summary-divider"></div>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Envío:</span>
            <span>${shipping === 0 ? 'Gratis' : '$' + shipping.toLocaleString()}</span>
        </div>
        <div class="summary-row total-row">
            <span>Total:</span>
            <span>$${total.toLocaleString()}</span>
        </div>
    `;
    
    summaryDetails.innerHTML = html;
}

// Funciones de utilidad
function getCartItems() {
    const currentUser = localStorage.getItem('currentUser') || 'guest';
    const cartKey = `cart_${currentUser}`;
    const cartData = localStorage.getItem(cartKey);
    return cartData ? JSON.parse(cartData) : [];
}

function saveCartItems(cartItems) {
    const currentUser = localStorage.getItem('currentUser') || 'guest';
    const cartKey = `cart_${currentUser}`;
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
}

function updateCartCount() {
    const cartItems = getCartItems();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 2000);
}

// Checkout
function proceedToCheckout() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        showNotification('Carrito vacío');
        return;
    }
    alert('Funcionalidad de pago en desarrollo');
}

// Event listener para checkout
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});