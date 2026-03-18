// ========== تهيئة المستخدمين ==========
if (!localStorage.getItem('nardoo_users')) {
    localStorage.setItem('nardoo_users', JSON.stringify([
        { 
            id: 1, 
            name: 'مدير النظام', 
            email: 'admin@nardoo.com', 
            password: 'admin123', 
            role: 'admin', 
            phone: '0562243648',
            merchantId: 'ADMIN_001',
            avatar: 'https://i.pravatar.cc/150?u=admin',
            createdAt: new Date().toISOString()
        }
    ]));
}

// ========== المتغيرات العامة ==========
let products = [];
let currentUser = null;
let cart = [];
let currentFilter = 'all';
let searchTerm = '';
let users = [];
let selectedImageFiles = [];

// ========== تحميل المستخدمين ==========
function loadUsers() {
    const saved = localStorage.getItem('nardoo_users');
    users = saved ? JSON.parse(saved) : [];
}
loadUsers();

// ========== تحميل المنتجات ==========
async function loadProducts() {
    if (window.TelegramAPI) {
        products = await TelegramAPI.fetchProducts();
    } else {
        products = JSON.parse(localStorage.getItem('nardoo_products') || '[]');
    }
    displayProducts();
}

// ========== عرض المنتجات مع التوقيت ==========
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
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:80px 20px;">
                <i class="fas fa-box-open" style="font-size:80px; color:var(--gold); margin-bottom:20px;"></i>
                <h3 style="color:var(--gold);">لا توجد منتجات</h3>
                ${currentUser?.role === 'admin' || currentUser?.role === 'merchant_approved' ? 
                    '<button class="btn-gold" onclick="openAddProductModal()"><i class="fas fa-plus"></i> إضافة منتج جديد</button>' : 
                    '<p>سجل دخول كتاجر لإضافة منتجات</p>'}
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(product => {
        const mainImage = product.images && product.images.length > 0 ? product.images[0] : 
                         (product.image || 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300');
        
        return `
        <div class="product-card" onclick="showProductDetail('${product.productId || product.id}')">
            <div class="product-time-badge">
                <i class="far fa-clock"></i> ${product.dateStr || 'جديد'}
            </div>
            <div class="product-gallery">
                <img src="${mainImage}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300'">
                ${product.images && product.images.length > 1 ? 
                    `<span class="image-counter"><i class="fas fa-images"></i> ${product.images.length}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category === 'promo' ? 'برموسيو' : product.category === 'spices' ? 'توابل' : product.category === 'cosmetic' ? 'كوسمتيك' : 'أخرى'}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-merchant-info">
                    <i class="fas fa-store"></i> ${product.merchantName || product.merchant}
                    <small style="color:var(--gold-light);">(${product.merchantId || 'ADMIN_001'})</small>
                </div>
                <div class="product-price">${product.price.toLocaleString()} <small>دج</small></div>
                <div class="product-stock ${product.stock <= 0 ? 'out-of-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}">
                    ${product.stock <= 0 ? 'غير متوفر' : product.stock < 5 ? `كمية محدودة (${product.stock})` : `متوفر (${product.stock})`}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.productId || product.id}')" ${product.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
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
    const product = products.find(p => (p.productId == productId || p.id == productId));
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
            productId: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            merchantName: product.merchantName || product.merchant,
            image: product.images ? product.images[0] : product.image
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
                <div class="cart-item-image">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300'}" style="width:50px; height:50px; object-fit:cover; border-radius:10px;">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} دج</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartItem('${item.productId}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItem('${item.productId}', ${item.quantity + 1})">+</button>
                        <button class="quantity-btn" onclick="removeFromCart('${item.productId}')" style="background:#f87171; color:white;"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    totalSpan.textContent = `${total.toLocaleString()} دج`;
}

