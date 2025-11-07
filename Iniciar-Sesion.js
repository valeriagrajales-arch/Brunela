// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const socialIcons = document.querySelectorAll('.social-icon');
    
    // Input field interactions
    if (usernameInput) {
        usernameInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        usernameInput.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        passwordInput.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    }
    
    // Login button functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!username || !password) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Simulate login validation
            if (validateLogin(username, password)) {
                // Get user data and save to session
                const userData = getUserData(username);
                saveUserSession(userData);
                
                showNotification('¡Bienvenido! Iniciando sesión...', 'success');
                // Redirect to home after successful login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showNotification('Datos inválidos. Usuario o contraseña incorrectos.', 'error');
                // Clear form fields
                usernameInput.value = '';
                passwordInput.value = '';
                // Add shake animation to form
                document.querySelector('.login-form').classList.add('shake');
                setTimeout(() => {
                    document.querySelector('.login-form').classList.remove('shake');
                }, 500);
            }
        });
    }
    
    // Register button functionality
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            // Navigate to registration page
            window.location.href = 'Registrarse.html';
        });
    }
    
    // Social login functionality
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const iconClass = this.classList[1]; // apple, google, facebook, microsoft
            
            switch(iconClass) {
                case 'apple':
                    showNotification('Iniciando sesión con Apple...', 'info');
                    // Simulate Apple login
                    setTimeout(() => {
                        showNotification('Sesión iniciada con Apple', 'success');
                    }, 1500);
                    break;
                    
                case 'google':
                    showNotification('Iniciando sesión con Google...', 'info');
                    // Simulate Google login
                    setTimeout(() => {
                        showNotification('Sesión iniciada con Google', 'success');
                    }, 1500);
                    break;
                    
                case 'facebook':
                    showNotification('Iniciando sesión con Facebook...', 'info');
                    // Simulate Facebook login
                    setTimeout(() => {
                        showNotification('Sesión iniciada con Facebook', 'success');
                    }, 1500);
                    break;
                    
                case 'microsoft':
                    showNotification('Iniciando sesión con Microsoft...', 'info');
                    // Simulate Microsoft login
                    setTimeout(() => {
                        showNotification('Sesión iniciada con Microsoft', 'success');
                    }, 1500);
                    break;
            }
        });
    });
    
    // Enter key functionality
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (document.activeElement === usernameInput) {
                passwordInput.focus();
            } else if (document.activeElement === passwordInput) {
                loginBtn.click();
            }
        }
    });
    
    // Add some interactive effects
    addInteractiveEffects();
});

// Function to get user data by username
function getUserData(username) {
    // Check default users first
    const defaultUsers = [
        { username: 'admin', password: 'admin123', fullName: 'Administrador' },
        { username: 'brunela', password: 'brunela2024', fullName: 'Brunela' },
        { username: 'usuario', password: 'password123', fullName: 'Usuario' },
        { username: 'test', password: 'test123', fullName: 'Usuario de Prueba' }
    ];
    
    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...defaultUsers, ...registeredUsers];
    
    return allUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
}

// Function to save user session
function saveUserSession(userData) {
    const sessionData = {
        isLoggedIn: true,
        username: userData.username,
        fullName: userData.fullName || userData.username,
        email: userData.email || '',
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('userSession', JSON.stringify(sessionData));
}

// Function to validate login credentials
function validateLogin(username, password) {
    // Simulate a database of valid users (default users)
    const defaultUsers = [
        { username: 'admin', password: 'admin123' },
        { username: 'brunela', password: 'brunela2024' },
        { username: 'usuario', password: 'password123' },
        { username: 'test', password: 'test123' }
    ];
    
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Combine default users with registered users
    const allUsers = [...defaultUsers, ...registeredUsers];
    
    // Check if credentials match any valid user
    return allUsers.some(user => 
        user.username.toLowerCase() === username.toLowerCase() && 
        user.password === password
    );
}

// Function to show notifications
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

// Function to add interactive effects
function addInteractiveEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.register-btn, .social-icon');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add some visual feedback for form validation
function validateForm() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    let isValid = true;
    
    // Username validation
    if (username.length < 3) {
        showFieldError('username', 'El nombre de usuario debe tener al menos 3 caracteres');
        isValid = false;
    } else {
        clearFieldError('username');
    }
    
    // Password validation
    if (password.length < 6) {
        showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    } else {
        clearFieldError('password');
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentElement.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #f44336;
        font-size: 12px;
        margin-top: 5px;
        font-weight: 500;
    `;
    
    field.parentElement.appendChild(errorElement);
    field.style.borderColor = '#f44336';
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentElement.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.style.borderColor = '';
}

// Add smooth transitions for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state to form
    const form = document.querySelector('.login-form');
    if (form) {
        form.style.opacity = '0';
        form.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            form.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 100);
    }
});
