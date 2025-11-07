// Navbar scroll behavior
let lastScrollTop = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Always keep navbar visible - remove hide functionality
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
    
    // Carrusel automático infinito
    const carouselTrack = document.getElementById('carouselTrack');
    
    if (carouselTrack) {
        // El carrusel se ejecuta automáticamente con CSS animation
        // No se requiere JavaScript adicional para el movimiento automático
        
        // Prevenir interacción del usuario con el carrusel
        carouselTrack.style.pointerEvents = 'none';
        carouselTrack.style.userSelect = 'none';
        
        // Asegurar que la animación nunca se pause
        carouselTrack.style.animationPlayState = 'running';
        
        // Prevenir eventos de teclado que puedan afectar el carrusel
        document.addEventListener('keydown', function(event) {
            // Prevenir teclas de navegación que puedan interferir
            if (['ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.key)) {
                event.preventDefault();
            }
        });
        
        // Prevenir scroll en el carrusel
        carouselTrack.addEventListener('wheel', function(event) {
            event.preventDefault();
        });
        
        // Prevenir touch events en dispositivos móviles
        carouselTrack.addEventListener('touchstart', function(event) {
            event.preventDefault();
        });
        
        carouselTrack.addEventListener('touchmove', function(event) {
            event.preventDefault();
        });
        
        carouselTrack.addEventListener('touchend', function(event) {
            event.preventDefault();
        });
    }
    
    // Filter functionality
    const filterButton = document.getElementById('filterButton');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilter = document.getElementById('closeFilter');
    const filterTags = document.querySelectorAll('.filter-tag');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (filterButton && filterPanel && closeFilter) {
        // Toggle filter panel
        filterButton.addEventListener('click', function(e) {
            e.stopPropagation();
            filterPanel.classList.toggle('active');
        });
        
        // Close filter panel
        closeFilter.addEventListener('click', function(e) {
            e.stopPropagation();
            filterPanel.classList.remove('active');
        });
        
        // Close filter panel when clicking outside
        document.addEventListener('click', function(event) {
            if (!filterPanel.contains(event.target) && !filterButton.contains(event.target)) {
                filterPanel.classList.remove('active');
            }
        });
        
        // Handle filter tag clicks
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Toggle active state
                this.classList.toggle('active');
                
                // Get the filter value
                const filterValue = this.getAttribute('data-filter');
                console.log('Filter clicked:', filterValue, 'Active:', this.classList.contains('active'));
            });
        });
        
        // Apply filters button
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                const activeFilters = Array.from(filterTags)
                    .filter(tag => tag.classList.contains('active'))
                    .map(tag => tag.getAttribute('data-filter'));
                
                const minPrice = minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0;
                const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) || Infinity : Infinity;
                
                // Apply filters to products
                filterProducts(activeFilters, minPrice, maxPrice);
                
                // Close filter panel
                filterPanel.classList.remove('active');
            });
        }
        
        // Clear filters button
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Clear all active tags
                filterTags.forEach(tag => {
                    tag.classList.remove('active');
                });
                
                // Clear price inputs
                if (minPriceInput) minPriceInput.value = '';
                if (maxPriceInput) maxPriceInput.value = '';
                
                // Show all products
                showAllProducts();
                
                console.log('All filters cleared');
            });
        }
    }
    
    // Add click navigation to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on action buttons or badges
            if (e.target.closest('button') || e.target.classList.contains('card-badge')) {
                return;
            }
            
            // Extract cookie info from card
            const cardTitle = card.querySelector('.card-title')?.textContent.toLowerCase().replace(' ', '');
            const cardSabor = cardTitle; // e.g., "sabor1", "sabor2", etc.
            
            // Navigate to cookie detail page
            if (cardSabor) {
                window.location.href = `cookie-detail.html?cookie=${cardSabor}`;
            }
        });
        
        // Add cursor pointer for interactivity
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(157, 83, 83, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 15px 35px rgba(157, 83, 83, 0.25)';
        });
    });
});

// Function to filter products based on selected filters
function filterProducts(activeFilters, minPrice, maxPrice) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        let shouldShow = true;
        
        // Check price filter
        const cardPrice = parseFloat(card.getAttribute('data-price')) || 0;
        if (cardPrice < minPrice || cardPrice > maxPrice) {
            shouldShow = false;
        }
        
        // Check category/flavor filters
        if (activeFilters.length > 0 && shouldShow) {
            const cardCategories = card.getAttribute('data-categories') || '';
            const cardFlavors = card.getAttribute('data-flavors') || '';
            const allCardTags = (cardCategories + ' ' + cardFlavors).split(' ').filter(Boolean);
            
            // Check if any active filter matches any card tag
            const hasMatchingFilter = activeFilters.some(filter => 
                allCardTags.includes(filter)
            );
            
            if (!hasMatchingFilter) {
                shouldShow = false;
            }
        }
        
        // Show or hide the card with smooth animation
        if (shouldShow) {
            card.style.display = 'flex';
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Function to show all products
function showAllProducts() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.style.display = 'flex';
        card.style.opacity = '1';
    });
}
