// 3D Cookie Scene Variables
let scene, camera, renderer, cookieModel;
let isRotating = false;
let isZoomed = false;
let mixer; // For animations if any
let controls; // OrbitControls for mouse interaction

// Navbar scroll behavior
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

    // Initialize 3D scene
    init3DScene();
    
    // Initialize customization controls
    initCustomizationControls();
});

// Initialize 3D Cookie Scene
function init3DScene() {
    const container = document.getElementById('cookie3D');
    if (!container) return;

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5e6d3);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add OrbitControls for mouse interaction
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth camera movement
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    
    // Set limits for better control
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI * 0.8; // Prevent camera from going under the model

    // Load the GLTF model
    loadCookieModel();

    // Start animation loop
    animate();

    // Add control event listeners (keeping buttons as shortcuts)
    document.getElementById('rotateBtn').addEventListener('click', toggleAutoRotation);
    document.getElementById('zoomBtn').addEventListener('click', toggleZoom);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

// Load the GLTF cookie model
function loadCookieModel() {
    console.log('Attempting to load GLTF model from: ./3d/cookie/scene.gltf');
    
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        './3d/cookie/scene.gltf',
        function(gltf) {
            console.log('GLTF model loaded successfully!', gltf);
            cookieModel = gltf.scene;
            
            // Enable shadows
            cookieModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    console.log('Mesh found:', child.name, child.geometry);
                }
            });
            
            // Calculate bounding box to center and scale properly
            const box = new THREE.Box3().setFromObject(cookieModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            console.log('Model bounding box:', box);
            console.log('Model center:', center);
            console.log('Model size:', size);
            
            // Center the model
            cookieModel.position.sub(center);
            
            // Scale to fit in the container (max dimension = 3)
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDimension;
            console.log('Scaling model by:', scale);
            cookieModel.scale.setScalar(scale);
            
            scene.add(cookieModel);
            
            // Check for animations
            if (gltf.animations && gltf.animations.length) {
                console.log('Found animations:', gltf.animations.length);
                mixer = new THREE.AnimationMixer(cookieModel);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
            
            console.log('Cookie model added to scene successfully!');
            
            // Hide loading indicator
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        },
        function(progress) {
            const percentage = (progress.loaded / progress.total * 100).toFixed(2);
            console.log('Loading progress:', percentage + '%');
        },
        function(error) {
            console.error('Error loading cookie model:', error);
            console.log('Creating fallback cookie...');
            // Fallback to basic geometry if model fails to load
            createFallbackCookie();
        }
    );
}

// Fallback cookie if GLTF fails to load
function createFallbackCookie() {
    // Create a more realistic cookie shape
    const cookieGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
    
    // Create cookie material with better colors
    const cookieMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xD4AF37,
        shininess: 30,
        specular: 0x111111
    });

    cookieModel = new THREE.Mesh(cookieGeometry, cookieMaterial);
    cookieModel.castShadow = true;
    cookieModel.receiveShadow = true;
    
    // Add some texture detail
    const cookieTop = new THREE.CylinderGeometry(2, 2, 0.05, 32);
    const topMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xC19A6B,
        shininess: 50
    });
    const cookieTopMesh = new THREE.Mesh(cookieTop, topMaterial);
    cookieTopMesh.position.y = 0.15;
    cookieTopMesh.castShadow = true;
    cookieTopMesh.receiveShadow = true;
    
    // Group the cookie parts
    cookieModel = new THREE.Group();
    cookieModel.add(new THREE.Mesh(cookieGeometry, cookieMaterial));
    cookieModel.add(cookieTopMesh);
    
    scene.add(cookieModel);
    
    // Add chocolate chips
    addChocolateChips(20);
    
    console.log('Fallback cookie created');
    
    // Hide loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Create heart-shaped geometry
