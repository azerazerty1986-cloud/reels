// ========== نظام تلغرام المتكامل - تخزين في تلغرام فقط ==========
const TELEGRAM = {
    botToken: '8576673096:AAEFKd-YSJcW_0d_wAHZBt-5nPg_VOjDX_0',
    channelId: '-1003822964890',
    adminId: '7461896689',
    apiUrl: 'https://api.telegram.org/bot'
};

// ========== 1. جلب جميع البيانات من تلغرام ==========
async function fetchAllFromTelegram() {
    try {
        console.log('🔄 جلب البيانات من تلغرام...');
        
        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates`);
        const data = await response.json();
        
        const products = [];
        const merchantRequests = [];
        const orders = [];
        
        if (data.ok && data.result) {
            for (const update of data.result) {
                if (update.channel_post) {
                    const post = update.channel_post;
                    const text = post.text || '';
                    
                    // 🟣 المنتجات
                    if (text.includes('🟣')) {
                        const product = parseProduct(post);
                        if (product) products.push(product);
                    }
                    
                    // 🔵 طلبات التجار
                    if (text.includes('🔵')) {
                        const request = parseMerchantRequest(post);
                        if (request) merchantRequests.push(request);
                    }
                    
                    // 🟢 الطلبات
                    if (text.includes('🟢')) {
                        const order = parseOrder(post);
                        if (order) orders.push(order);
                    }
                }
            }
        }
        
        console.log(`✅ تم جلب: ${products.length} منتج, ${merchantRequests.length} طلب تاجر, ${orders.length} طلب`);
        
        return {
            products: products.sort((a, b) => b.id - a.id),
            merchantRequests: merchantRequests.sort((a, b) => b.id - a.id),
            orders: orders.sort((a, b) => b.id - a.id)
        };
        
    } catch (error) {
        console.error('❌ خطأ في الجلب:', error);
        return { products: [], merchantRequests: [], orders: [] };
    }
}

// ========== 2. تحليل المنتج من الرسالة ==========
function parseProduct(post) {
    try {
        const lines = post.text.split('\n');
        const product = {
            id: post.message_id,
            telegramId: post.message_id,
            date: post.date,
            dateStr: new Date(post.date * 1000).toLocaleString('ar-EG'),
            name: '',
            price: 0,
            category: 'other',
            stock: 0,
            merchant: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300'
        };
        
        lines.forEach(line => {
            if (line.includes('المنتج:')) {
                product.name = line.replace('المنتج:', '').replace(/[🟣*]/g, '').trim();
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
            else if (line.includes('التاجر:')) {
                product.merchant = line.replace('التاجر:', '').replace(/[🟣*]/g, '').trim();
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

// ========== 3. تحليل طلب تاجر ==========
function parseMerchantRequest(post) {
    try {
        const lines = post.text.split('\n');
        const request = {
            id: post.message_id,
            telegramId: post.message_id,
            date: post.date,
            dateStr: new Date(post.date * 1000).toLocaleString('ar-EG'),
            name: '',
            store: '',
            email: '',
            phone: '',
            level: 1,
            status: 'pending'
        };
        
        lines.forEach(line => {
            if (line.includes('التاجر:')) {
                request.name = line.replace('التاجر:', '').replace(/[🔵*]/g, '').trim();
            }
            else if (line.includes('اسم المتجر:')) {
                request.store = line.replace('اسم المتجر:', '').replace(/[🔵*]/g, '').trim();
            }
            else if (line.includes('البريد:')) {
                request.email = line.replace('البريد:', '').replace(/[🔵*]/g, '').trim();
            }
            else if (line.includes('الهاتف:')) {
                request.phone = line.replace('الهاتف:', '').replace(/[🔵*]/g, '').trim();
            }
            else if (line.includes('المستوى:')) {
                const match = line.match(/\d+/);
                request.level = match ? parseInt(match[0]) : 1;
            }
        });
        
        return request.name ? request : null;
        
    } catch (error) {
        console.error('خطأ في تحليل طلب التاجر:', error);
        return null;
    }
}

// ========== 4. تحليل الطلب ==========
function parseOrder(post) {
    try {
        const lines = post.text.split('\n');
        const order = {
            id: post.message_id,
            telegramId: post.message_id,
            date: post.date,
            dateStr: new Date(post.date * 1000).toLocaleString('ar-EG'),
            customer: '',
            phone: '',
            items: [],
            total: 0
        };
        
        lines.forEach(line => {
            if (line.includes('الزبون:')) {
                order.customer = line.replace('الزبون:', '').replace(/[🟢*]/g, '').trim();
            }
            else if (line.includes('الهاتف:')) {
                order.phone = line.replace('الهاتف:', '').replace(/[🟢*]/g, '').trim();
            }
            else if (line.includes('الإجمالي:')) {
                const match = line.match(/\d+/);
                order.total = match ? parseInt(match[0]) : 0;
            }
        });
        
        return order.customer ? order : null;
        
    } catch (error) {
        console.error('خطأ في تحليل الطلب:', error);
        return null;
    }
}

// ========== 5. إضافة منتج جديد (🟣) ==========
async function addProductToTelegram(product) {
    const message = `
🟣 *منتج جديد*
━━━━━━━━━━━━━━━━━━━━━━
📦 *المنتج:* ${product.name}
💰 *السعر:* ${product.price} دج
🏷️ *القسم:* ${product.category}
📊 *الكمية:* ${product.stock}
👤 *التاجر:* ${product.merchant || 'مدير النظام'}
📝 *وصف:* ${product.description || 'منتج ممتاز'}
🕐 ${new Date().toLocaleString('ar-EG')}
    `;

    try {
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
            console.log('✅ منتج مضاف، المعرف:', result.result.message_id);
            
            // إرسال إشعار للمدير
            await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM.adminId,
                    text: `✅ تمت إضافة منتج جديد: ${product.name}`,
                    parse_mode: 'Markdown'
                })
            });
            
            return { success: true, id: result.result.message_id };
        }
        return { success: false };
        
    } catch (error) {
        console.error('❌ خطأ في إضافة المنتج:', error);
        return { success: false };
    }
}

// ========== 6. إضافة طلب تاجر (🔵) ==========
async function addMerchantRequestToTelegram(merchant) {
    const message = `
🔵 *طلب تاجر جديد*
━━━━━━━━━━━━━━━━━━━━━━
👤 *التاجر:* ${merchant.name}
🏪 *المتجر:* ${merchant.store}
📧 *البريد:* ${merchant.email}
📞 *الهاتف:* ${merchant.phone}
📊 *المستوى:* ${merchant.level}

⬇️ *للإجراء*
✅ للموافقة: /approve_${Date.now()}
❌ للرفض: /reject_${Date.now()}
🕐 ${new Date().toLocaleString('ar-EG')}
    `;

    try {
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
        console.error('❌ خطأ في إضافة طلب التاجر:', error);
        return false;
    }
}

// ========== 7. إضافة طلب شراء (🟢) ==========
async function addOrderToTelegram(order) {
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

    try {
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

// ========== 8. الموافقة على تاجر ==========
async function approveMerchant(merchantName, adminName = 'مدير النظام') {
    const message = `
✅ *تمت الموافقة على التاجر*
━━━━━━━━━━━━━━━━━━━━━━
👤 *التاجر:* ${merchantName}
👑 *بواسطة:* ${adminName}
🕐 ${new Date().toLocaleString('ar-EG')}

🎉 أهلاً بك في منصة نكهة وجمال!
يمكنك الآن إضافة منتجاتك.
    `;

    try {
        await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في الموافقة:', error);
        return false;
    }
}

// ========== 9. رفض تاجر ==========
async function rejectMerchant(merchantName, adminName = 'مدير النظام') {
    const message = `
❌ *تم رفض طلب التاجر*
━━━━━━━━━━━━━━━━━━━━━━
👤 *التاجر:* ${merchantName}
👑 *بواسطة:* ${adminName}
🕐 ${new Date().toLocaleString('ar-EG')}

نأسف، يمكنك التقديم مرة أخرى لاحقاً.
    `;

    try {
        await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في الرفض:', error);
        return false;
    }
}

// ========== 10. تحديث المتجر من تلغرام ==========
async function refreshStoreFromTelegram() {
    const data = await fetchAllFromTelegram();
    
    // تحديث المتغيرات العامة إذا كانت موجودة
    if (window.products !== undefined) {
        window.products = data.products;
    }
    
    if (window.merchantRequests !== undefined) {
        window.merchantRequests = data.merchantRequests;
    }
    
    // تحديث العرض إذا كانت الدالة موجودة
    if (typeof window.displayProducts === 'function') {
        window.displayProducts();
    }
    
    console.log('✅ تم تحديث المتجر من تلغرام');
    return data;
}

// ========== 11. البحث عن منتج بالمعرف ==========
async function getProductById(productId) {
    const { products } = await fetchAllFromTelegram();
    return products.find(p => p.id == productId || p.telegramId == productId);
}

// ========== 12. إحصائيات سريعة ==========
async function getTelegramStats() {
    const { products, merchantRequests, orders } = await fetchAllFromTelegram();
    
    return {
        totalProducts: products.length,
        totalMerchants: merchantRequests.length,
        totalOrders: orders.length,
        lastUpdate: new Date().toLocaleString('ar-EG'),
        productsByCategory: {
            promo: products.filter(p => p.category === 'promo').length,
            spices: products.filter(p => p.category === 'spices').length,
            cosmetic: products.filter(p => p.category === 'cosmetic').length,
            other: products.filter(p => p.category === 'other').length
        }
    };
}

// ========== 13. الاستماع للأوامر ==========
async function checkTelegramCommands() {
    try {
        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates`);
        const data = await response.json();
        
        if (data.ok && data.result) {
            for (const update of data.result) {
                if (update.message?.text) {
                    const text = update.message.text;
                    
                    // أوامر الموافقة على التجار
                    if (text.startsWith('/approve_')) {
                        await approveMerchant('تاجر', 'مدير');
                    }
                    
                    if (text.startsWith('/reject_')) {
                        await rejectMerchant('تاجر', 'مدير');
                    }
                    
                    // أمر تحديث
                    if (text === '/update') {
                        await refreshStoreFromTelegram();
                    }
                    
                    // أمر الإحصائيات
                    if (text === '/stats') {
                        const stats = await getTelegramStats();
                        const statsMessage = `
📊 *إحصائيات المتجر*
━━━━━━━━━━━━━━━━━━━━━━
📦 المنتجات: ${stats.totalProducts}
👥 طلبات التجار: ${stats.totalMerchants}
🛒 الطلبات: ${stats.totalOrders}
🕐 آخر تحديث: ${stats.lastUpdate}

📌 حسب القسم:
• برموسيو: ${stats.productsByCategory.promo}
• توابل: ${stats.productsByCategory.spices}
• كوسمتيك: ${stats.productsByCategory.cosmetic}
• أخرى: ${stats.productsByCategory.other}
                        `;
                        
                        await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: TELEGRAM.channelId,
                                text: statsMessage,
                                parse_mode: 'Markdown'
                            })
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error('خطأ في التحقق من الأوامر:', error);
    }
}

// ========== 14. بدء الخدمات التلقائية ==========
function startTelegramServices() {
    // تحديث كل 30 ثانية
    setInterval(refreshStoreFromTelegram, 30000);
    
    // التحقق من الأوامر كل 15 ثانية
    setInterval(checkTelegramCommands, 15000);
    
    console.log('✅ بدء الخدمات التلقائية لتلغرام');
}

// ========== 15. واجهة برمجة التطبيقات ==========
window.TelegramAPI = {
    // جلب البيانات
    fetchAll: fetchAllFromTelegram,
    fetchProducts: async () => (await fetchAllFromTelegram()).products,
    fetchMerchants: async () => (await fetchAllFromTelegram()).merchantRequests,
    fetchOrders: async () => (await fetchAllFromTelegram()).orders,
    
    // إضافة
    addProduct: addProductToTelegram,
    addMerchant: addMerchantRequestToTelegram,
    addOrder: addOrderToTelegram,
    
    // إجراءات
    approveMerchant,
    rejectMerchant,
    
    // بحث
    getProduct: getProductById,
    
    // تحديث وإحصائيات
    refresh: refreshStoreFromTelegram,
    stats: getTelegramStats,
    
    // خدمات
    start: startTelegramServices
};

// ========== بدء التشغيل ==========
console.log('✅ نظام تلغرام جاهز - التخزين في تلغرام فقط');
startTelegramServices();