function updateCartItem(productId, newQuantity) {
    const item = cart.find(i => i.productId == productId);
    const product = products.find(p => p.productId == productId || p.id == productId);
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
        customer: currentUser?.name || 'عميل',
        phone: currentUser?.phone || '',
        items: cart,
        total: total + 800
    };

    let message = '🛍️ طلب جديد:\n\n';
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity}) = ${item.price * item.quantity} دج\n`;
    });
    message += `\n💰 المجموع: ${total + 800} دج`;
    
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
        location.reload();
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
        name, 
        email, 
        password, 
        phone,
        role: isMerchant ? 'merchant_pending' : 'user',
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        createdAt: new Date().toISOString()
    };

    if (isMerchant) {
        newUser.storeName = document.getElementById('storeName').value;
        newUser.merchantCategory = document.getElementById('merchantCategory').value;
        newUser.merchantLevel = document.getElementById('merchantLevel').value;
    }

    users.push(newUser);
    localStorage.setItem('nardoo_users', JSON.stringify(users));
    showNotification('تم التسجيل بنجاح', 'success');
    switchAuthTab('login');
}

// ========== رفع الصور المتعددة ==========
function handleImageUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.display = 'inline-block';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '×';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '5px';
            removeBtn.style.right = '5px';
            removeBtn.style.background = 'var(--red)';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '50%';
            removeBtn.style.width = '25px';
            removeBtn.style.height = '25px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.onclick = function() {
                imgContainer.remove();
                selectedImageFiles = selectedImageFiles.filter(f => f !== file);
            };
            
            imgContainer.appendChild(img);
            imgContainer.appendChild(removeBtn);
            preview.appendChild(imgContainer);
            
            selectedImageFiles.push(file);
        };
        
        reader.readAsDataURL(file);
    }
}

function openAddProductModal() {
    if (!currentUser) {
        showNotification('يجب تسجيل الدخول أولاً', 'error');
        openLoginModal();
        return;
    }
    
    if (currentUser.role === 'admin' || currentUser.role === 'merchant_approved') {
        selectedImageFiles = [];
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('productModal').classList.add('show');
    } else {
        showNotification('فقط المدير والتجار يمكنهم إضافة منتجات', 'error');
    }
}

// ========== عرض تفاصيل المنتج مع صور متعددة ==========
async function showProductDetail(productIdentifier) {
    let product;
    if (window.TelegramAPI) {
        const products = await TelegramAPI.fetchProducts();
        product = products.find(p => p.productId === productIdentifier || p.id == productIdentifier);
    }
    
    if (!product) return;
    
    const images = product.images && product.images.length > 0 ? product.images : 
                   [product.image || 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300'];
    
    let galleryHTML = '';
    if (images.length > 1) {
        galleryHTML = `
            <div class="product-gallery-container">
                <div class="product-main-image">
                    <img src="${images[0]}" id="mainProductImage" style="width:100%; border-radius:20px; border:3px solid var(--gold);">
                </div>
                <div class="product-thumbnails" style="display:flex; gap:10px; margin-top:15px; flex-wrap:wrap;">
                    ${images.map((img, index) => `
                        <img src="${img}" onclick="document.getElementById('mainProductImage').src='${img}'" 
                             style="width:60px; height:60px; object-fit:cover; border-radius:10px; border:2px solid var(--gold); cursor:pointer; ${index === 0 ? 'opacity:1;' : 'opacity:0.7;'}"
                             onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='${index === 0 ? '1' : '0.7'}'">
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        galleryHTML = `<img src="${images[0]}" style="width:100%; border-radius:20px; border:3px solid var(--gold);">`;
    }
    
    document.getElementById('productDetailContent').innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
            <div>${galleryHTML}</div>
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <span class="product-category">${product.category === 'promo' ? 'برموسيو' : product.category === 'spices' ? 'توابل' : product.category === 'cosmetic' ? 'كوسمتيك' : 'أخرى'}</span>
                    <span style="background:var(--glass); padding:5px 15px; border-radius:20px; font-size:14px;">
                        <i class="far fa-clock"></i> ${product.dateStr || 'جديد'}
                    </span>
                </div>
                <h2 style="color:var(--gold); margin-bottom:20px; font-size:28px;">${product.name}</h2>
                <p style="margin-bottom:20px;">${product.description || 'منتج عالي الجودة'}</p>
                <div style="background:var(--glass); padding:15px; border-radius:15px; margin-bottom:20px;">
                    <p style="margin-bottom:10px;"><i class="fas fa-store"></i> ${product.merchantName || product.merchant}</p>
                    <p style="margin-bottom:5px; color:var(--gold-light);">🆔 معرف التاجر: ${product.merchantId || 'ADMIN_001'}</p>
                    <p style="margin-bottom:5px;">🆔 معرف المنتج: ${product.productId}</p>
                </div>
                <div style="font-size:36px; color:var(--gold); font-weight:800; margin-bottom:20px;">${product.price.toLocaleString()} <small style="font-size:16px;">دج</small></div>
                <div style="margin-bottom:20px;">
                    <span class="product-stock ${product.stock <= 0 ? 'out-of-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}">
                        ${product.stock <= 0 ? 'غير متوفر' : product.stock < 5 ? `كمية محدودة (${product.stock})` : `متوفر (${product.stock})`}
                    </span>
                </div>
                <div style="display:flex; gap:15px;">
                    <button class="btn-gold" style="flex:2;" onclick="addToCart('${product.productId || product.id}'); closeModal('productDetailModal');">
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                    <button class="btn-outline-gold" style="flex:1;" onclick="closeModal('productDetailModal')">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    `;
    openModal('productDetailModal');
}

// ========== حفظ المنتج مع الصور المتعددة ==========
async function saveProduct() {
    if (!currentUser) {
        showNotification('يجب تسجيل الدخول أولاً', 'error');
        return;
    }

    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value
    };

    if (window.TelegramAPI) {
        showNotification('جاري رفع المنتج والصور...', 'info');
        
        const result = await TelegramAPI.addProduct(product, currentUser, selectedImageFiles);
        
        if (result.success) {
            showNotification(`✅ تم إضافة المنتج مع ${result.images.length} صور`, 'success');
            closeModal('productModal');
            document.getElementById('productForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            selectedImageFiles = [];
        } else {
            showNotification('❌ فشل إضافة المنتج', 'error');
        }
    } else {
        product.id = Date.now();
        product.images = ['https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300'];
        product.merchantName = currentUser.name;
        product.merchantId = currentUser.merchantId || 'ADMIN_001';
        product.dateStr = 'الآن';
        product.rating = 4.5;
        
        products.push(product);
        localStorage.setItem('nardoo_products', JSON.stringify(products));
        closeModal('productModal');
        displayProducts();
        showNotification('تم حفظ المنتج محلياً', 'success');
    }
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
        content = '<h3 style="color:var(--gold); margin-bottom:20px;">المنتجات</h3>';
        products.forEach(p => {
            content += `<p>${p.name} - ${p.price} دج - ${p.merchantName} - ${p.productId}</p>`;
        });
    } else if (tab === 'users') {
        content = '<h3 style="color:var(--gold); margin-bottom:20px;">المستخدمين</h3>';
        users.forEach(u => {
            content += `<p>${u.name} - ${u.role} - ${u.merchantId || ''}</p>`;
        });
    } else if (tab === 'merchants') {
        const pending = users.filter(u => u.role === 'merchant_pending');
        content = '<h3 style="color:var(--gold); margin-bottom:20px;">طلبات التجار</h3>';
        if (pending.length === 0) {
            content += '<p>لا توجد طلبات جديدة</p>';
        } else {
            pending.forEach(u => {
                content += `
                    <div style="background:var(--glass); padding:15px; border-radius:15px; margin:10px 0;">
                        <p><strong>${u.name}</strong> - ${u.email}</p>
                        <p>متجر: ${u.storeName || 'غير محدد'}</p>
                        <button class="btn-gold" onclick="approveMerchant(${u.id})">موافقة</button>
                        <button class="btn-outline-gold" onclick="rejectMerchant(${u.id})">رفض</button>
                    </div>
                `;
            });
        }
    }
    document.getElementById('dashboardContent').innerHTML = content;
}

function approveMerchant(userId) {
    const user = users.find(u => u.id == userId);
    if (user) {
        user.role = 'merchant_approved';
        if (!user.merchantId) {
            user.merchantId = `MERCH_${1000 + users.length}`;
        }
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
