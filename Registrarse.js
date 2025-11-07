// Registration page functionality
document.addEventListener('DOMContentLoaded', function() {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const createAccountBtn = document.querySelector('.create-account-btn');
    const backToLoginBtn = document.querySelector('.back-to-login-btn');
    const socialIcons = document.querySelectorAll('.social-icon');
    
    // Input field interactions
    const inputs = [fullNameInput, emailInput, usernameInput, passwordInput, confirmPasswordInput];
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                clearFieldError(this.id);
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            input.addEventListener('input', function() {
                validateField(this);
            });
        }
    });
    
    // Create Account button functionality
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', function() {
            if (validateRegistrationForm()) {
                registerUser();
            }
        });
    }
    
    // Back to Login button functionality
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', function() {
            window.location.href = 'Iniciar-Sesion.html';
        });
    }
    
    // Social registration functionality
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const iconClass = this.classList[1]; // apple, google, facebook, microsoft
            
            switch(iconClass) {
                case 'apple':
                    showNotification('Registro con Apple...', 'info');
                    setTimeout(() => {
                        showNotification('Cuenta creada con Apple', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }, 1500);
                    break;
                    
                case 'google':
                    showNotification('Registro con Google...', 'info');
                    setTimeout(() => {
                        showNotification('Cuenta creada con Google', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }, 1500);
                    break;
                    
                case 'facebook':
                    showNotification('Registro con Facebook...', 'info');
                    setTimeout(() => {
                        showNotification('Cuenta creada con Facebook', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }, 1500);
                    break;
                    
                case 'microsoft':
                    showNotification('Registro con Microsoft...', 'info');
                    setTimeout(() => {
                        showNotification('Cuenta creada con Microsoft', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }, 1500);
                    break;
            }
        });
    });
    
    // Enter key functionality
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (document.activeElement === confirmPasswordInput) {
                createAccountBtn.click();
            } else {
                // Move to next field
                const currentIndex = inputs.indexOf(document.activeElement);
                if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus();
                }
            }
        }
    });
    
    // Add some interactive effects
    addInteractiveEffects();
});

// Function to validate individual field
function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    clearFieldError(fieldId);
    
    switch(fieldId) {
        case 'fullName':
            if (value.length < 2) {
                showFieldError(fieldId, 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldId, 'Ingresa un correo electrónico válido');
                return false;
            }
            break;
            
        case 'username':
            if (value.length < 3) {
                showFieldError(fieldId, 'El usuario debe tener al menos 3 caracteres');
                return false;
            }
            if (isUsernameTaken(value)) {
                showFieldError(fieldId, 'Este nombre de usuario ya está en uso');
                return false;
            }
            break;
            
        case 'password':
            if (value.length < 6) {
                showFieldError(fieldId, 'La contraseña debe tener al menos 6 caracteres');
                return false;
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (value !== password) {
                showFieldError(fieldId, 'Las contraseñas no coinciden');
                return false;
            }
            break;
    }
    
    field.classList.remove('error');
    field.classList.add('success');
    return true;
}

// Function to validate entire registration form
function validateRegistrationForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    let isValid = true;
    
    // Validate all fields
    const fields = [
        { id: 'fullName', value: fullName },
        { id: 'email', value: email },
        { id: 'username', value: username },
        { id: 'password', value: password },
        { id: 'confirmPassword', value: confirmPassword }
    ];
    
    fields.forEach(field => {
        const fieldElement = document.getElementById(field.id);
        if (!validateField(fieldElement)) {
            isValid = false;
        }
    });
    
    // Check if all fields are filled
    if (!fullName || !email || !username || !password || !confirmPassword) {
        showNotification('Por favor, completa todos los campos', 'error');
        isValid = false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        isValid = false;
    }
    
    // Check if username is already taken
    if (isUsernameTaken(username)) {
        showNotification('Este nombre de usuario ya está en uso', 'error');
        isValid = false;
    }
    
    // Check if email is already registered
    if (isEmailRegistered(email)) {
        showNotification('Este correo electrónico ya está registrado', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Function to register user
function registerUser() {
    const userData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value.trim(),
        registeredAt: new Date().toISOString()
    };
    
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Add new user
    existingUsers.push(userData);
    
    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    // Show success message
    showNotification('¡Cuenta creada exitosamente!', 'success');
    
    // Clear form
    clearForm();
    
    // Redirect to home after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Function to check if username is taken
function isUsernameTaken(username) {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return existingUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
}

// Function to check if email is registered
function isEmailRegistered(email) {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Function to show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentElement.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error show';
    errorElement.textContent = message;
    
    field.parentElement.appendChild(errorElement);
    field.classList.add('error');
    field.classList.remove('success');
}

// Function to clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentElement.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
}

// Function to clear form
function clearForm() {
    const inputs = ['fullName', 'email', 'username', 'password', 'confirmPassword'];
    inputs.forEach(inputId => {
        const field = document.getElementById(inputId);
        field.value = '';
        field.classList.remove('error', 'success');
        clearFieldError(inputId);
    });
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
    const buttons = document.querySelectorAll('.create-account-btn, .back-to-login-btn, .social-icon');
    
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

// Add smooth transitions for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state to form
    const form = document.querySelector('.registration-form');
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







