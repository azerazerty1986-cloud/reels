// ========== 1. النظام المتكامل لجلب بصمات Reels ==========

const MULTI_PLATFORM = {
    telegram: {
        token: '8576673096:AAEFKd-YSJcW_0d_wAHZBt-5nPg_VOjDX_0',
        channelId: '-1003822964890'
    },
    youtubeKey: 'AIzaSyCwLqX3oXoXoXoXoXoXoXoXoXoXoXo', // استبدل بمفتاحك الحقيقي
    platforms: [
        { name: 'youtube', icon: 'fab fa-youtube', color: '#FF0000', enabled: true },
        { name: 'instagram', icon: 'fab fa-instagram', color: '#E4405F', enabled: true },
        { name: 'tiktok', icon: 'fab fa-tiktok', color: '#000000', enabled: true },
        { name: 'telegram', icon: 'fab fa-telegram', color: '#0088cc', enabled: true }
    ],
    fetchCount: 20,
    intervalMinutes: 30
};

// قاعدة البيانات الموحدة
let reelsUnifiedDB = JSON.parse(localStorage.getItem('reels_unified_db') || '[]');

// ========== 2. دوال يوتيوب ==========

async function fetchYouTubeTrending(limit = 120) {
    try {
        // 👇 رابط Worker الجديد
        const workerUrl = 'https://reels.azerazerty1986.workers.dev';
        
        // قائمة فيديوهات مشهورة
        const popularVideos = [
            'dQw4w9WgXcQ',
            'kJQP7kiw5Fk',
            'fJ9rUzIMcZQ',
            'RgKAFK5djSk',
            'OPf0YbXqDm0',
            'JGwWNGJdvx8'
        ];
        
        const results = [];
        
        for (let i = 0; i < limit; i++) {
            const videoId = popularVideos[i % popularVideos.length];
            
            const response = await fetch(`${workerUrl}?videoId=${videoId}`);
            const data = await response.json();
            
            results.push({
                platform: 'youtube',
                id: data.id,
                title: data.title || 'فيديو يوتيوب',
                channel: 'YouTube',
                thumbnail: `https://img.youtube.com/vi/${data.id}/maxresdefault.jpg`,
                url: `https://youtube.com/shorts/${data.id}`,
                views: data.views || Math.floor(Math.random() * 1000000),
                date: new Date().toISOString()
            });
        }
        
        return results;
        
    } catch (error) {
        console.error('خطأ في جلب يوتيوب:', error);
        return getMockYouTubeData(limit);
    }
}

