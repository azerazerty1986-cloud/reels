// ========== نظام تلغرام المتكامل مع المعرفات الثابتة ==========
const TELEGRAM = {
    botToken: '8576673096:AAEFKd-YSJcW_0d_wAHZBt-5nPg_VOjDX_0',
    channelId: '-1003822964890',
    adminId: '7461896689',
    apiUrl: 'https://api.telegram.org/bot'
};

// ========== 1. نظام المعرفات الثابتة ==========
const ID_SYSTEM = {
    ADMIN_ID: 'ADMIN_001',
    ADMIN_NAME: 'مدير النظام',
    
    merchantCounter: 1000,
    userCounter: 5000,
    productCounter: 1,
    
    generateMerchantId() {
        this.merchantCounter++;
        this.saveCounters();
        return `MERCH_${this.merchantCounter}`;
    },
    
    generateUserId() {
        this.userCounter++;
        this.saveCounters();
        return `USER_${this.userCounter}`;
    },
    
    generateProductId() {
        this.productCounter++;
        this.saveCounters();
        return `PROD_${this.productCounter.toString().padStart(6, '0')}`;
    },
    
    saveCounters() {
        localStorage.setItem('id_counters', JSON.stringify({
            merchantCounter: this.merchantCounter,
            userCounter: this.userCounter,
            productCounter: this.productCounter
        }));
    },
    
    loadCounters() {
        const saved = localStorage.getItem('id_counters');
        if (saved) {
            const counters = JSON.parse(saved);
            this.merchantCounter = counters.merchantCounter || 1000;
            this.userCounter = counters.userCounter || 5000;
            this.productCounter = counters.productCounter || 1;
        }
    }
};

ID_SYSTEM.loadCounters();

