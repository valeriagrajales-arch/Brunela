// Navbar scroll behavior (consistent with other pages)
let lastScrollTop = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

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

window.addEventListener('scroll', requestTick, { passive: true });

// Menu toggle functionality (consistent with other pages)
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

        if (menuHamburger) {
            menuHamburger.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                sidebarMenu.classList.remove('active');
                darkOverlay.classList.remove('active');
            });
        }

        darkOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            sidebarMenu.classList.remove('active');
            darkOverlay.classList.remove('active');
        });

        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !sidebarMenu.contains(event.target)) {
                menuToggle.classList.remove('active');
                sidebarMenu.classList.remove('active');
                darkOverlay.classList.remove('active');
            }
        });
    }
});