function createHeartGeometry() {
    const shape = new THREE.Shape();
    
    // Heart shape path
    const x = 0, y = 0;
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 3.5, x - 6, y + 3.5);
    shape.bezierCurveTo(x - 6, y + 5.5, x - 4, y + 7.7, x, y + 10);
    shape.bezierCurveTo(x + 4, y + 7.7, x + 6, y + 5.5, x + 6, y + 3.5);
    shape.bezierCurveTo(x + 6, y + 3.5, x + 6, y, x + 5, y + 5);
    
    const extrudeSettings = {
        depth: 0.5,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Add chocolate chips to the cookie
function addChocolateChips(numChips = 15) {
    const chipGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const chipMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4A2C2A,
        shininess: 100,
        specular: 0x222222
    });
    
    // Add random chocolate chips
    for (let i = 0; i < numChips; i++) {
        const chip = new THREE.Mesh(chipGeometry, chipMaterial);
        
        // Random position on the cookie surface
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.5 + 0.3; // Keep chips within cookie bounds
        chip.position.x = Math.cos(angle) * radius;
        chip.position.y = 0.2 + Math.random() * 0.1; // Slightly above cookie surface
        chip.position.z = Math.sin(angle) * radius;
        
        // Random rotation for variety
        chip.rotation.x = Math.random() * Math.PI;
        chip.rotation.y = Math.random() * Math.PI;
        chip.rotation.z = Math.random() * Math.PI;
        
        chip.castShadow = true;
        chip.receiveShadow = true;
        scene.add(chip);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls (required for damping)
    if (controls) {
        controls.update();
    }
    
    // Update animations if mixer exists
    if (mixer) {
        mixer.update(0.016); // ~60fps
    }
    
    renderer.render(scene, camera);
}

// Control functions
function toggleAutoRotation() {
    if (controls) {
        controls.autoRotate = !controls.autoRotate;
        const btn = document.getElementById('rotateBtn');
        if (btn) {
            btn.textContent = controls.autoRotate ? '⏸️ Pausar' : '🔄 Auto Rotar';
            btn.style.background = controls.autoRotate ? 
                'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)' : 
                'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)';
        }
    }
}

function toggleZoom() {
    if (controls) {
        // Reset zoom to default distance
        controls.reset();
        const btn = document.getElementById('zoomBtn');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }
    }
}

function resetView() {
    if (controls) {
        controls.reset();
        const btn = document.getElementById('resetBtn');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }
    }
}

// NEW COOKIE PREVIEW SYSTEM - Simple and Robust
function createCookiePreview() {
    const cookieDisplay = document.getElementById('cookieDisplay');
    if (!cookieDisplay) return;
    
    // Clear existing content
    cookieDisplay.innerHTML = '';
    
    // Get form values
    const shape = document.getElementById('cookieShape')?.value || 'circle';
    const doughColor = document.getElementById('doughColor')?.value || '#D4AF37';
    const creamType = document.getElementById('creamType')?.value || 'none';
    const fillingType = document.getElementById('fillingType')?.value || 'none';
    const selectedToppings = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const toppingsQuantity = parseInt(document.getElementById('toppingsSlider')?.value || '10');
    
    // Create cookie shape
    const cookieShape = document.createElement('div');
    cookieShape.className = `cookie-shape ${shape}`;
    cookieShape.style.backgroundColor = doughColor;
    
    // Add cream layer if selected
    if (creamType !== 'none') {
        const creamLayer = document.createElement('div');
        creamLayer.className = `cream-layer ${creamType}`;
        cookieShape.appendChild(creamLayer);
    }
    
    // Add filling if selected
    if (fillingType !== 'none') {
        const fillingCenter = document.createElement('div');
        fillingCenter.className = `filling-center ${fillingType}`;
        cookieShape.appendChild(fillingCenter);
    }
    
    // Add toppings
    if (selectedToppings.length > 0) {
        const toppingsPerType = Math.max(1, Math.floor(toppingsQuantity / selectedToppings.length));
        
        selectedToppings.forEach(toppingType => {
            for (let i = 0; i < toppingsPerType; i++) {
                const topping = document.createElement('div');
                topping.className = `topping ${toppingType.replace('-', '-')}`;
                
                // Set color for sprinkles
                if (toppingType === 'sprinkles') {
                    const colors = ['#FF1493', '#00BFFF', '#FFD700', '#32CD32', '#FF4500', '#8A2BE2', '#FF6347'];
                    topping.style.backgroundColor = colors[i % colors.length];
                }
                
                // Random position
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 70 + 20; // Between 20% and 90% from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                topping.style.left = `calc(50% + ${x}px)`;
                topping.style.top = `calc(50% + ${y}px)`;
                topping.style.transform = 'translate(-50%, -50%)';
                
                cookieShape.appendChild(topping);
            }
        });
    }
    
    cookieDisplay.appendChild(cookieShape);
}

