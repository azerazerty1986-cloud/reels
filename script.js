// ========== المتغيرات العامة ==========
let products = [];
let currentUser = null;
let cart = [];
let currentFilter = 'all';
let searchTerm = '';
let users = [];

// ========== تحميل المستخدمين ==========
function loadUsers() {
    const saved = localStorage.getItem('nardoo_users');
    if (saved) {
        users = JSON.parse(saved);
    } else {
        users = [
            { id: 1, name: 'مدير النظام', email: 'admin@nardoo.com', password: 'admin123', role: 'admin', phone: '0562243648' }
        ];
        localStorage.setItem('nardoo_users', JSON.stringify(users));
    }
}
loadUsers();

// ========== تحميل المنتجات ==========
async function loadProducts() {
    // محاولة جلب من تلغرام أولاً
    if (window.TelegramAPI) {
        products = await TelegramAPI.fetchProducts();
    } else {
        // منتجات افتراضية
        products = [
            { id: 1, name: 'زعتر فلسطيني', price: 500, category: 'spices', stock: 50, merchantName: 'المتجر', rating: 4.5, image: 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300', createdAt: new Date().toISOString() },
            { id: 2, name: 'كريم ترطيب', price: 1200, category: 'cosmetic', stock: 30, merchantName: 'المتجر', rating: 4.5, image: 'https://images.unsplash.com/photo-1596040033229-a9821e1929c7?w=300', createdAt: new Date().toISOString() },
            { id: 3, name: 'بخور عود', price: 1500, category: 'other', stock: 15, merchantName: 'المتجر', rating: 4.5, image: 'https://images.unsplash.com/photo-1608571423912-8a4c8a8c9b9a?w=300', createdAt: new Date().toISOString() }
        ];
    }
    displayProducts();
}

// ========== عرض المنتجات ==========
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    let filtered = products.filter(p => p.stock > 0);
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }

    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:80px 20px;"><i class="fas fa-box-open" style="font-size:80px; color:var(--gold); margin-bottom:20px;"></i><h3 style="color:var(--gold);">لا توجد منتجات</h3></div>';
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-gallery">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300'">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category === 'promo' ? 'برموسيو' : product.category === 'spices' ? 'توابل' : product.category === 'cosmetic' ? 'كوسمتيك' : 'أخرى'}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-merchant-info"><i class="fas fa-store"></i> ${product.merchantName}</div>
                <div class="product-price">${product.price.toLocaleString()} <small>دج</small></div>
                <div class="product-stock ${product.stock <= 0 ? 'out-of-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}">
                    ${product.stock <= 0 ? 'غير متوفر' : product.stock < 5 ? `كمية محدودة (${product.stock})` : `متوفر (${product.stock})`}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== دوال التصفية ==========
function filterProducts(category) {
    currentFilter = category;
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    displayProducts();
}

function searchProducts() {
    searchTerm = document.getElementById('searchInput').value;
    displayProducts();
}

// ========== إدارة السلة ==========
function loadCart() {
    const saved = localStorage.getItem('nardoo_cart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartCounter();
}

function saveCart() {
    localStorage.setItem('nardoo_cart', JSON.stringify(cart));
}

function updateCartCounter() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCounter').textContent = count;
    document.getElementById('fixedCartCounter').textContent = count;
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (!product || product.stock <= 0) {
        showNotification('المنتج غير متوفر', 'error');
        return;
    }

    const existing = cart.find(item => item.productId == productId);
    if (existing) {
        if (existing.quantity < product.stock) {
            existing.quantity++;
        } else {
            showNotification('الكمية غير كافية', 'warning');
            return;
        }
    } else {
        cart.push({
            productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            merchantName: product.merchantName
        });
    }

    saveCart();
    updateCartCounter();
    updateCartDisplay();
    showNotification('تمت الإضافة إلى السلة', 'success');
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    updateCartDisplay();
}

