// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Dell XPS 15",
        category: "laptops",
        brand: "dell",
        specs: "Intel i7, 16GB RAM, 512GB SSD",
        price: 1599,
        badge: "Best Seller",
        icon: "fa-laptop"
    },
    {
        id: 2,
        name: "HP Pavilion 15",
        category: "laptops",
        brand: "hp",
        specs: "Intel i5, 8GB RAM, 256GB SSD",
        price: 899,
        badge: "",
        icon: "fa-laptop"
    },
    {
        id: 3,
        name: "Asus ROG Strix",
        category: "laptops",
        brand: "asus",
        specs: "Intel i9, 32GB RAM, 1TB SSD, RTX 4070",
        price: 2199,
        badge: "Gaming",
        icon: "fa-laptop"
    },
    {
        id: 4,
        name: "MacBook Pro 14",
        category: "laptops",
        brand: "apple",
        specs: "M3 Pro, 18GB RAM, 512GB SSD",
        price: 1999,
        badge: "Premium",
        icon: "fa-laptop"
    },
    {
        id: 5,
        name: "Lenovo ThinkPad X1",
        category: "laptops",
        brand: "lenovo",
        specs: "Intel i7, 16GB RAM, 512GB SSD",
        price: 1499,
        badge: "",
        icon: "fa-laptop"
    },
    {
        id: 6,
        name: "Dell OptiPlex 7080",
        category: "desktops",
        brand: "dell",
        specs: "Intel i7, 16GB RAM, 512GB SSD",
        price: 999,
        badge: "",
        icon: "fa-desktop"
    },
    {
        id: 7,
        name: "HP Envy Desktop",
        category: "desktops",
        brand: "hp",
        specs: "Intel i5, 8GB RAM, 1TB HDD",
        price: 699,
        badge: "Value",
        icon: "fa-desktop"
    },
    {
        id: 8,
        name: "Asus ROG gaming PC",
        category: "desktops",
        brand: "asus",
        specs: "AMD Ryzen 9, 64GB RAM, 2TB SSD, RTX 4080",
        price: 2999,
        badge: "Gaming",
        icon: "fa-desktop"
    },
    {
        id: 9,
        name: "Intel Core i9-13900K",
        category: "components",
        brand: "intel",
        specs: "24 Cores, 5.8GHz Boost",
        price: 589,
        badge: "New",
        icon: "fa-microchip"
    },
    {
        id: 10,
        name: "NVIDIA RTX 4070",
        category: "components",
        brand: "nvidia",
        specs: "12GB GDDR6X, Ray Tracing",
        price: 599,
        badge: "Popular",
        icon: "fa-microchip"
    },
    {
        id: 11,
        name: "Mechanical Keyboard",
        category: "accessories",
        brand: "logitech",
        specs: "RGB, Cherry MX Blue",
        price: 129,
        badge: "",
        icon: "fa-keyboard"
    },
    {
        id: 12,
        name: "Logitech MX Master 3",
        category: "accessories",
        brand: "logitech",
        specs: "Wireless, Ergonomic",
        price: 99,
        badge: "Best Seller",
        icon: "fa-mouse"
    }
];

// ===== Cart State =====
let cart = JSON.parse(localStorage.getItem('techkh_cart')) || [];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Check if on shopping page
    if (document.getElementById('products-grid')) {
        loadProducts();
        setupFilters();
        setupSort();
    }
});

