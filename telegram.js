// ========== نظام تلغرام المتكامل ==========
const TELEGRAM = {
    botToken: '8576673096:AAEFKd-YSJcW_0d_wAHZBt-5nPg_VOjDX_0',
    channelId: '-1003822964890',
    adminId: '7461896689',
    apiUrl: 'https://api.telegram.org/bot'
};

// ========== 1. جلب المنتجات من قناة تلغرام ==========
async function fetchProductsFromTelegram() {
    try {
        console.log('🔄 جاري جلب المنتجات من تلغرام...');
        
        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates`);
        const data = await response.json();
        
        const products = [];
        
        if (data.ok && data.result) {
            const updates = [...data.result].reverse();
            
            for (const update of updates) {
                if (update.channel_post && update.channel_post.text && update.channel_post.text.includes('🟣')) {
                    const post = update.channel_post;
                    const lines = post.text.split('\n');
                    let productData = {
                        id: post.message_id,
                        name: 'منتج',
                        price: 0,
                        category: 'other',
                        stock: 0,
                        merchant: 'المتجر',
                        description: ''
                    };
                    
                    lines.forEach(line => {
                        if (line.includes('المنتج:')) {
                            productData.name = line.replace('المنتج:', '').replace(/[🟣*]/g, '').trim();
                        } else if (line.includes('السعر:')) {
                            const match = line.match(/\d+/);
                            if (match) productData.price = parseInt(match[0]);
                        } else if (line.includes('القسم:')) {
                            const cat = line.replace('القسم:', '').replace(/[🟣*]/g, '').trim().toLowerCase();
                            if (cat.includes('promo') || cat.includes('برموسيو')) productData.category = 'promo';
                            else if (cat.includes('spices') || cat.includes('توابل')) productData.category = 'spices';
                            else if (cat.includes('cosmetic') || cat.includes('كوسمتيك')) productData.category = 'cosmetic';
                            else productData.category = 'other';
                        } else if (line.includes('الكمية:')) {
                            const match = line.match(/\d+/);
                            if (match) productData.stock = parseInt(match[0]);
                        } else if (line.includes('التاجر:')) {
                            productData.merchant = line.replace('التاجر:', '').replace(/[🟣*]/g, '').trim();
                        } else if (line.includes('وصف:')) {
                            productData.description = line.replace('وصف:', '').replace(/[🟣*]/g, '').trim();
                        }
                    });
                    
                    products.push({
                        id: productData.id,
                        name: productData.name,
                        price: productData.price || 1000,
                        category: productData.category,
                        stock: productData.stock || 10,
                        merchantName: productData.merchant,
                        description: productData.description || 'منتج عالي الجودة',
                        image: 'https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300',
                        rating: 4.5,
                        createdAt: new Date(post.date * 1000).toISOString(),
                        telegramPostId: post.message_id
                    });
                }
            }
        }
        
        console.log(`✅ تم تحميل ${products.length} منتج من تلغرام`);
        localStorage.setItem('telegram_products', JSON.stringify(products));
        
        return products;
        
    } catch (error) {
        console.error('❌ خطأ في جلب المنتجات من تلغرام:', error);
        const saved = localStorage.getItem('telegram_products');
        return saved ? JSON.parse(saved) : [];
    }
}

// ========== 2. إضافة منتج جديد إلى تلغرام (🟣) ==========
async function addProductToTelegram(product) {
    const message = `
🟣 *منتج جديد في المتجر*
━━━━━━━━━━━━━━━━━━━━━━
📦 *المنتج:* ${product.name}
💰 *السعر:* ${product.price} دج
🏷️ *القسم:* ${product.category}
📊 *الكمية:* ${product.stock}
👤 *التاجر:* ${product.merchantName}
📝 *وصف:* ${product.description || 'منتج عالي الجودة'}
🕐 *تاريخ الإضافة:* ${new Date().toLocaleString('ar-DZ')}
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
            console.log('✅ تم إضافة المنتج إلى تلغرام');
            await sendNotificationToAdmin(`تمت إضافة منتج جديد: ${product.name}`);
            return { success: true, messageId: result.result.message_id };
        }
        
        return { success: false, error: 'فشل الإرسال' };
        
    } catch (error) {
        console.error('❌ خطأ في إضافة المنتج إلى تلغرام:', error);
        return { success: false, error: error.message };
    }
}

