// Navbar scroll behavior
let lastScrollTop = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Always keep navbar visible
    navbar.style.transform = 'translateY(0)';
    
    lastScrollTop = scrollTop;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

// Add scroll event listener
window.addEventListener('scroll', requestTick, { passive: true });

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
    
    // Load product data from sessionStorage
    loadProductData();
    
    // Add action button functionality
    setupActionButtons();
});

// Function to load product data
function loadProductData() {
    const productData = sessionStorage.getItem('selectedProduct');
    
    if (productData) {
        try {
            const product = JSON.parse(productData);
            updateProductDisplay(product);
        } catch (error) {
            console.error('Error parsing product data:', error);
            // Fallback to default product
            loadDefaultProduct();
        }
    } else {
        // Load default product if no data
        loadDefaultProduct();
    }
}

// Function to update product display
function updateProductDisplay(product) {
    // Update image
    const productImage = document.getElementById('merch-detail-image');
    if (productImage && product.image) {
        productImage.src = product.image;
        productImage.alt = product.title || 'Producto Brunela';
    }
    
    // Update title
    const productTitle = document.getElementById('merch-title');
    if (productTitle && product.title) {
        productTitle.textContent = product.title.replace(/-/g, ' ').toUpperCase();
    }
    
    // Update price
    const productPrice = document.getElementById('merch-price');
    if (productPrice && product.price) {
        productPrice.textContent = product.price;
    }
    
    // Update description
    const productDescription = document.getElementById('merch-description');
    if (productDescription && product.description) {
        productDescription.textContent = product.description;
    }
    
    // Update image caption
    const imageCaption = document.getElementById('image-caption');
    if (imageCaption && product.title) {
        imageCaption.textContent = product.title.replace(/-/g, ' ').toUpperCase();
    }
    
    // Update tags based on product type
    updateProductTags(product);
}

// Function to load default product
function loadDefaultProduct() {
    const defaultProduct = {
        title: 'bolso-brunela',
        price: '$25.000',
        description: 'Un producto increíble de Brunela, diseñado con amor y dedicación para nuestros clientes más especiales.',
        image: 'img/merch/bolso 1.png'
    };
    
    updateProductDisplay(defaultProduct);
}

// Function to update product tags
function updateProductTags(product) {
    const tagsContainer = document.getElementById('tags-container');
    if (!tagsContainer) return;
    
    // Clear existing tags
    tagsContainer.innerHTML = '';
    
    // Define tags based on product type
    let tags = [];
    
    if (product.title) {
        const title = product.title.toLowerCase();
        
        if (title.includes('bolso')) {
            tags = ['Accesorio', 'Práctico', 'Diseño Exclusivo', 'Calidad Premium'];
        } else if (title.includes('camiseta')) {
            tags = ['Ropa', 'Cómodo', 'Algodón', 'Estilo Casual'];
        } else if (title.includes('gorra')) {
            tags = ['Accesorio', 'Ajustable', 'Protección UV', 'Estilo Urbano'];
        } else if (title.includes('termo')) {
            tags = ['Accesorio', 'Acero Inoxidable', 'Mantiene Temperatura', 'Portátil'];
        } else if (title.includes('combo')) {
            tags = ['Oferta Especial', 'Múltiples Productos', 'Ahorro', 'Regalo Perfecto'];
        } else if (title.includes('sobre')) {
            tags = ['Hogar', 'Decorativo', 'Estilo Elegante', 'Casa Brunela'];
        } else {
            tags = ['Producto Brunela', 'Calidad Premium', 'Diseño Exclusivo', 'Hecho con Amor'];
        }
    }
    
    // Add tags to container
    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
}

// Function to setup action buttons
function setupActionButtons() {
    const cartButton = document.querySelector('.cart-button');
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            // Add to cart functionality
            showNotification('Producto agregado al carrito', 'success');
        });
    }
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // WhatsApp functionality
            const productTitle = document.getElementById('merch-title')?.textContent || 'Producto Brunela';
            const productPrice = document.getElementById('merch-price')?.textContent || '$25.000';
            
            const message = `¡Hola! Me interesa el producto: ${productTitle} - ${productPrice}`;
            const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
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
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // ESC key to close menu
    if (event.key === 'Escape') {
        const sidebarMenu = document.querySelector('.sidebar-menu');
        
        if (sidebarMenu && sidebarMenu.classList.contains('active')) {
            sidebarMenu.classList.remove('active');
            document.querySelector('.dark-overlay').classList.remove('active');
            document.querySelector('.menu-toggle').classList.remove('active');
        }
    }
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation for product image
    const productImage = document.getElementById('merch-detail-image');
    if (productImage) {
        productImage.style.opacity = '0';
        productImage.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            productImage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            productImage.style.opacity = '1';
            productImage.style.transform = 'scale(1)';
        }, 200);
    }
});