function getMockYouTubeData(limit) {
    const mockVideos = [
        { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', channel: 'Rick Astley', views: 1500000000 },
        { id: 'kJQP7kiw5Fk', title: 'Ed Sheeran - Shape of You', channel: 'Ed Sheeran', views: 6000000000 },
        { id: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody', channel: 'Queen Official', views: 1800000000 }
    ];
    
    const result = [];
    for (let i = 0; i < limit; i++) {
        const mock = mockVideos[i % mockVideos.length];
        result.push({
            platform: 'youtube',
            id: `${mock.id}_${i}`,
            title: mock.title,
            channel: mock.channel,
            thumbnail: `https://img.youtube.com/vi/${mock.id}/maxresdefault.jpg`,
            url: `https://youtube.com/shorts/${mock.id}`,
            views: mock.views + Math.floor(Math.random() * 1000000),
            date: new Date().toISOString()
        });
    }
    return result;
}

// ========== 3. دوال إنستغرام ==========

async function fetchInstagramReels(limit = 20) {
    try {
        const response = await fetch(`https://api.instagrab.info/api/reels/trending?limit=${limit}`);
        if (response.ok) {
            const data = await response.json();
            return data.map(item => ({
                platform: 'instagram',
                id: item.code,
                title: item.caption?.substring(0, 50) || 'Reels',
                channel: item.owner?.username || 'user',
                thumbnail: item.thumbnail_src,
                url: `https://www.instagram.com/reel/${item.code}/`,
                views: item.video_view_count || 0,
                date: new Date().toISOString()
            }));
        }
    } catch (error) {
        console.log('⚠️ إنستغرام API غير متاح، استخدام بيانات محاكاة');
    }
    
    return Array(limit).fill(0).map((_, i) => ({
        platform: 'instagram',
        id: `insta_${Date.now()}_${i}`,
        title: `Instagram Reels #${i+1}`,
        channel: `user_${i}`,
        thumbnail: `https://via.placeholder.com/320x480/E4405F/ffffff?text=Reels+${i+1}`,
        url: `https://www.instagram.com/reel/trend_${i}/`,
        views: Math.floor(Math.random() * 2000000),
        date: new Date().toISOString()
    }));
}

// ========== 4. دوال تيك توك ==========

async function fetchTikTokReels(limit = 20) {
    return Array(limit).fill(0).map((_, i) => ({
        platform: 'tiktok',
        id: `tiktok_${Date.now()}_${i}`,
        title: `TikTok Trend #${i+1}`,
        channel: `@user_${i}`,
        thumbnail: `https://via.placeholder.com/320x480/000000/ffffff?text=TikTok+${i+1}`,
        url: `https://www.tiktok.com/@user/video/${i}`,
        views: Math.floor(Math.random() * 5000000),
        date: new Date().toISOString()
    }));
}

// ========== 5. دوال تلجرام ==========

async function fetchTelegramVideos(limit = 20) {
    try {
        const response = await fetch(
            `https://api.telegram.org/bot${MULTI_PLATFORM.telegram.token}/getUpdates`
        );
        const data = await response.json();
        
        if (!data.ok) return [];
        
        const videos = [];
        for (const update of data.result) {
            const post = update.channel_post;
            if (post?.video) {
                const fileInfo = await fetch(
                    `https://api.telegram.org/bot${MULTI_PLATFORM.telegram.token}/getFile?file_id=${post.video.file_id}`
                );
                const fileData = await fileInfo.json();
                
                if (fileData.ok) {
                    videos.push({
                        platform: 'telegram',
                        id: post.message_id,
                        title: post.caption || 'فيديو تلجرام',
                        channel: 'القناة',
                        thumbnail: `https://api.telegram.org/file/bot${MULTI_PLATFORM.telegram.token}/${fileData.result.file_path}?thumb=1`,
                        url: `https://t.me/c/${MULTI_PLATFORM.telegram.channelId.replace('-100', '')}/${post.message_id}`,
                        downloadUrl: `https://api.telegram.org/file/bot${MULTI_PLATFORM.telegram.token}/${fileData.result.file_path}`,
                        duration: post.video.duration,
                        size: post.video.file_size,
                        date: new Date(post.date * 1000).toISOString()
                    });
                }
            }
            if (videos.length >= limit) break;
        }
        return videos;
    } catch (error) {
        console.error('خطأ في جلب تلجرام:', error);
        return [];
    }
}

// ========== 6. نظام البصمات ==========

function generateUnifiedThumbprint(item) {
    const platformCode = item.platform.substring(0, 2).toUpperCase();
    const idPart = item.id.toString().substring(0, 6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timeCode = Date.now().toString(36).slice(-4);
    
    return `TP_${platformCode}_${idPart}_${random}_${timeCode}`;
}

function saveToUnifiedDB(item) {
    const thumbprint = generateUnifiedThumbprint(item);
    
    const entry = {
        ...item,
        thumbprint: thumbprint,
        savedAt: new Date().toISOString()
    };
    
    reelsUnifiedDB.push(entry);
    localStorage.setItem('reels_unified_db', JSON.stringify(reelsUnifiedDB.slice(-1000)));
    
    return entry;
}

async function sendToTelegramChannel(item) {
    const platformInfo = MULTI_PLATFORM.platforms.find(p => p.name === item.platform);
    const thumbprint = generateUnifiedThumbprint(item);
    
    const message = `
🎬 **${platformInfo?.name || item.platform} Reels** #بصمة

🆔 \`${item.id}\`
🔍 \`${thumbprint}\`
📌 ${item.title || 'بدون عنوان'}
👤 ${item.channel || 'غير معروف'}
👁️ ${item.views?.toLocaleString() || 'N/A'} مشاهدة
🔗 ${item.url}
📸 ${item.thumbnail || ''}
📥 تحميل: ${item.downloadUrl || 'غير متوفر'}

📅 ${new Date().toLocaleString('ar-EG')}
    `;
    
    try {
        await fetch(`https://api.telegram.org/bot${MULTI_PLATFORM.telegram.token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: MULTI_PLATFORM.telegram.channelId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        saveToUnifiedDB(item);
        updateStats();
        displayLatestReels();
        
        return true;
    } catch (error) {
        console.error('فشل الإرسال:', error);
        return false;
    }
}

// ========== 7. الجلب من جميع المنصات ==========

async function fetchAllPlatforms() {
    console.log(`🔄 جلب ${MULTI_PLATFORM.fetchCount} عنصر من كل منصة...`);
    
    const results = [];
    
    if (MULTI_PLATFORM.platforms.find(p => p.name === 'youtube')?.enabled) {
        const youtube = await fetchYouTubeTrending(MULTI_PLATFORM.fetchCount);
        results.push(...youtube);
    }
    
    if (MULTI_PLATFORM.platforms.find(p => p.name === 'instagram')?.enabled) {
        const instagram = await fetchInstagramReels(MULTI_PLATFORM.fetchCount);
        results.push(...instagram);
    }
    
    if (MULTI_PLATFORM.platforms.find(p => p.name === 'tiktok')?.enabled) {
        const tiktok = await fetchTikTokReels(MULTI_PLATFORM.fetchCount);
        results.push(...tiktok);
    }
    
    if (MULTI_PLATFORM.platforms.find(p => p.name === 'telegram')?.enabled) {
        const telegram = await fetchTelegramVideos(MULTI_PLATFORM.fetchCount);
        results.push(...telegram);
    }
    
    console.log(`✅ تم جلب ${results.length} عنصر`);
    
    for (const item of results) {
        await sendToTelegramChannel(item);
        await new Promise(r => setTimeout(r, 2000));
    }
    
    return results;
}

// ========== 8. تحديث الواجهة ==========

function updateStats() {
    const stats = {
        total: reelsUnifiedDB.length,
        youtube: reelsUnifiedDB.filter(i => i.platform === 'youtube').length,
        instagram: reelsUnifiedDB.filter(i => i.platform === 'instagram').length,
        tiktok: reelsUnifiedDB.filter(i => i.platform === 'tiktok').length,
        telegram: reelsUnifiedDB.filter(i => i.platform === 'telegram').length
    };
    
    document.getElementById('totalReels').textContent = stats.total;
    document.getElementById('youtubeCount').textContent = stats.youtube;
    document.getElementById('instagramCount').textContent = stats.instagram;
    document.getElementById('tiktokCount').textContent = stats.tiktok;
    document.getElementById('telegramCount').textContent = stats.telegram;
}

function displayLatestReels() {
    const container = document.getElementById('latestReels');
    if (!container) return;
    
    const latest = reelsUnifiedDB.slice(-6).reverse();
    
    container.innerHTML = latest.map(item => {
        const platform = MULTI_PLATFORM.platforms.find(p => p.name === item.platform);
        return `
            <div class="reel-card">
                <img src="${item.thumbnail}" class="reel-thumbnail" alt="${item.title}" onerror="this.src='https://via.placeholder.com/320x480?text=No+Image'">
                <div class="reel-info">
                    <div class="reel-header">
                        <span class="reel-platform">
                            <i class="${platform?.icon}" style="color: ${platform?.color};"></i>
                            ${item.platform}
                        </span>
                        <span class="reel-thumbprint">${item.thumbprint}</span>
                    </div>
                    <h3 class="reel-title">${item.title}</h3>
                    <div class="reel-meta">
                        <span><i class="fas fa-user"></i> ${item.channel}</span>
                        <span><i class="fas fa-eye"></i> ${(item.views / 1000000).toFixed(1)}M</span>
                    </div>
                    <a href="${item.url}" target="_blank" class="reel-link">
                        <i class="fas fa-play"></i> مشاهدة
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// ========== 9. لوحة التحكم ==========

window.showUnifiedDashboard = function() {
    const stats = {
        total: reelsUnifiedDB.length,
        youtube: reelsUnifiedDB.filter(i => i.platform === 'youtube').length,
        instagram: reelsUnifiedDB.filter(i => i.platform === 'instagram').length,
        tiktok: reelsUnifiedDB.filter(i => i.platform === 'tiktok').length,
        telegram: reelsUnifiedDB.filter(i => i.platform === 'telegram').length,
        lastFetch: reelsUnifiedDB.length > 0 ? new Date(reelsUnifiedDB[reelsUnifiedDB.length-1].savedAt).toLocaleString('ar-EG') : 'لم يتم بعد'
    };
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    const platformsList = MULTI_PLATFORM.platforms.map(p => `
        <label style="display: flex; align-items: center; gap: 5px; margin: 5px;">
            <input type="checkbox" ${p.enabled ? 'checked' : ''} onchange="togglePlatform('${p.name}', this.checked)">
            <i class="${p.icon}" style="color: ${p.color};"></i>
            <span>${p.name}</span>
        </label>
    `).join('');
    
    const recentItems = reelsUnifiedDB.slice(-10).reverse().map(item => {
        const platform = MULTI_PLATFORM.platforms.find(p => p.name === item.platform);
        return `
            <div style="background: var(--glass-dark); padding: 10px; margin: 5px 0; border-radius: 8px; border-right: 3px solid ${platform?.color || '#888'};">
                <div style="display: flex; justify-content: space-between;">
                    <span><i class="${platform?.icon || 'fas fa-link'}" style="color: ${platform?.color};"></i> ${item.platform}</span>
                    <span style="font-family: monospace; font-size: 12px;">${item.thumbprint}</span>
                </div>
                <div style="font-size: 12px; color: #888; margin-top: 5px;">
                    ${item.title?.substring(0, 50)}...
                </div>
                <div style="font-size: 11px; color: #666; margin-top: 5px;">
                    📅 ${new Date(item.savedAt).toLocaleString('ar-EG')}
                </div>
            </div>
        `;
    }).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-globe" style="color: var(--gold);"></i> بصمات المنصات المتعددة</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div style="padding: 20px;">
                <div style="background: var(--glass-dark); padding: 15px; border-radius: 15px; margin-bottom: 20px;">
                    <h3 style="color: var(--gold);">📊 إحصائيات</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                        <div>📦 الإجمالي: ${stats.total}</div>
                        <div><i class="fab fa-youtube" style="color: #FF0000;"></i> ${stats.youtube}</div>
                        <div><i class="fab fa-instagram" style="color: #E4405F;"></i> ${stats.instagram}</div>
                        <div><i class="fab fa-tiktok" style="color: #000;"></i> ${stats.tiktok}</div>
                        <div><i class="fab fa-telegram" style="color: #0088cc;"></i> ${stats.telegram}</div>
                        <div>🕐 آخر جلب: ${stats.lastFetch}</div>
                    </div>
                </div>
                
                <div style="background: var(--glass-dark); padding: 15px; border-radius: 15px; margin-bottom: 20px;">
                    <h3 style="color: var(--gold);">⚙️ التحكم</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <h4>المنصات المفعلة:</h4>
                            ${platformsList}
                        </div>
                        <div style="flex: 1;">
                            <h4>إعدادات الجلب:</h4>
                            <div style="margin: 10px 0;">
                                <label>عدد العناصر: </label>
                                <input type="number" id="fetchCount" value="${MULTI_PLATFORM.fetchCount}" min="5" max="50" style="width: 80px; padding: 5px;">
                            </div>
                            <div style="margin: 10px 0;">
                                <label>كل (دقيقة): </label>
                                <input type="number" id="intervalMinutes" value="${MULTI_PLATFORM.intervalMinutes}" min="5" max="120" style="width: 80px; padding: 5px;">
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-gold" onclick="fetchAllPlatforms()" style="flex: 1;">
                            <i class="fas fa-play"></i> تشغيل الآن
                        </button>
                        <button class="btn-outline-gold" onclick="applySettings()" style="flex: 1;">
                            <i class="fas fa-save"></i> حفظ الإعدادات
                        </button>
                    </div>
                </div>
                
                <div style="background: var(--glass-dark); padding: 15px; border-radius: 15px;">
                    <h3 style="color: var(--gold);">📋 آخر البصمات</h3>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${recentItems || '<p style="text-align: center;">لا توجد بصمات بعد</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

// دوال التحكم
window.togglePlatform = function(platform, enabled) {
    const p = MULTI_PLATFORM.platforms.find(p => p.name === platform);
    if (p) p.enabled = enabled;
};

window.applySettings = function() {
    const count = document.getElementById('fetchCount')?.value;
    const interval = document.getElementById('intervalMinutes')?.value;
    
    if (count) MULTI_PLATFORM.fetchCount = parseInt(count);
    if (interval) {
        MULTI_PLATFORM.intervalMinutes = parseInt(interval);
        clearInterval(window.fetchInterval);
        window.fetchInterval = setInterval(fetchAllPlatforms, MULTI_PLATFORM.intervalMinutes * 60 * 1000);
    }
    
    alert('✅ تم حفظ الإعدادات');
};

// البحث بالبصمة
window.searchByThumbprint = function(searchTerm) {
    return reelsUnifiedDB.filter(item => 
        item.thumbprint?.includes(searchTerm) ||
        item.id?.includes(searchTerm) ||
        item.title?.includes(searchTerm)
    );
};

// ========== 10. إضافة أزرار التنقل ==========

function addNavigationButtons() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;
    
    navLinks.innerHTML = `
        <a class="nav-link" onclick="showUnifiedDashboard()">
            <i class="fas fa-globe" style="color: var(--gold);"></i>
            <span>بصمات المنصات</span>
        </a>
        <a class="nav-link" onclick="fetchAllPlatforms()">
            <i class="fas fa-sync-alt" style="color: #00ff00;"></i>
            <span>جلب الآن</span>
        </a>
    `;
}

// ========== 11. دوال إضافية ==========

// تبديل الثيم
window.toggleTheme = function() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.innerHTML = isLight ? 
            '<i class="fas fa-sun"></i><span>نهاري</span>' : 
            '<i class="fas fa-moon"></i><span>ليلي</span>';
    }
};

// تأثير الكتابة
class TypingAnimation {
    constructor(element, words, speed = 100, delay = 2000) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.delay = delay;
        this.wordIndex = 0;
        this.charIndex = 0;
    }
    
    start() {
        this.type();
    }
    
    type() {
        if (this.charIndex < this.words[this.wordIndex].length) {
            this.element.textContent += this.words[this.wordIndex].charAt(this.charIndex);
            this.charIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            setTimeout(() => this.delete(), this.delay);
        }
    }
    
    delete() {
        if (this.charIndex > 0) {
            this.element.textContent = this.words[this.wordIndex].substring(0, this.charIndex - 1);
            this.charIndex--;
            setTimeout(() => this.delete(), this.speed / 2);
        } else {
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ========== 12. التهيئة ==========

window.onload = async function() {
    // تحديث الإحصائيات
    updateStats();
    displayLatestReels();
    
    // إضافة أزرار التنقل
    addNavigationButtons();
    
    // استعادة الثيم المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.innerHTML = '<i class="fas fa-sun"></i><span>نهاري</span>';
        }
    }
    
    // تأثير الكتابة
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        new TypingAnimation(typingElement, [
            'بصمات Reels', 
            'يوتيوب • إنستغرام', 
            'تيك توك • تلجرام'
        ], 100, 2000).start();
    }
    
    // إخفاء شاشة التحميل
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1000);
    
    // بدء التشغيل الدوري
    window.fetchInterval = setInterval(fetchAllPlatforms, MULTI_PLATFORM.intervalMinutes * 60 * 1000);
    
    console.log('%c✅ نظام بصمات Reels جاهز!', 'color: #00ff00; font-size: 14px');
    console.log('📝 استخدم: fetchAllPlatforms() لجلب كل المنصات');
    console.log('📝 استخدم: showUnifiedDashboard() للوحة التحكم');
};

// إغلاق النوافذ المنبثقة عند النقر خارجها
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