function updateCartDisplay() {
    const itemsDiv = document.getElementById('cartItems');
    const totalSpan = document.getElementById('cartTotal');

    if (cart.length === 0) {
        itemsDiv.innerHTML = '<div style="text-align:center; padding:40px;">السلة فارغة</div>';
        totalSpan.textContent = '0 دج';
        return;
    }

    let total = 0;
    itemsDiv.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} دج</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartItem(${item.productId}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItem(${item.productId}, ${item.quantity + 1})">+</button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.productId})" style="background:#f87171; color:white;"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    totalSpan.textContent = `${total.toLocaleString()} دج`;
}

function updateCartItem(productId, newQuantity) {
    const item = cart.find(i => i.productId == productId);
    const product = products.find(p => p.id == productId);
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    if (newQuantity > product.stock) {
        showNotification('الكمية غير متوفرة', 'warning');
        return;
    }
    item.quantity = newQuantity;
    saveCart();
    updateCartCounter();
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.productId != productId);
    saveCart();
    updateCartCounter();
    updateCartDisplay();
    showNotification('تمت الإزالة من السلة', 'info');
}

async function checkoutCart() {
    if (cart.length === 0) {
        showNotification('السلة فارغة', 'warning');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = {
        customerName: currentUser?.name || 'عميل',
        customerPhone: currentUser?.phone || '',
        items: cart,
        total: total + 800 // مع الشحن
    };

    // إرسال إلى تلغرام إذا كان متاحاً
    if (window.TelegramAPI) {
        await TelegramAPI.sendOrder(order);
    }

    // إرسال واتساب
    let message = '🛍️ طلب جديد:\n\n';
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity}) = ${item.price * item.quantity} دج\n`;
    });
    message += `\n💰 المجموع: ${total + 800} دج (شامل الشحن)`;
    
    window.open(`https://wa.me/213562243648?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('تم التوجيه إلى واتساب', 'success');
}

// ========== النوافذ ==========
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function openLoginModal() {
    switchAuthTab('login');
    openModal('loginModal');
}

function switchAuthTab(tab) {
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
}

function toggleMerchantFields() {
    document.getElementById('merchantFields').style.display = 
        document.getElementById('isMerchant').checked ? 'block' : 'none';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => (u.email === email || u.name === email) && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        closeModal('loginModal');
        document.getElementById('userBtn').innerHTML = '<i class="fas fa-user-check"></i>';
        
        if (user.role === 'admin') {
            document.getElementById('dashboardBtn').style.display = 'flex';
            document.getElementById('adminAppsNav').style.display = 'flex';
        }
        
        showNotification(`مرحباً ${user.name}`, 'success');
    } else {
        showNotification('بيانات غير صحيحة', 'error');
    }
}

async function handleRegister() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const isMerchant = document.getElementById('isMerchant').checked;

    if (!name || !email || !password) {
        showNotification('الرجاء ملء جميع الحقول', 'error');
        return;
    }

    if (users.find(u => u.email === email)) {
        showNotification('البريد مستخدم بالفعل', 'error');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name, email, password, phone,
        role: isMerchant ? 'merchant_pending' : 'user',
        createdAt: new Date().toISOString()
    };

    if (isMerchant) {
        newUser.storeName = document.getElementById('storeName').value;
        newUser.merchantCategory = document.getElementById('merchantCategory').value;
        newUser.merchantLevel = document.getElementById('merchantLevel').value;
        
        // إرسال طلب تاجر إلى تلغرام
        if (window.TelegramAPI) {
            await TelegramAPI.sendMerchantRequest(newUser);
        }
    }

    users.push(newUser);
    localStorage.setItem('nardoo_users', JSON.stringify(users));
    showNotification('تم التسجيل بنجاح', 'success');
    switchAuthTab('login');
}