// ========== 3. إرسال طلب شراء (🟢) ==========
async function sendOrderToTelegram(order) {
    const message = `
🟢 *طلب شراء جديد*
━━━━━━━━━━━━━━━━━━━━━━
👤 *الزبون:* ${order.customerName}
📞 *الهاتف:* ${order.customerPhone || 'غير محدد'}
📍 *العنوان:* ${order.customerAddress || 'غير محدد'}

📦 *المنتجات:*
${order.items.map((item, i) => 
    `  ${i+1}. ${item.name} (${item.quantity}) - ${item.price * item.quantity} دج`
).join('\n')}

💰 *الإجمالي:* ${order.total} دج
💳 *طريقة الدفع:* ${order.paymentMethod || 'الواتساب'}
🕐 *الوقت:* ${new Date().toLocaleString('ar-DZ')}
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
        
        await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.adminId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        console.log('✅ تم إرسال الطلب إلى تلغرام');
        
    } catch (error) {
        console.error('❌ خطأ في إرسال الطلب:', error);
    }
}

// ========== 4. إرسال طلب انضمام تاجر (🔵) ==========
async function sendMerchantRequestToTelegram(merchant) {
    const message = `
🔵 *طلب انضمام تاجر جديد*
━━━━━━━━━━━━━━━━━━━━━━
🏪 *اسم المتجر:* ${merchant.storeName || merchant.name}
👤 *التاجر:* ${merchant.name}
📧 *البريد:* ${merchant.email}
📞 *الهاتف:* ${merchant.phone}
📊 *المستوى:* ${merchant.merchantLevel || 1}
📝 *الوصف:* ${merchant.merchantDesc || 'لا يوجد'}

⬇️ *للإجراء*
✅ للموافقة: /approve_${merchant.id}
❌ للرفض: /reject_${merchant.id}
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
        
        console.log('✅ تم إرسال طلب التاجر إلى تلغرام');
        
    } catch (error) {
        console.error('❌ خطأ في إرسال طلب التاجر:', error);
    }
}

// ========== 5. إرسال إشعار للمدير ==========
async function sendNotificationToAdmin(text) {
    const message = `
🟡 *إشعار للمدير*
━━━━━━━━━━━━━━━━━━━━━━
${text}
🕐 ${new Date().toLocaleString('ar-DZ')}
    `;

    try {
        await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.adminId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (error) {
        console.error('❌ خطأ في إرسال الإشعار:', error);
    }
}

// ========== 6. إرسال إشعار عام للقناة ==========
async function sendPublicNotification(text) {
    const message = `
📢 *إشعار هام*
━━━━━━━━━━━━━━━━━━━━━━
${text}
🕐 ${new Date().toLocaleString('ar-DZ')}
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
    } catch (error) {
        console.error('❌ خطأ في إرسال الإشعار العام:', error);
    }
}

// ========== 7. مزامنة المنتجات مع تلغرام ==========
async function syncProductsWithTelegram() {
    console.log('🔄 بدء مزامنة المنتجات مع تلغرام...');
    
    const telegramProducts = await fetchProductsFromTelegram();
    const localProducts = JSON.parse(localStorage.getItem('nardoo_products')) || [];
    
    const productMap = new Map();
    localProducts.forEach(p => productMap.set(p.id, p));
    
    telegramProducts.forEach(tp => {
        if (!productMap.has(tp.id)) {
            localProducts.push(tp);
        }
    });
    
    localStorage.setItem('nardoo_products', JSON.stringify(localProducts));
    console.log(`✅ تمت المزامنة: ${localProducts.length} منتج`);
    
    return localProducts;
}

// ========== 8. تصدير الدوال ==========
window.TelegramAPI = {
    fetchProducts: fetchProductsFromTelegram,
    addProduct: addProductToTelegram,
    sendOrder: sendOrderToTelegram,
    sendMerchantRequest: sendMerchantRequestToTelegram,
    sendNotification: sendPublicNotification,
    sendToAdmin: sendNotificationToAdmin,
    syncProducts: syncProductsWithTelegram
};

console.log('✅ نظام تلغرام المتكامل جاهز للعمل');
