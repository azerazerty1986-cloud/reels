/*
 * Nardo Telegram Bridge — جسر مركزي بلا واجهة
 * يُحمّل قبل تطبيق المتجر والتوصيل، ولا يحتوي إعدادات Telegram ثابتة.
 * يقرأ الإعدادات من المضيف/السيرفر عبر getTelegramConfig أو window.__NARDO_TELEGRAM_CONFIG.
 * 
 * 🔧 التعديل: إضافة دالة fetchAllProducts بدون مؤشر
 */
(function (global) {
  'use strict';

  const STORE_KEY = 'nardo_bridge_last_update_id';
  const API_ROOT = 'https://api.telegram.org/bot';
  const FILE_ROOT = 'https://api.telegram.org/file/bot';

  function host() {
    return global.parent && global.parent !== global ? global.parent : global.opener && global.opener !== global ? global.opener : global;
  }

  function getTelegramConfig() {
    const h = host();
    const providers = [
      global.__NARDO_TELEGRAM_CONFIG,
      h && typeof h.getTelegramConfig === 'function' ? h.getTelegramConfig() : null,
      global.telegramConfig,
      h && h.telegramConfig
    ];
    const c = providers.find(x => x && (x.token || x.botToken) && (x.chatId || x.channelId)) || {};
    return {
      token: c.token || c.botToken || '',
      botToken: c.botToken || c.token || '',
      chatId: c.chatId || c.channelId || '',
      channelId: c.channelId || c.chatId || '',
      apiUrl: c.apiUrl || API_ROOT
    };
  }

  function requireConfig() {
    const c = getTelegramConfig();
    if (!c.botToken || !c.channelId) throw new Error('إعدادات Telegram غير متاحة من الجسر');
    return c;
  }

  async function api(method, options = {}) {
    const c = requireConfig();
    const response = await fetch(`${c.apiUrl}${c.botToken}/${method}`, options);
    const data = await response.json();
    if (!data.ok) throw new Error(data.description || `Telegram API: ${method}`);
    return data.result;
  }

  function lastUpdateId() {
    return Number(global.localStorage?.getItem(STORE_KEY) || 0);
  }
  function saveLastUpdateId(id) {
    if (id != null) global.localStorage?.setItem(STORE_KEY, String(id));
  }

  async function getUpdates({ limit = 100, offset, commit = true } = {}) {
    const usedOffset = offset == null ? (lastUpdateId() + 1 || undefined) : offset;
    const query = new URLSearchParams({ limit: String(Math.min(100, Math.max(1, limit))) });
    if (usedOffset) query.set('offset', String(usedOffset));
    const result = await api(`getUpdates?${query}`);
    if (commit && result.length) saveLastUpdateId(result[result.length - 1].update_id);
    return result;
  }

  function messageOf(update) {
    return update?.channel_post || update?.message || update?.edited_channel_post || update?.edited_message || null;
  }

  function parseProductMessage(text = '') {
    const field = (label) => {
      const line = String(text).split(/\r?\n/).find(row => row.includes(label));
      if (!line) return '';
      return line.slice(line.indexOf(label) + label.length).replace(/^\s*[:：]\s*/, '').trim();
    };
    const name = field('المنتج');
    if (!name) return null;
    const digits = value => String(value || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^0-9]/g, '');
    return {
      name,
      price: digits(field('السعر')),
      category: field('القسم'),
      quantity: digits(field('الكمية')),
      productId: field('معرف المنتج'),
      store: field('المتجر'),
      storeId: field('معرف المتجر'),
      description: field('الوصف'),
      rawText: text
    };
  }

  async function resolveMedia(message) {
    const media = message?.photo?.length ? message.photo[message.photo.length - 1] : message?.video || message?.document || null;
    if (!media?.file_id) return { fileId: '', url: '' };
    const info = await api(`getFile?file_id=${encodeURIComponent(media.file_id)}`);
    const c = requireConfig();
    return { fileId: media.file_id, url: `${FILE_ROOT}${c.botToken}/${info.file_path}`, type: media.mime_type || '' };
  }

  // ============================================================
  // 🔧 الدالة المعدلة: جلب جميع المنتجات بدون مؤشر
  // ============================================================
  async function fetchAllProducts({ limit = 100 } = {}) {
    const c = requireConfig();
    console.log('🔄 جلب جميع المنتجات من القناة (بدون مؤشر)...');
    
    // جلب الرسائل بدون استخدام offset
    const query = new URLSearchParams({ limit: String(Math.min(100, Math.max(1, limit))) });
    const result = await api(`getUpdates?${query}`);
    
    const out = [];
    const seenIds = new Set();
    
    for (const update of result || []) {
      const message = update.channel_post || update.message;
      if (!message || String(message.chat?.id ?? '') !== String(c.channelId)) continue;
      
      const telegramId = String(message.message_id || '');
      if (seenIds.has(telegramId)) continue;
      seenIds.add(telegramId);
      
      const text = message.caption || message.text || '';
      const product = parseProductMessage(text);
      if (!product) continue;
      
      // جلب الصورة إن وجدت
      let media = { fileId: '', url: '' };
      if (message.photo?.length) {
        try {
          media = await resolveMedia(message);
        } catch (e) {
          console.warn('⚠️ تعذر جلب صورة المنتج:', e);
        }
      }
      
      out.push({
        ...product,
        telegramId: telegramId,
        messageId: message.message_id || '',
        image: media.url || '',
        images: media.url ? [media.url] : [],
        fetchedAt: new Date().toISOString()
      });
    }
    
    console.log(`✅ تم جلب ${out.length} منتج من القناة`);
    return out;
  }

  // ============================================================
  // الدوال الأصلية مع تعديل fetchProducts لاستخدام الطريقة الجديدة
  // ============================================================
  async function fetchProducts({ limit = 50, commit = false } = {}) {
    // استخدام الدالة الجديدة fetchAllProducts
    return fetchAllProducts({ limit });
  }

  async function sendMessage(text, chatId) {
    const c = requireConfig();
    const body = new URLSearchParams({ chat_id: String(chatId || c.channelId), text: String(text), disable_web_page_preview: 'true' });
    return api('sendMessage', { method: 'POST', body });
  }

  async function sendPhoto(photo, caption = '', chatId) {
    const c = requireConfig();
    const form = new FormData();
    form.append('chat_id', String(chatId || c.channelId));
    form.append('photo', photo);
    if (caption) form.append('caption', caption);
    return api('sendPhoto', { method: 'POST', body: form });
  }

  function formatProduct(product = {}) {
    return `🟣 منتج جديد في ناردو برو
━━━━━━━━━━━━━━━━━━
📦 المنتج: ${product.name || ''}
💰 السعر: ${product.price || ''}
🏷️ القسم: ${product.category || 'عام'}
📊 الكمية: ${product.quantity || ''}
🆔 معرف المنتج: ${product.productId || ('ناردومار-' + Date.now())}
🏪 المتجر: ${product.store || 'متجر المستخدم'}
🆔 معرف المتجر: ${product.storeId || ''}
📝 الوصف: ${product.description || 'لا يوجد وصف'}`;
  }

  async function publishProduct(product, imageFile = null, chatId) {
    const text = formatProduct(product);
    const result = imageFile ? await sendPhoto(imageFile, text, chatId) : await sendMessage(text, chatId);
    return { ...product, rawText: text, messageId: result.message_id, image: imageFile ? URL.createObjectURL(imageFile) : '' };
  }

  async function sendOrder(text, chatId) {
    return sendMessage(text, chatId);
  }

  // ============================================================
  // 🚀 تصدير الواجهة
  // ============================================================
  const Bridge = {
    version: '2.0.0',
    getTelegramConfig,
    fetchProducts,
    fetchAllProducts,  // الدالة الجديدة
    fetchTelegramProducts: fetchProducts,
    fetchTelegramProductsToCastle: fetchProducts,
    getUpdates,
    parseProductMessage,
    resolveMedia,
    sendMessage,
    sendPhoto,
    publishProduct,
    publishProductFromApp: publishProduct,
    formatProduct,
    sendOrder,
    resetCursor() { global.localStorage?.removeItem(STORE_KEY); }
  };

  global.NardoBridge = Bridge;
  // توافق مباشر مع الملفين القديمين والجسر الأول.
  global.getTelegramConfig = global.getTelegramConfig || getTelegramConfig;
  global.fetchTelegramProductsToCastle = global.fetchTelegramProductsToCastle || fetchProducts;
  global.serverFetchProducts = global.serverFetchProducts || fetchProducts;
  global.publishProductFromApp = global.publishProductFromApp || publishProduct;
  global.sendOrderToTelegram = global.sendOrderToTelegram || sendOrder;
  
  console.log('✅ NardoBridge v2.0 - تم تفعيل الجلب بدون مؤشر');
})(window);