// Initialize customization controls
function initCustomizationControls() {
    const cookieShape = document.getElementById('cookieShape');
    const doughColor = document.getElementById('doughColor');
    const creamType = document.getElementById('creamType');
    const fillingType = document.getElementById('fillingType');
    const toppingCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const toppingsSlider = document.getElementById('toppingsSlider');
    const toppingsValue = document.getElementById('toppingsValue');
    const toppingsQuantity = document.getElementById('toppingsQuantity');
    const orderBtn = document.getElementById('orderBtn');

    // Cookie shape change
    if (cookieShape) {
        cookieShape.addEventListener('change', function() {
            createCookiePreview();
        });
    }

    // Dough color change
    if (doughColor) {
        doughColor.addEventListener('change', function() {
            createCookiePreview();
        });
    }

    // Cream type change
    if (creamType) {
        creamType.addEventListener('change', function() {
            createCookiePreview();
        });
    }

    // Filling type change
    if (fillingType) {
        fillingType.addEventListener('change', function() {
            createCookiePreview();
        });
    }

    // Toppings change
    toppingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateToppingsVisibility();
            createCookiePreview();
        });
    });

    // Toppings quantity slider
    if (toppingsSlider && toppingsValue) {
        toppingsSlider.addEventListener('input', function() {
            toppingsValue.textContent = this.value;
            createCookiePreview();
        });
    }

    // Order button
    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            placeOrder();
        });
    }

    // Initialize preview
    updateToppingsVisibility();
    createCookiePreview();
}

// Update toppings visibility based on checkboxes
function updateToppingsVisibility() {
    const toppingCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const toppingsQuantity = document.getElementById('toppingsQuantity');
    const hasSelectedToppings = Array.from(toppingCheckboxes).some(cb => cb.checked);
    
    if (toppingsQuantity) {
        toppingsQuantity.style.display = hasSelectedToppings ? 'block' : 'none';
    }
}

// Create star geometry
function createStarGeometry() {
    const starShape = new THREE.Shape();
    const outerRadius = 2;
    const innerRadius = 1;
    const spikes = 5;
    
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
            starShape.moveTo(x, y);
        } else {
            starShape.lineTo(x, y);
        }
    }
    starShape.closePath();
    
    const extrudeSettings = {
        depth: 0.5,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };
    
    return new THREE.ExtrudeGeometry(starShape, extrudeSettings);
}

// Note: The 3D model functions have been removed as the form no longer affects the 3D model
// The 3D model is now purely for display purposes

// Place order
function placeOrder() {
    const shape = document.getElementById('cookieShape')?.value || 'circle';
    const doughColor = document.getElementById('doughColor')?.value || '#D4AF37';
    const creamType = document.getElementById('creamType')?.value || 'none';
    const fillingType = document.getElementById('fillingType')?.value || 'none';
    const mainFlavor = document.getElementById('mainFlavor')?.value || 'vanilla';
    const selectedToppings = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const toppingsQuantity = parseInt(document.getElementById('toppingsSlider')?.value || '10');
    const glutenType = document.querySelector('input[name="gluten"]:checked')?.value || 'with-gluten';
    
    const orderDetails = {
        shape: shape,
        doughColor: doughColor,
        creamType: creamType,
        fillingType: fillingType,
        mainFlavor: mainFlavor,
        toppings: selectedToppings,
        toppingsQuantity: toppingsQuantity,
        glutenType: glutenType,
        timestamp: new Date().toISOString()
    };
    
    // Store order in localStorage
    localStorage.setItem('customCookieOrder', JSON.stringify(orderDetails));
    
    // Create order summary
    const toppingsText = selectedToppings.length > 0 ? 
        `${selectedToppings.join(', ')} (cantidad: ${toppingsQuantity})` : 
        'Sin toppings';
    const creamText = creamType !== 'none' ? creamType : 'Sin crema';
    const fillingText = fillingType !== 'none' ? fillingType : 'Sin relleno';
    const glutenText = glutenType === 'gluten-free' ? 'Sin gluten' : 'Con gluten';
    
    const orderSummary = `
¡Tu galleta personalizada ha sido agregada al pedido! 🍪

Detalles del pedido:
• Forma: ${shape}
• Color: ${doughColor}
• Sabor principal: ${mainFlavor}
• Crema: ${creamText}
• Relleno: ${fillingText}
• Toppings: ${toppingsText}
• Tipo: ${glutenText}
    `;
    
    // Show confirmation
    alert(orderSummary);
    
    console.log('Order placed:', orderDetails);
    
    // Optional: Redirect to checkout or show order confirmation page
    // window.location.href = 'checkout.html';
}

