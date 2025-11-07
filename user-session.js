// User Session Management - Common functions for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and update navbar
    updateNavbarForLoggedUser();
});

// Function to get current user session
function getCurrentUserSession() {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
        try {
            return JSON.parse(sessionData);
        } catch (error) {
            console.error('Error parsing user session:', error);
            return null;
        }
    }
    return null;
}

// Function to check if user is logged in
function isUserLoggedIn() {
    const session = getCurrentUserSession();
    return session && session.isLoggedIn === true;
}

// Function to update navbar for logged user
function updateNavbarForLoggedUser() {
    const session = getCurrentUserSession();
    
    if (session && session.isLoggedIn) {
        // Find the login icon in navbar
        const loginIcon = document.querySelector('.login-icon');
        const searchSection = document.querySelector('.search-section');
        
        if (loginIcon && searchSection) {
            // Create user menu container
            const userMenuContainer = document.createElement('div');
            userMenuContainer.className = 'user-menu-container';
            userMenuContainer.innerHTML = `
                <div class="user-menu">
                    <div class="user-info">
                        <div class="user-avatar-small">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="user-name">${session.fullName}</span>
                        <div class="user-dropdown-arrow">▼</div>
                    </div>
                    <div class="user-dropdown">
                        <div class="dropdown-item" onclick="showUserProfile()">
                            <span class="dropdown-icon">👤</span>
                            <span class="dropdown-text">Mi Perfil</span>
                        </div>
                        <div class="dropdown-item" onclick="showUserSettings()">
                            <span class="dropdown-icon">⚙️</span>
                            <span class="dropdown-text">Configuración</span>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item logout-item" onclick="logoutUser()">
                            <span class="dropdown-icon">🚪</span>
                            <span class="dropdown-text">Cerrar Sesión</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Replace login icon with user menu
            loginIcon.parentNode.replaceChild(userMenuContainer, loginIcon);
            
            // Add click event for dropdown toggle
            const userInfo = userMenuContainer.querySelector('.user-info');
            const userDropdown = userMenuContainer.querySelector('.user-dropdown');
            
            userInfo.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!userMenuContainer.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    }
}

// Function to logout user
function logoutUser() {
    // Clear user session
    localStorage.removeItem('userSession');
    
    // Show logout message
    showNotification('Sesión cerrada exitosamente', 'info');
    
    // Reload page to update navbar
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Function to show user profile
function showUserProfile() {
    const session = getCurrentUserSession();
    if (session) {
        showNotification(`Perfil de ${session.fullName}`, 'info');
        // Here you could navigate to a profile page or show a modal
    }
}

// Function to show user settings
function showUserSettings() {
    showNotification('Configuración de usuario', 'info');
    // Here you could navigate to a settings page or show a modal
}

// Function to show notifications (reusable across pages)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 4000);
}







