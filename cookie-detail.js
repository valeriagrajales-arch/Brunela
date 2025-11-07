// Cookie Data - Base de datos de todas las galletas
const cookieDatabase = {
    'sabor1': {
        id: 'sabor1',
        name: 'JX Experiment Cookie',
        price: '$2,500',
        image: 'img/sabor1.png',
        caption: 'JX Experiment cookie',
        description: 'Una galleta increíble, con sabor a dulce horneado con relleno de chocolate y un poco de harina por encima.',
        tags: ['CHOCOLATE CHIP', 'NUEVAS', 'PREMIUM'],
        categories: ['nuevas', 'chocolate', 'chocolate-chip'],
        flavors: ['chocolate-chip', 'chocolate']
    },
    'sabor2': {
        id: 'sabor2',
        name: 'JS Cinnamon Roll',
        price: '$1,800',
        image: 'img/sabor2.png',
        caption: 'JS Cinnamon Roll cookie',
        description: 'Una deliciosa galleta estilo cinnamon roll con canela y azúcar. Perfecta para acompañar tu café de la mañana.',
        tags: ['SEMANAL', 'CANELA', 'TRADICIONAL'],
        categories: ['semanal', 'chocolate', 'tradicional'],
        flavors: ['canela', 'chocolate']
    },
    'sabor3': {
        id: 'sabor3',
        name: 'Premium Chocolate Deluxe',
        price: '$3,200',
        image: 'img/sabor3.png',
        caption: 'Premium Chocolate Deluxe',
        description: 'Una galleta premium con chocolate belga, nueces del mediterráneo y un toque de vainilla francesa.',
        tags: ['ESPECIALES', 'PREMIUM', 'CHOCOLATE BELGA'],
        categories: ['especiales', 'premium', 'chocolate-chip'],
        flavors: ['vainilla', 'chocolate-chip', 'nuez']
    },
    'sabor4': {
        id: 'sabor4',
        name: 'Gluten-Free Berry Bliss',
        price: '$2,700',
        image: 'img/sabor4.png',
        caption: 'Gluten-Free Berry Bliss',
        description: 'Galleta sin gluten elaborada con harina de almendras, arándanos frescos y esencia de vainilla natural.',
        tags: ['SIN GLUTEN', 'FRESA', 'NUEVAS'],
        categories: ['nuevas', 'sin-gluten', 'premium'],
        flavors: ['fresa', 'vainilla']
    },
    'sabor5': {
        id: 'sabor5',
        name: 'Classic Vanilla Bean',
        price: '$2,000',
        image: 'img/sabor5.png',
        caption: 'Classic Vanilla Bean cookie',
        description: 'Una clásica galleta de vainilla elaborada con granos de vainilla de Madagascar. Simple pero exquisita.',
        tags: ['SEMANAL', 'VAINILLA', 'TRADICIONAL'],
        categories: ['semanal', 'chocolate', 'tradicional'],
        flavors: ['vainilla', 'chocolate']
    },
    'sabor6': {
        id: 'sabor6',
        name: 'Chocolate Supreme Deluxe',
        price: '$3,600',
        image: 'img/sabor6.jpg',
        caption: 'Chocolate Supreme Deluxe',
        description: 'La galleta más extravagante: triple chocolate con ganache, chips de chocolate negro y crema batida.',
        tags: ['ESPECIALES', 'PREMIUM', 'TRIPLE CHOCOLATE'],
        categories: ['especiales', 'premium', 'chocolate-chip'],
        flavors: ['chocolate', 'chocolate-chip', 'nuez']
    }
};

// Menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const darkOverlay = document.querySelector('.dark-overlay');
    const menuHamburger = document.querySelector('.menu-hamburger');
    
    if (menuToggle && sidebarMenu && darkOverlay) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebarMenu.classList.toggle('active');
            darkOverlay.classList.toggle('active');
        });
        
        // Close menu when clicking on hamburger inside sidebar
        if (menuHamburger) {
            menuHamburger.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                sidebarMenu.classList.remove('active');
                darkOverlay.classList.remove('active');
            });
        }
        
        // Close menu when clicking on overlay
        darkOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            sidebarMenu.classList.remove('active');
            darkOverlay.classList.remove('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !sidebarMenu.contains(event.target)) {
                menuToggle.classList.remove('active');
                sidebarMenu.classList.remove('active');
                darkOverlay.classList.remove('active');
            }
        });
    }
    
    // Initialize cookie data
    loadCookieData();
    
    // Setup action buttons
    setupActionButtons();
});

// Function to load cookie data from URL parameter
function loadCookieData() {
    const urlParams = new URLSearchParams(window.location.search);
    const cookieId = urlParams.get('cookie') || urlParams.get('id') || 'sabor1';
    
    const cookieData = cookieDatabase[cookieId];
    
    if (cookieData) {
        // Update the page content
        document.getElementById('cookie-title').textContent = cookieData.name;
        document.getElementById('cookie-price').textContent = cookieData.price;
        document.getElementById('image-caption').textContent = cookieData.caption;
        document.getElementById('cookie-description').textContent = cookieData.description;
        
        // Update the image
        const cookieImage = document.getElementById('cookie-detail-image');
        cookieImage.src = cookieData.image;
        cookieImage.alt = cookieData.name;
        
        // Update page title
        document.title = `${cookieData.name} - Brunela`;
        
        // Generate tags
        generateTags(cookieData.tags);
        
        // Store cookie data for actions
        window.currentCookieData = cookieData;
    } else {
        // If cookie not found, show default
        console.warn('Cookie not found:', cookieId);
        loadDefaultCookie();
    }
}

// Function to load default cookie if no specific one is requested
function loadDefaultCookie() {
    const defaultCookie = cookieDatabase['sabor1'];
    document.getElementById('cookie-title').textContent = defaultCookie.name;
    document.getElementById('cookie-price').textContent = defaultCookie.price;
    document.getElementById('image-caption').textContent = defaultCookie.caption;
    document.getElementById('cookie-description').textContent = defaultCookie.description;
    
    const cookieImage = document.getElementById('cookie-detail-image');
    cookieImage.src = defaultCookie.image;
    cookieImage.alt = defaultCookie.name;
    
    document.title = `${defaultCookie.name} - Brunela`;
    generateTags(defaultCookie.tags);
    
    window.currentCookieData = defaultCookie;
}

// Function to generate tags dynamically
function generateTags(tagsArray) {
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.innerHTML = '';
    
    tagsArray.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
}

// Function to setup action buttons
function setupActionButtons() {
    const addToCartButton = document.querySelector('.add-to-cart');
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            addToCart();
        });
    }
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            openWhatsApp();
        });
    }
}

// Function to handle add to cart
function addToCart() {
    if (window.currentCookieData) {
        // Here you would typically integrate with a shopping cart system
        const cookieData = window.currentCookieData;
        
        // Simple cart implementation with localStorage
        let cart = JSON.parse(localStorage.getItem('brunelaCart')) || [];
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === cookieData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: cookieData.id,
                name: cookieData.name,
                price: cookieData.price,
                image: cookieData.image,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('brunelaCart', JSON.stringify(cart));
        
        // Show success message
        showNotification('✅ Galleta agregada al carrito!', 'success');
        
        console.log('Added to cart:', cookieData.name);
    }
}

// Function to open WhatsApp
function openWhatsApp() {
    if (window.currentCookieData) {
        const cookieData = window.currentCookieData;
        const message = `¡Hola! Me interesa la galleta "${cookieData.name}" por ${cookieData.price}. ¿Podrías darme más información?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/573001234567?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#25d366' : '#7d1b26'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to navigate to a specific cookie (for future use)
function navigateToCookie(cookieId) {
    const baseUrl = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    const newUrl = `${baseUrl}/cookie-detail.html?cookie=${cookieId}`;
    window.location.href = newUrl;
}

// Export for use in other files
window.brunelaNavigation = {
    navigateToCookie: navigateToCookie,
    cookieDatabase: cookieDatabase
};