// Add personalized cookie to cart
function addPersonalizedToCart() {
    const shape = document.getElementById('cookieShape')?.value || 'circle';
    const doughColor = document.getElementById('doughColor')?.value || '#D4AF37';
    const creamType = document.getElementById('creamType')?.value || 'none';
    const fillingType = document.getElementById('fillingType')?.value || 'none';
    const mainFlavor = document.getElementById('mainFlavor')?.value || 'vanilla';
    const selectedToppings = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const toppingsQuantity = parseInt(document.getElementById('toppingsSlider')?.value || '10');
    const glutenType = document.querySelector('input[name="gluten"]:checked')?.value || 'with-gluten';
    
    // Calculate base price
    let basePrice = 3000; // Base price for personalized cookie
    
    // Add price for toppings
    const toppingPrices = {
        'chocolate-chips': 500,
        'nuts': 800,
        'sprinkles': 300,
        'coconut': 400
    };
    
    let toppingsPrice = 0;
    selectedToppings.forEach(topping => {
        toppingsPrice += toppingPrices[topping] || 0;
    });
    toppingsPrice *= Math.ceil(toppingsQuantity / 10); // Scale with quantity
    
    // Add price for cream
    const creamPrices = {
        'none': 0,
        'vanilla': 600,
        'chocolate': 700,
        'strawberry': 650,
        'caramel': 800
    };
    
    const creamPrice = creamPrices[creamType] || 0;
    
    // Add price for filling
    const fillingPrices = {
        'none': 0,
        'chocolate': 1000,
        'jam': 800,
        'cream': 900,
        'nutella': 1200
    };
    
    const fillingPrice = fillingPrices[fillingType] || 0;
    
    // Add price for gluten-free
    const glutenPrice = glutenType === 'gluten-free' ? 1000 : 0;
    
    // Calculate total price
    const totalPrice = basePrice + toppingsPrice + creamPrice + fillingPrice + glutenPrice;
    
    // Create product object for cart
    const personalizedCookie = {
        id: 'personalized-' + Date.now(), // Unique ID
        name: 'Galleta Personalizada',
        description: `Galleta ${shape} de ${mainFlavor} con ${selectedToppings.length > 0 ? selectedToppings.join(', ') : 'sin toppings'}${creamType !== 'none' ? `, crema de ${creamType}` : ''}${fillingType !== 'none' ? `, relleno de ${fillingType}` : ''}${glutenType === 'gluten-free' ? ', sin gluten' : ''}`,
        price: totalPrice,
        image: 'img/sabor1.png', // Default cookie image
        category: 'personalizada',
        customization: {
            shape: shape,
            doughColor: doughColor,
            creamType: creamType,
            fillingType: fillingType,
            mainFlavor: mainFlavor,
            toppings: selectedToppings,
            toppingsQuantity: toppingsQuantity,
            glutenType: glutenType
        }
    };
    
    // Add to cart using the global function
    if (typeof addToCart === 'function') {
        addToCart(personalizedCookie);
    } else {
        // Fallback: store in localStorage if cart manager not available
        const currentUser = localStorage.getItem('currentUser') || 'guest';
        const cartKey = `cart_${currentUser}`;
        const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        existingCart.push(personalizedCookie);
        localStorage.setItem(cartKey, JSON.stringify(existingCart));
        
        // Show success message
        alert('¡Galleta personalizada agregada al carrito! 🍪\n\nPrecio: $' + totalPrice.toLocaleString('es-CO'));
    }
}