// ========== تفاصيل المنتج ==========
function showProductDetail(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    document.getElementById('productDetailContent').innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
            <div><img src="${product.image}" style="width:100%; border-radius:20px; border:3px solid var(--gold);"></div>
            <div>
                <h2 style="color:var(--gold); margin-bottom:20px;">${product.name}</h2>
                <p style="margin-bottom:20px;">منتج عالي الجودة من ${product.merchantName}</p>
                <div style="font-size:32px; color:var(--gold); margin-bottom:20px;">${product.price} دج</div>
                <div style="margin-bottom:20px;">المتبقي: ${product.stock} قطعة</div>
                <button class="btn-gold" onclick="addToCart(${product.id}); closeModal('productDetailModal');">أضف للسلة</button>
                <button class="btn-outline-gold" onclick="closeModal('productDetailModal')" style="margin-right:10px;">إغلاق</button>
            </div>
        </div>
    `;
    openModal('productDetailModal');
}

// ========== رفع الصور ==========
function handleImageUpload(event) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    for (let file of event.target.files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML += `<img src="${e.target.result}" class="preview-image">`;
        };
        reader.readAsDataURL(file);
    }
}

// ========== حفظ المنتج ==========
async function saveProduct() {
    if (!currentUser) {
        showNotification('يجب تسجيل الدخول أولاً', 'error');
        return;
    }

    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image: 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300',
        merchantName: currentUser.name,
        rating: 4.5,
        createdAt: new Date().toISOString()
    };

    // إضافة إلى تلغرام
    if (window.TelegramAPI) {
        await TelegramAPI.addProduct(product);
    }

    products.push(product);
    localStorage.setItem('nardoo_products', JSON.stringify(products));
    closeModal('productModal');
    displayProducts();
    showNotification('تم حفظ المنتج', 'success');
}

// ========== لوحة التحكم ==========
function openDashboard() {
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('غير مصرح', 'error');
        return;
    }
    document.getElementById('dashboardSection').style.display = 'block';
    switchDashboardTab('overview');
}

function switchDashboardTab(tab) {
    document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    let content = '';
    if (tab === 'overview') {
        const merchants = users.filter(u => u.role === 'merchant_approved').length;
        const pending = users.filter(u => u.role === 'merchant_pending').length;
        content = `
            <h3 style="color:var(--gold); margin-bottom:20px;">نظرة عامة</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px;">
                <div style="background:var(--glass); padding:20px; border-radius:20px; text-align:center;">
                    <i class="fas fa-users" style="font-size:40px; color:var(--gold);"></i>
                    <h4>المستخدمين</h4>
                    <p style="font-size:24px;">${users.length}</p>
                </div>
                <div style="background:var(--glass); padding:20px; border-radius:20px; text-align:center;">
                    <i class="fas fa-store" style="font-size:40px; color:var(--gold);"></i>
                    <h4>التجار</h4>
                    <p style="font-size:24px;">${merchants}</p>
                </div>
                <div style="background:var(--glass); padding:20px; border-radius:20px; text-align:center;">
                    <i class="fas fa-clock" style="font-size:40px; color:var(--gold);"></i>
                    <h4>طلبات تجار</h4>
                    <p style="font-size:24px;">${pending}</p>
                </div>
                <div style="background:var(--glass); padding:20px; border-radius:20px; text-align:center;">
                    <i class="fas fa-box" style="font-size:40px; color:var(--gold);"></i>
                    <h4>المنتجات</h4>
                    <p style="font-size:24px;">${products.length}</p>
                </div>
            </div>
        `;
    } else if (tab === 'products') {
        content = '<h3>المنتجات</h3>' + products.map(p => `<p>${p.name} - ${p.price} دج</p>`).join('');
    } else if (tab === 'users') {
        content = '<h3>المستخدمين</h3>' + users.map(u => `<p>${u.name} - ${u.role}</p>`).join('');
    } else if (tab === 'merchants') {
        const pending = users.filter(u => u.role === 'merchant_pending');
        content = '<h3>طلبات التجار</h3>' + pending.map(u => `
            <div style="background:var(--glass); padding:15px; border-radius:15px; margin:10px 0;">
                <p><strong>${u.name}</strong> - ${u.email}</p>
                <p>متجر: ${u.storeName || 'غير محدد'}</p>
                <button class="btn-gold" onclick="approveMerchant(${u.id})">موافقة</button>
                <button class="btn-outline-gold" onclick="rejectMerchant(${u.id})">رفض</button>
            </div>
        `).join('');
    }
    document.getElementById('dashboardContent').innerHTML = content;
}

function approveMerchant(userId) {
    const user = users.find(u => u.id == userId);
    if (user) {
        user.role = 'merchant_approved';
        localStorage.setItem('nardoo_users', JSON.stringify(users));
        showNotification('تمت الموافقة على التاجر', 'success');
        switchDashboardTab('merchants');
    }
}

function rejectMerchant(userId) {
    const user = users.find(u => u.id == userId);
    if (user) {
        user.role = 'user';
        localStorage.setItem('nardoo_users', JSON.stringify(users));
        showNotification('تم رفض طلب التاجر', 'info');
        switchDashboardTab('merchants');
    }
}

// ========== إدارة التطبيقات ==========
function openAdminApps() {
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('غير مصرح', 'error');
        return;
    }
    const apps = [
        { name: 'سناب شات', file: 'snam.html', icon: 'fab fa-snapchat' },
        { name: 'تيك توك', file: 'tikm.html', icon: 'fab fa-tiktok' },
        { name: 'ريلز', file: 'reels.html', icon: 'fas fa-film' }
    ];
    
    document.getElementById('adminAppsContent').innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px,1fr)); gap:20px;">
            ${apps.map(app => `
                <div style="background:var(--glass); border:2px solid var(--gold); border-radius:20px; padding:20px; text-align:center;">
                    <i class="${app.icon}" style="font-size:40px; color:var(--gold); margin-bottom:15px;"></i>
                    <h3>${app.name}</h3>
                    <p style="margin:15px 0;">${app.file}</p>
                    <button class="btn-gold" onclick="runApp('${app.file}', '${app.name}')">تشغيل</button>
                </div>
            `).join('')}
        </div>
    `;
    openModal('adminAppsModal');
}

