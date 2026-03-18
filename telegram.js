// ========== نظام تلغرام المتكامل مع الصور المتعددة ==========
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
    
    generateProductId(publisherId) {
        this.productCounter++;
        const serialNumber = this.productCounter.toString().padStart(3, '0');
        this.saveCounters();
        return `${publisherId}-PROD-${serialNumber}`;
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

// ========== 2. نظام حساب الوقت ==========
const TimeAgo = {
    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp * 1000);
        const seconds = Math.floor((now - past) / 1000);
        
        if (seconds < 60) return `منذ ${seconds} ثانية`;
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
        
        const days = Math.floor(hours / 24);
        if (days < 7) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
        
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
        
        const months = Math.floor(days / 30);
        if (months < 12) return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
        
        const years = Math.floor(days / 365);
        return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
    }
};

// ========== 3. رفع الصور إلى تلغرام ==========
async function uploadImagesToTelegram(images) {
    try {
        const imageUrls = [];
        
        for (const imageFile of images) {
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM.channelId);
            formData.append('photo', imageFile);
            
            const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.ok && result.result.photo) {
                const fileId = result.result.photo[result.result.photo.length - 1].file_id;
                const fileResponse = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getFile?file_id=${fileId}`);
                const fileData = await fileResponse.json();
                
                if (fileData.ok) {
                    const imageUrl = `https://api.telegram.org/file/bot${TELEGRAM.botToken}/${fileData.result.file_path}`;
                    imageUrls.push(imageUrl);
                }
            }
        }
        
        return imageUrls;
        
    } catch (error) {
        console.error('❌ خطأ في رفع الصور:', error);
        return [];
    }
}

// ========== 4. تحليل المنتج من رسالة تلغرام ==========
function parseProduct(post) {
    try {
        const lines = post.text.split('\n');
        const product = {
            id: post.message_id,
            telegramId: post.message_id,
            productId: '',
            name: '',
            price: 0,
            category: 'other',
            stock: 0,
            merchantId: '',
            merchantName: '',
            userId: '',
            description: '',
            images: [],
            date: post.date,
            dateStr: TimeAgo.getTimeAgo(post.date),
            fullDate: new Date(post.date * 1000).toLocaleString('ar-EG')
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
            else if (line.includes('وصف:')) {
                product.description = line.replace('وصف:', '').replace(/[🟣*]/g, '').trim();
            }
            else if (line.includes('صور:')) {
                const urls = line.replace('صور:', '').replace(/[🟣*]/g, '').trim().split(',');
                product.images = urls.filter(url => url.startsWith('http'));
            }
        });
        
        return product.name ? product : null;
        
    } catch (error) {
        console.error('خطأ في تحليل المنتج:', error);
        return null;
    }
}

// ========== 5. جلب جميع المنتجات من تلغرام ==========
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
        
        products.sort((a, b) => b.id - a.id);
        
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

// ========== 6. إضافة منتج جديد مع صور متعددة ==========
async function addProductToTelegram(product, user = null, imageFiles = []) {
    try {
        const publisherId = user?.merchantId || ID_SYSTEM.ADMIN_ID;
        const productId = ID_SYSTEM.generateProductId(publisherId);
        
        const merchantId = user?.role === 'merchant_approved' ? 
            (user.merchantId || ID_SYSTEM.generateMerchantId()) : 
            ID_SYSTEM.ADMIN_ID;
        
        const merchantName = user?.name || 'مدير النظام';
        const userId = user?.id || 'USER_GUEST';
        
        // رفع الصور
        let imageUrls = [];
        if (imageFiles && imageFiles.length > 0) {
            imageUrls = await uploadImagesToTelegram(imageFiles);
        }
        
        // صورة افتراضية إذا لم توجد صور
        if (imageUrls.length === 0) {
            imageUrls = ['https://images.unsplash.com/photo-1542838132-92c5330041e7?w=300'];
        }
        
        // حفظ معرف التاجر إذا كان جديداً
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
        
        // إنشاء نص الرسالة مع روابط الصور
        const imagesText = imageUrls.length > 0 ? `\n📷 صور: ${imageUrls.join(',')}` : '';
        
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
📝 *وصف:* ${product.description || 'منتج ممتاز'}${imagesText}
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
            
            // تحديث المنتجات بعد ثانيتين
            setTimeout(async () => {
                await fetchProductsFromTelegram();
                
                if (typeof window.showNotification === 'function') {
                    window.showNotification(`✅ تمت إضافة المنتج مع ${imageUrls.length} صور`, 'success');
                }
            }, 2000);
            
            return { 
                success: true, 
                productId: productId,
                messageId: result.result.message_id,
                images: imageUrls
            };
        }
        
        return { success: false };
        
    } catch (error) {
        console.error('❌ خطأ في إضافة المنتج:', error);
        return { success: false };
    }
}