// ===== Product Functions =====
function loadProducts(filter = {}, sort = 'default') {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    let filteredProducts = [...products];
    
    // Apply filters
    if (filter.category && filter.category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filter.category);
    }
    
    if (filter.price) {
        const [min, max] = filter.price.split('-').map(v => v === '+' ? Infinity : parseInt(v));
        filteredProducts = filteredProducts.filter(p => {
            if (max === undefined) return p.price >= min;
            return p.price >= min && p.price <= max;
        });
    }
    
    if (filter.brand && filter.brand !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.brand === filter.brand);
    }
    
    // Apply sorting
    switch (sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    // Update count
    const countEl = document.getElementById('product-count');
    if (countEl) {
        countEl.textContent = `បង្ហាញ ${filteredProducts.length} ទំនិញ`;
    }
    
    // Render products
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-specs">${product.specs}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toLocaleString()}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> ទិញ
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-light);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 16px;"></i>
                <p>រកមិនឃើញទំនិញទេ</p>
            </div>
        `;
    }
}

function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featured = products.slice(0, 4);
    
    container.innerHTML = featured.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-specs">${product.specs}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toLocaleString()}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> ទិញ
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const names = {
        'laptops': 'កុំព្យូទ័រយួន',
        'desktops': 'កុំព្យូទ័រតុ',
        'components': 'គ្រឿងបង្គុំ',
        'accessories': 'គ្រឿងបន្ថែម'
    };
    return names[category] || category;
}

// ===== Filter Functions =====
function setupFilters() {
    const filterLinks = document.querySelectorAll('.filter-link');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Get filter values
            const category = document.querySelector('.filter-link[data-category].active')?.dataset.category || 'all';
            const price = document.querySelector('.filter-link[data-price].active')?.dataset.price || 'all';
            const brand = document.querySelector('.filter-link[data-brand].active')?.dataset.brand || 'all';
            
            const sort = document.getElementById('sort-select')?.value || 'default';
            
            loadProducts({ category, price, brand }, sort);
        });
    });
}

function setupSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const category = document.querySelector('.filter-link[data-category].active')?.dataset.category || 'all';
            const price = document.querySelector('.filter-link[data-price].active')?.dataset.price || 'all';
            const brand = document.querySelector('.filter-link[data-brand].active')?.dataset.brand || 'all';
            
            loadProducts({ category, price, brand }, sortSelect.value);
        });
    }
}

// ===== Cart Functions =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    
    // Show feedback
    const btn = document.querySelector(`[data-id="${productId}"] .add-to-cart`);
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> បានបន្ថែម';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 1000);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    loadOrderSummary();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        renderCart();
        loadOrderSummary();
    }
}

function saveCart() {
    localStorage.setItem('techkh_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// ===== Cart Modal =====
function openCart() {
    renderCart();
    document.getElementById('cart-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>រទះទំនេញទទេ</p>
                <a href="shopping.html" class="btn btn-primary" style="margin-top: 16px;">ទៅទិញទំនេញ</a>
            </div>
        `;
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">$${item.price.toLocaleString()}</p>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <span class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> លុប
                </span>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
}

// ===== Payment Functions =====
function loadOrderSummary() {
    const itemsContainer = document.getElementById('order-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const grandTotalEl = document.getElementById('grand-total');
    
    if (!itemsContainer) return;
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-light);">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 16px;"></i>
                <p>គ្មានទំនេញក្នុងរទះ</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (shippingEl) shippingEl.textContent = '$0.00';
        if (grandTotalEl) grandTotalEl.textContent = '$0.00';
        return;
    }
    
    itemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="order-item-info">
                <p class="order-item-name">${item.name}</p>
                <p class="order-item-qty">ចំនួន: ${item.quantity}</p>
            </div>
            <p class="order-item-price">$${(item.price * item.quantity).toLocaleString()}</p>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 25; // Free shipping over $500
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'ឥតគិតថ្លៃ' : `$${shipping}`;
    if (grandTotalEl) grandTotalEl.textContent = `$${(subtotal + shipping).toLocaleString()}`;
}

// ===== Checkout Form =====
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            document.getElementById('empty-cart-modal').classList.add('active');
            return;
        }
        
        // Generate order ID
        const orderId = 'TK' + Date.now().toString().slice(-8);
        document.getElementById('order-id').textContent = orderId;
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Show success modal
        document.getElementById('success-modal').classList.add('active');
    });
}

// Close modals
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal && cartModal.classList.contains('active')) {
        if (!cartModal.querySelector('.cart-content').contains(e.target) && 
            !e.target.closest('.cart-icon')) {
            closeCart();
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        closeCart();
    }
});