function runApp(file, name) {
    document.getElementById('appRunnerName').textContent = name;
    document.getElementById('appRunnerFrame').src = file;
    closeModal('adminAppsModal');
    openModal('appRunnerModal');
}

function refreshApp() {
    const frame = document.getElementById('appRunnerFrame');
    frame.src = frame.src;
    showNotification('تم التحديث', 'success');
}

// ========== دوال مساعدة ==========
function showNotification(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const toggle = document.getElementById('themeToggle');
    toggle.innerHTML = toggle.innerHTML.includes('moon') ? 
        '<i class="fas fa-sun"></i><span>نهاري</span>' : 
        '<i class="fas fa-moon"></i><span>ليلي</span>';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ========== تأثير الكتابة ==========
function startTypingEffect() {
    const texts = ['نكهة وجمال', 'ناردو برو', 'تسوق آمن', 'جودة عالية'];
    let index = 0, charIndex = 0;
    const element = document.getElementById('typing-text');
    
    function type() {
        if (charIndex < texts[index].length) {
            element.textContent += texts[index].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }
    
    function erase() {
        if (element.textContent.length > 0) {
            element.textContent = element.textContent.slice(0, -1);
            setTimeout(erase, 50);
        } else {
            index = (index + 1) % texts.length;
            charIndex = 0;
            setTimeout(type, 500);
        }
    }
    type();
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('marqueeHours').textContent = now.getHours().toString().padStart(2, '0');
        document.getElementById('marqueeMinutes').textContent = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('marqueeSeconds').textContent = now.getSeconds().toString().padStart(2, '0');
    }, 1000);
}

// ========== التهيئة ==========
window.onload = function() {
    loadProducts();
    loadCart();
    startTypingEffect();
    startClock();
    
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('userBtn').innerHTML = '<i class="fas fa-user-check"></i>';
        if (currentUser.role === 'admin') {
            document.getElementById('dashboardBtn').style.display = 'flex';
            document.getElementById('adminAppsNav').style.display = 'flex';
        }
    }

    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    }, 1000);
};

window.onscroll = function() {
    const btn = document.getElementById('quickTopBtn');
    btn.classList.toggle('show', window.scrollY > 300);
};

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
};