// ========== 7. إضافة طلب تاجر جديد ==========
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

// ========== 8. إضافة طلب شراء ==========
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

// ========== 9. تسجيل مستخدم جديد ==========
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

// ========== 10. الموافقة على تاجر ==========
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

// ========== 11. رفض تاجر ==========
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

// ========== 12. البحث عن منتج بالمعرف التسلسلي ==========
async function getProductBySerialId(serialId) {
    const products = await fetchProductsFromTelegram();
    return products.find(p => p.productId === serialId);
}

// ========== 13. تحديث المتجر من تلغرام ==========
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

// ========== 14. إحصائيات المعرفات ==========
function getIdsStats() {
    return {
        adminId: ID_SYSTEM.ADMIN_ID,
        lastMerchantId: `MERCH_${ID_SYSTEM.merchantCounter}`,
        lastUserId: `USER_${ID_SYSTEM.userCounter}`,
        lastProductId: `${ID_SYSTEM.ADMIN_ID}-PROD-${ID_SYSTEM.productCounter.toString().padStart(3, '0')}`,
        totalMerchants: ID_SYSTEM.merchantCounter - 1000,
        totalUsers: ID_SYSTEM.userCounter - 5000,
        totalProducts: ID_SYSTEM.productCounter
    };
}

// ========== 15. الاستماع لأوامر تلغرام ==========
async function checkTelegramCommands() {
    try {
        const response = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates`);
        const data = await response.json();
        
        if (data.ok && data.result) {
            for (const update of data.result) {
                if (update.message?.text) {
                    const text = update.message.text;
                    
                    if (text.startsWith('/approve_')) {
                        const merchantId = text.replace('/approve_', '');
                        await approveMerchant(merchantId, 'تاجر');
                    }
                    
                    if (text.startsWith('/reject_')) {
                        const merchantId = text.replace('/reject_', '');
                        await rejectMerchant(merchantId, 'تاجر');
                    }
                    
                    if (text === '/update') {
                        await refreshStoreFromTelegram();
                    }
                    
                    if (text === '/stats') {
                        const stats = getIdsStats();
                        const statsMessage = `
📊 *إحصائيات المتجر*
━━━━━━━━━━━━━━━━━━━━━━
👑 المدير: ${stats.adminId}
🏪 التجار: ${stats.totalMerchants}
👥 المستخدمين: ${stats.totalUsers}
📦 المنتجات: ${stats.totalProducts}
🆔 آخر منتج: ${stats.lastProductId}
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

// ========== 16. بدء الخدمات التلقائية ==========
function startTelegramServices() {
    // تحديث المنتجات كل 15 ثانية
    setInterval(refreshStoreFromTelegram, 15000);
    
    // التحقق من الأوامر كل 10 ثواني
    setInterval(checkTelegramCommands, 10000);
    
    // تحديث أولي بعد ثانية
    setTimeout(refreshStoreFromTelegram, 1000);
    
    console.log('✅ نظام تلغرام جاهز مع المعرفات الثابتة');
    console.log('📊 إحصائيات المعرفات:', getIdsStats());
}

// ========== 17. واجهة برمجة التطبيقات ==========
window.TelegramAPI = {
    // المنتجات
    fetchProducts: fetchProductsFromTelegram,
    addProduct: addProductToTelegram,
    getProductBySerialId: getProductBySerialId,
    
    // التجار
    addMerchant: addMerchantRequestToTelegram,
    approveMerchant: approveMerchant,
    rejectMerchant: rejectMerchant,
    
    // المستخدمين
    registerUser: registerUser,
    
    // الطلبات
    addOrder: addOrderToTelegram,
    
    // المعرفات
    getIdsStats: getIdsStats,
    generateProductId: (publisherId) => ID_SYSTEM.generateProductId(publisherId),
    
    // الوقت
    getTimeAgo: (timestamp) => TimeAgo.getTimeAgo(timestamp),
    
    // تحديث
    refresh: refreshStoreFromTelegram,
    start: startTelegramServices
};

// بدء الخدمات
startTelegramServices();

console.log('✅ نظام تلغرام جاهز مع الصور المتعددة والتوقيت');