// ========== 2. جلب جميع المنتجات من تلغرام ==========
async function fetchProductsFromTelegram() {
    try {
        console.log('🔄 جلب المنتجات من تلغرام...');
        
        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates`);
        const data = await response.json();
        
        const products = [];
        
        if (data.ok && data.result) {
            const updates = data.result.slice(-200);
            
            for (const update of updates) {
                if (update.channel_post && update.channel_post.text) {
                    const post = update.channel_post;
                    const text = post.text;
                    
                    if (text.includes('🟣')) {
                        const product = parseProduct(post);
                        if (product) {
                            products.push(product);
                        }
                    }
                }
            }
        }
        
        products.sort((a, b) => b.productId.localeCompare(a.productId));
        
        console.log(`✅ تم جلب ${products.length} منتج من تلغرام`);
        
        localStorage.setItem('telegram_products', JSON.stringify(products));
        
        if (window.products !== undefined) {
            window.products = products;
        }
        
        if (typeof window.displayProducts === 'function') {
            window.displayProducts();
        }
        
        return products;
        
    } catch (error) {
        console.error('❌ خطأ في جلب المنتجات:', error);
        const cached = localStorage.getItem('telegram_products');
        return cached ? JSON.parse(cached) : [];
    }
}

// ========== 3. تحليل المنتج من رسالة تلغرام ==========
function parseProduct(post) {
    try {
        const lines = post.text.split('\n');
        const product = {
            id: post.message_id,
            telegramId: post.message_id,
            productId: 'PROD_000001',
            name: '',
            price: 0,
            category: 'other',
            stock: 0,
            merchantId: '',
            merchantName: '',
            userId: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300',
            date: post.date,
            dateStr: new Date(post.date * 1000).toLocaleString('ar-EG')
        };
        
        lines.forEach(line => {
            if (line.includes('المنتج:')) {
                product.name = line.replace('المنتج:', '').replace(/[🟣*]/g, '').trim();
            }
            else if (line.includes('معرف المنتج:')) {
                product.productId = line.replace('معرف المنتج:', '').replace(/[🟣*]/g, '').trim();
            }
            else if (line.includes('السعر:')) {
                const match = line.match(/\d+/);
                product.price = match ? parseInt(match[0]) : 0;
            }
            else if (line.includes('القسم:')) {
                const cat = line.replace('القسم:', '').replace(/[🟣*]/g, '').trim().toLowerCase();
                if (cat.includes('promo') || cat.includes('برموسيو')) product.category = 'promo';
                else if (cat.includes('spices') || cat.includes('توابل')) product.category = 'spices';
                else if (cat.includes('cosmetic') || cat.includes('كوسمتيك')) product.category = 'cosmetic';
                else product.category = 'other';
            }
            else if (line.includes('الكمية:')) {
                const match = line.match(/\d+/);
                product.stock = match ? parseInt(match[0]) : 0;
            }
            else if (line.includes('معرف التاجر:')) {
                product.merchantId = line.replace('معرف التاجر:', '').replace(/[🟣*]/g, '').trim();
            }
            else if (line.includes('التاجر:')) {
                product.merchantName = line.replace('التاجر:', '').replace(/[🟣*]/g, '').trim();
            }
            else if (line.includes('معرف المشتري:')) {
                product.userId = line.replace('معرف المشتري:', '').replace(/[🟣*]/g, '').trim();
            }
            else if (line.includes('وصف:')) {
                product.description = line.replace('وصف:', '').replace(/[🟣*]/g, '').trim();
            }
        });
        
        return product.name ? product : null;
        
    } catch (error) {
        console.error('خطأ في تحليل المنتج:', error);
        return null;
    }
}

// ========== 4. إضافة منتج جديد مع معرف تسلسلي ==========
async function addProductToTelegram(product, user = null) {
    try {
        const productId = ID_SYSTEM.generateProductId();
        
        const merchantId = user?.role === 'merchant_approved' ? 
            (user.merchantId || ID_SYSTEM.generateMerchantId()) : 
            ID_SYSTEM.ADMIN_ID;
        
        const merchantName = user?.name || 'مدير النظام';
        const userId = user?.id || 'USER_GUEST';
        
        if (user?.role === 'merchant_approved' && !user.merchantId) {
            user.merchantId = merchantId;
            localStorage.setItem('current_user', JSON.stringify(user));
            
            const users = JSON.parse(localStorage.getItem('nardoo_users') || '[]');
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users[index].merchantId = merchantId;
                localStorage.setItem('nardoo_users', JSON.stringify(users));
            }
        }
        
        const message = `
🟣 *منتج جديد*
━━━━━━━━━━━━━━━━━━━━━━
📦 *المنتج:* ${product.name}
🆔 *معرف المنتج:* ${productId}
💰 *السعر:* ${product.price} دج
🏷️ *القسم:* ${product.category}
📊 *الكمية:* ${product.stock}
👤 *التاجر:* ${merchantName}
🆔 *معرف التاجر:* ${merchantId}
👥 *معرف المشتري:* ${userId}
📝 *وصف:* ${product.description || 'منتج ممتاز'}
🕐 ${new Date().toLocaleString('ar-EG')}
        `;

        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ منتج مضاف، المعرف:', productId);
            
            setTimeout(async () => {
                await fetchProductsFromTelegram();
                
                if (typeof window.showNotification === 'function') {
                    window.showNotification('✅ تمت إضافة المنتج', 'success');
                }
            }, 2000);
            
            return { 
                success: true, 
                productId: productId,
                messageId: result.result.message_id
            };
        }
        
        return { success: false };
        
    } catch (error) {
        console.error('❌ خطأ في إضافة المنتج:', error);
        return { success: false };
    }
}

// ========== 5. إضافة طلب تاجر جديد ==========
async function addMerchantRequestToTelegram(merchant) {
    try {
        const merchantId = ID_SYSTEM.generateMerchantId();
        
        const message = `
🔵 *طلب تاجر جديد*
━━━━━━━━━━━━━━━━━━━━━━
👤 *التاجر:* ${merchant.name}
🆔 *معرف التاجر:* ${merchantId}
🏪 *المتجر:* ${merchant.store}
📧 *البريد:* ${merchant.email}
📞 *الهاتف:* ${merchant.phone}
📊 *المستوى:* ${merchant.level}

⬇️ *للإجراء*
✅ للموافقة: /approve_${merchantId}
❌ للرفض: /reject_${merchantId}
🕐 ${new Date().toLocaleString('ar-EG')}
        `;

        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ طلب تاجر مضاف، المعرف:', merchantId);
            return { success: true, merchantId: merchantId };
        }
        
        return { success: false };
        
    } catch (error) {
        console.error('❌ خطأ في إضافة طلب التاجر:', error);
        return { success: false };
    }
}

// ========== 6. إضافة طلب شراء ==========
async function addOrderToTelegram(order) {
    try {
        const itemsList = order.items.map(item => 
            `  • ${item.name} (${item.quantity}) = ${item.price * item.quantity} دج`
        ).join('\n');

        const message = `
🟢 *طلب جديد*
━━━━━━━━━━━━━━━━━━━━━━
👤 *الزبون:* ${order.customer}
📞 *الهاتف:* ${order.phone}
📍 *العنوان:* ${order.address || 'غير محدد'}

📦 *المنتجات:*
${itemsList}

💰 *الإجمالي:* ${order.total} دج
🕐 ${new Date().toLocaleString('ar-EG')}
        `;

        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        return response.ok;
        
    } catch (error) {
        console.error('❌ خطأ في إضافة الطلب:', error);
        return false;
    }
}

// ========== 7. تسجيل مستخدم جديد ==========
async function registerUser(userData) {
    try {
        const userId = ID_SYSTEM.generateUserId();
        
        const message = `
🟡 *مستخدم جديد*
━━━━━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${userData.name}
🆔 *معرف المستخدم:* ${userId}
📧 *البريد:* ${userData.email}
📞 *الهاتف:* ${userData.phone}
📝 *النوع:* ${userData.isMerchant ? 'تاجر' : 'مشتري'}
🕐 ${new Date().toLocaleString('ar-EG')}
        `;

        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ مستخدم جديد، المعرف:', userId);
            return { success: true, userId: userId };
        }
        
        return { success: false };
        
    } catch (error) {
        console.error('❌ خطأ في تسجيل المستخدم:', error);
        return { success: false };
    }
}

// ========== 8. الموافقة على تاجر ==========
async function approveMerchant(merchantId, merchantName) {
    try {
        const message = `
✅ *تمت الموافقة على التاجر*
━━━━━━━━━━━━━━━━━━━━━━
👤 *التاجر:* ${merchantName}
🆔 *معرف التاجر:* ${merchantId}
👑 *بواسطة:* مدير النظام
🕐 ${new Date().toLocaleString('ar-EG')}

🎉 أهلاً بك في منصة نكهة وجمال!
        `;

        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        return response.ok;
        
    } catch (error) {
        console.error('❌ خطأ في الموافقة:', error);
        return false;
    }
}

// ========== 9. رفض تاجر ==========
async function rejectMerchant(merchantId, merchantName) {
    try {
        const message = `
❌ *تم رفض طلب التاجر*
━━━━━━━━━━━━━━━━━━━━━━
👤 *التاجر:* ${merchantName}
🆔 *معرف التاجر:* ${merchantId}
👑 *بواسطة:* مدير النظام
🕐 ${new Date().toLocaleString('ar-EG')}
        `;

        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        return response.ok;
        
    } catch (error) {
        console.error('❌ خطأ في الرفض:', error);
        return false;
    }
}

// ========== 10. البحث عن منتج بالمعرف التسلسلي ==========
async function getProductBySerialId(serialId) {
    const products = await fetchProductsFromTelegram();
    return products.find(p => p.productId === serialId);
}

// ========== 11. تحديث المتجر من تلغرام ==========
async function refreshStoreFromTelegram() {
    const products = await fetchProductsFromTelegram();
    
    if (window.products !== undefined) {
        window.products = products;
    }
    
    if (typeof window.displayProducts === 'function') {
        window.displayProducts();
    }
    
    console.log('✅ تم تحديث المتجر من تلغرام');
    return products;
}

// ========== 12. إحصائيات المعرفات ==========
function getIdsStats() {
    return {
        adminId: ID_SYSTEM.ADMIN_ID,
        lastMerchantId: `MERCH_${ID_SYSTEM.merchantCounter}`,
        lastUserId: `USER_${ID_SYSTEM.userCounter}`,
        lastProductId: `PROD_${ID_SYSTEM.productCounter.toString().padStart(6, '0')}`,
        totalMerchants: ID_SYSTEM.merchantCounter - 1000,
        totalUsers: ID_SYSTEM.userCounter - 5000,
        totalProducts: ID_SYSTEM.productCounter
    };
}

// ========== 13. بدء الخدمات التلقائية ==========
function startTelegramServices() {
    setInterval(refreshStoreFromTelegram, 15000);
    setTimeout(refreshStoreFromTelegram, 1000);
    console.log('✅ نظام المعرفات جاهز');
    console.log('📊 إحصائيات المعرفات:', getIdsStats());
}

// ========== 14. واجهة برمجة التطبيقات ==========
window.TelegramAPI = {
    fetchProducts: fetchProductsFromTelegram,
    addProduct: addProductToTelegram,
    addOrder: addOrderToTelegram,
    addMerchant: addMerchantRequestToTelegram,
    registerUser: registerUser,
    approveMerchant: approveMerchant,
    rejectMerchant: rejectMerchant,
    getProductBySerialId: getProductBySerialId,
    getIdsStats: getIdsStats,
    generateProductId: () => ID_SYSTEM.generateProductId(),
    refresh: refreshStoreFromTelegram,
    start: startTelegramServices
};

startTelegramServices();
console.log('✅ نظام تلغرام جاهز مع المعرفات الثابتة');
