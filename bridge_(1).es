<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>ناردو كارت برو - النظام المتكامل</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--gold:#ffd700;--gold-dark:#daa520;--success:#4ade80;--error:#f87171;--warning:#fbbf24;--info:#60a5fa;--dark-bg:#0a0a1a;--card-bg:rgba(255,255,255,0.05);--teal:#20b2aa;--purple:#8b5cf6}
        body{font-family:'Cairo',sans-serif;background:linear-gradient(135deg,#0a0a1a,#15152a);color:#fff;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:15px}
        
        .login-box{background:#1a1a2e;border-radius:20px;padding:35px 30px;width:100%;max-width:380px;border:1px solid rgba(255,215,0,0.2);display:block}
        .login-box.hidden{display:none}
        .logo{text-align:center;cursor:pointer;margin-bottom:20px}
        .logo i{font-size:40px;color:var(--gold)}
        .logo h1{color:var(--gold);font-size:24px}
        .logo .hint{font-size:10px;color:#444;margin-top:3px;opacity:0;transition:0.3s}
        .logo .hint.show{opacity:1;color:var(--gold)}
        
        .btn{width:100%;padding:12px;border:none;border-radius:10px;font-family:'Cairo';font-weight:700;font-size:14px;cursor:pointer;transition:0.3s}
        .btn-gold{background:var(--gold);color:#111}
        .btn-gold:hover{transform:scale(1.02)}
        .btn-green{background:var(--success);color:#111}
        .btn-green:hover{transform:scale(1.02)}
        .btn-red{background:var(--error);color:#fff}
        .btn-red:hover{transform:scale(1.02)}
        .btn-blue{background:var(--info);color:#fff}
        .btn-blue:hover{transform:scale(1.02)}
        .btn-purple{background:var(--purple);color:#fff}
        .btn-purple:hover{transform:scale(1.02)}
        .btn-gray{background:rgba(255,255,255,0.05);color:#aaa;border:1px solid rgba(255,255,255,0.08)}
        .btn-gray:hover{transform:scale(1.02)}
        .btn-outline{background:transparent;border:1px solid var(--gold);color:var(--gold)}
        .btn-outline:hover{background:rgba(255,215,0,0.1)}
        .btn-sm{padding:4px 12px;font-size:11px}
        .btn-telegram{background:#0088cc;color:#fff}
        .btn-telegram:hover{transform:scale(1.02)}
        .btn-error{background:var(--error);color:#fff}
        .btn-error:hover{transform:scale(1.02)}
        .btn-success{background:var(--success);color:#111}
        .btn-success:hover{transform:scale(1.02)}
        
        .tabs-login{display:flex;gap:4px;background:#0a0a1a;border-radius:10px;padding:4px;margin-bottom:15px}
        .tab-login{flex:1;padding:8px;text-align:center;border:none;background:transparent;color:#666;font-family:'Cairo';font-weight:700;font-size:12px;border-radius:8px;cursor:pointer}
        .tab-login.active{background:rgba(255,215,0,0.15);color:var(--gold)}
        .tab-login i{margin-left:4px}
        .tab-login.admin-tab{display:none}
        .tab-login.admin-tab.show{display:block}
        .panel{display:none;animation:fadeIn 0.3s}
        .panel.show{display:block}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        
        input,select,textarea{width:100%;padding:10px 14px;margin:5px 0 12px;background:#0a0a1a;border:1px solid rgba(255,215,0,0.15);border-radius:10px;color:#fff;font-family:'Cairo';font-size:14px;outline:none}
        input:focus,select:focus,textarea:focus{border-color:var(--gold)}
        textarea{min-height:80px;resize:vertical}
        label{color:#aaa;font-size:13px;display:block}
        label i{color:var(--gold);margin-left:6px}
        .actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:5px}
        .err{display:none;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);border-radius:8px;padding:8px;color:var(--error);font-size:12px;text-align:center;margin-bottom:12px}
        .err.show{display:block}
        .load{display:none;align-items:center;justify-content:center;gap:10px;padding:8px;color:var(--gold);font-size:13px}
        .load.show{display:flex}
        .load .sp{width:16px;height:16px;border:2px solid rgba(255,215,0,0.15);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        
        .modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);z-index:1000;align-items:center;justify-content:center}
        .modal-overlay.show{display:flex}
        .modal-box{background:linear-gradient(145deg,#1a1a2e,#0a0a1a);border-radius:24px;padding:35px 30px;max-width:500px;width:90%;border:2px solid var(--gold);box-shadow:0 0 60px rgba(255,215,0,0.1);position:relative;max-height:90vh;overflow-y:auto}
        .modal-close{position:absolute;top:15px;left:20px;background:none;border:none;color:#666;font-size:28px;cursor:pointer;transition:0.3s}
        .modal-close:hover{color:var(--gold);transform:rotate(90deg)}
        .modal-title{text-align:center;margin-bottom:25px}
        .modal-title i{font-size:48px;color:var(--gold);display:block;margin-bottom:10px}
        .modal-title h2{color:var(--gold);font-size:22px}
        .modal-title p{color:#888;font-size:13px;margin-top:5px}
        .modal-shield{text-align:center;padding:15px;background:rgba(255,215,0,0.03);border-radius:12px;border:1px dashed rgba(255,215,0,0.2);margin-bottom:20px}
        .modal-shield i{font-size:28px;color:var(--gold);opacity:0.5}
        .modal-shield p{color:#555;font-size:12px;margin-top:5px}
        .modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
        
        .dashboard{display:none;width:100%;max-width:1200px;margin:0 auto}
        .dashboard.show{display:block}
        .topbar{background:#1a1a2e;border-radius:16px;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;border:1px solid rgba(255,215,0,0.15);margin-bottom:20px;flex-wrap:wrap;gap:10px}
        .topbar .user-info{display:flex;align-items:center;gap:12px}
        .topbar .user-info i{color:var(--gold);font-size:20px}
        .topbar .user-info span{color:#aaa;font-size:13px}
        .topbar .user-info strong{color:#fff}
        .topbar .store-badge{background:rgba(255,215,0,0.15);color:var(--gold);padding:4px 14px;border-radius:20px;font-size:12px;border:1px solid rgba(255,215,0,0.2)}
        .main-layout{display:flex;gap:20px}
        .sidebar{width:200px;flex-shrink:0;background:#1a1a2e;border-radius:16px;padding:15px 0;border:1px solid rgba(255,215,0,0.15)}
        .sidebar .menu-item{padding:12px 20px;color:#888;cursor:pointer;transition:0.3s;display:flex;align-items:center;gap:10px;font-size:14px;border-right:3px solid transparent}
        .sidebar .menu-item:hover{background:rgba(255,255,255,0.05);color:#fff}
        .sidebar .menu-item.active{color:var(--gold);background:rgba(255,215,0,0.08);border-right-color:var(--gold)}
        .sidebar .menu-item i{width:20px;text-align:center}
        .sidebar .menu-divider{height:1px;background:rgba(255,255,255,0.05);margin:8px 15px}
        .content{flex:1;background:#1a1a2e;border-radius:16px;padding:20px;border:1px solid rgba(255,215,0,0.15);min-height:400px}
        .content .page{display:none}
        .content .page.active{display:block}
        
        .stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:15px;margin-bottom:20px}
        .stat-card{background:#0a0a1a;border-radius:12px;padding:15px;text-align:center;border:1px solid rgba(255,215,0,0.08)}
        .stat-card .num{font-size:24px;font-weight:800;color:var(--gold)}
        .stat-card .label{font-size:12px;color:#888;margin-top:5px}
        
        .product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:15px}
        .product-card{background:#0a0a1a;border-radius:12px;padding:15px;text-align:center;border:2px solid rgba(255,215,0,0.08);transition:0.3s;cursor:pointer;position:relative}
        .product-card:hover{border-color:rgba(255,215,0,0.3);transform:translateY(-3px)}
        .product-card.selected{border-color:var(--gold);background:rgba(255,215,0,0.08);box-shadow:0 0 30px rgba(255,215,0,0.1)}
        .product-card .img{width:100%;height:140px;background:#0a0a1a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:50px;color:rgba(255,215,0,0.3);margin-bottom:10px;overflow:hidden;cursor:pointer;transition:0.3s}
        .product-card .img:hover{transform:scale(1.05);color:var(--gold)}
        .product-card .img img{width:100%;height:100%;object-fit:cover}
        .product-card .name{font-size:14px;font-weight:600;margin-bottom:5px}
        .product-card .price{color:var(--gold);font-size:16px;font-weight:700}
        .product-card .stock{font-size:13px;color:#888;margin:8px 0}
        .product-card .stock.low{color:var(--error)}
        
        .product-card.telegram-fetched{position:relative;overflow:hidden;border:2px solid #ffd700 !important;box-shadow:0 0 40px rgba(255,215,0,0.15), inset 0 0 40px rgba(255,215,0,0.05) !important;transition:all 0.3s ease}
        .product-card.telegram-fetched:hover{transform:translateY(-5px);box-shadow:0 0 60px rgba(255,215,0,0.25), inset 0 0 60px rgba(255,215,0,0.08) !important}
        .product-card.telegram-fetched::after{content:"";position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#ffd700,#ffed4e,#ffd700,#daa520,#ffd700);background-size:200% 100%;animation:goldShimmer 2s linear infinite;z-index:10;border-radius:0 0 12px 12px}
        @keyframes goldShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .product-card.telegram-fetched::before{content:"✦";position:absolute;top:8px;left:10px;color:#ffd700;font-size:18px;z-index:15;text-shadow:0 0 20px rgba(255,215,0,0.5);animation:goldPulse 2s ease-in-out infinite}
        @keyframes goldPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:0.7}}
        .product-card.telegram-fetched .img{border:2px solid rgba(255,215,0,0.3) !important;border-radius:8px;transition:all 0.3s ease}
        .product-card.telegram-fetched .img:hover{border-color:#ffd700 !important;transform:scale(1.03)}
        
        .quantity-controls{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding:8px;background:#0a0a1a;border-radius:8px}
        .quantity-controls button{width:32px;height:32px;border:none;border-radius:6px;background:#1a1a2e;color:var(--gold);font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .quantity-controls button:hover{background:var(--gold);color:#0a0a1a}
        .quantity-controls input{width:50px;text-align:center;background:#0a0a1a;border:1px solid rgba(255,215,0,0.15);border-radius:6px;color:#fff;padding:4px;font-size:14px;font-weight:700;margin:0}
        .quantity-controls input:focus{border-color:var(--gold);outline:none}
        
        .modal-product .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .modal-product .image-preview{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;min-height:80px;background:rgba(0,0,0,0.2);border-radius:12px;padding:10px;align-items:center}
        .modal-product .image-preview .img-item{position:relative;width:80px;height:80px;border-radius:8px;border:1px solid var(--gold);overflow:hidden}
        .modal-product .image-preview .img-item img{width:100%;height:100%;object-fit:cover}
        .modal-product .image-preview .img-item .remove-img{position:absolute;top:-6px;right:-6px;background:var(--error);color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:bold}
        
        .table-wrap{overflow-x:auto}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{text-align:right;padding:10px 12px;color:var(--gold);border-bottom:2px solid rgba(255,215,0,0.15);font-weight:600}
        td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.05)}
        .badge{padding:2px 10px;border-radius:20px;font-size:11px;display:inline-block}
        .badge-green{background:rgba(74,222,128,0.15);color:var(--success)}
        .badge-red{background:rgba(248,113,113,0.15);color:var(--error)}
        .badge-gold{background:rgba(255,215,0,0.15);color:var(--gold)}
        
        .cart-sidebar{position:fixed;left:20px;bottom:20px;z-index:999;display:none}
        .cart-sidebar.show{display:block}
        .cart-icon{position:relative;width:60px;height:60px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;color:#0a0a1a;font-size:26px;cursor:pointer;box-shadow:0 4px 20px rgba(255,215,0,0.3);transition:0.3s}
        .cart-icon:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(255,215,0,0.5)}
        .cart-icon .badge{position:absolute;top:-5px;right:-5px;background:var(--error);color:#fff;border-radius:50%;width:24px;height:24px;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #0a0a1a}
        .cart-icon .badge.hidden{display:none}
        
        .toast{position:fixed;bottom:20px;right:20px;padding:12px 18px;border-radius:12px;background:#1a1a2e;border:1px solid rgba(255,215,0,0.2);color:#fff;font-family:'Cairo';font-size:13px;z-index:999;animation:slideIn 0.3s}
        @keyframes slideIn{from{transform:translateX(100px)}to{transform:translateX(0)}}
        .hidden{display:none}
        
        .exchange-card{background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.2);border-radius:16px;padding:15px;margin-bottom:12px}
        
        @media (max-width:768px){.main-layout{flex-direction:column}.sidebar{width:100%;display:flex;flex-wrap:wrap;padding:8px;gap:4px}.sidebar .menu-item{padding:8px 14px;border-right:none;border-bottom:3px solid transparent;font-size:12px}.sidebar .menu-item.active{border-bottom-color:var(--gold);border-right-color:transparent}.sidebar .menu-divider{display:none}.topbar{flex-direction:column;align-items:stretch;text-align:center}.product-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}.stats{grid-template-columns:1fr 1fr}.cart-sidebar{left:10px;bottom:10px}.cart-icon{width:50px;height:50px;font-size:22px}.modal-product .grid-2{grid-template-columns:1fr}}
        @media (max-width:600px){.login-box{padding:20px 15px}.modal-box{padding:20px 15px;margin:10px}.stats{grid-template-columns:1fr 1fr;gap:10px}.product-grid{grid-template-columns:1fr 1fr;gap:10px}}
    </style>
</head>
<body>

<!-- ========================================== -->
<!-- نافذة الدخول -->
<!-- ========================================== -->
<div class="login-box" id="loginBox">
    <div class="logo" onclick="handleTripleClick()">
        <i class="fas fa-store-alt"></i>
        <h1>ناردو كارت برو</h1>
        <div class="hint" id="clickHint">👆 اضغط 3 مرات</div>
    </div>
    <div class="tabs-login">
        <button class="tab-login active" onclick="switchLoginTab('user')">
            <i class="fas fa-sign-in-alt"></i> دخول
        </button>
        <button class="tab-login admin-tab" id="adminTab" onclick="openAdminModal()">
            <i class="fas fa-user-shield"></i> مدير
        </button>
        <button class="tab-login" onclick="switchLoginTab('register')">
            <i class="fas fa-plus"></i> طلب
        </button>
    </div>

    <div class="panel show" id="panel-login">
        <div class="err" id="loginErr">⚠️ بيانات غير صحيحة</div>
        <div class="load" id="loginLoad"><div class="sp"></div> جاري...</div>
        <form onsubmit="handleUserLogin(event)">
            <label><i class="fas fa-phone"></i> رقم الهاتف</label>
            <input type="text" id="loginPhone" placeholder="أدخل رقم الهاتف" required>
            <label><i class="fas fa-lock"></i> كلمة المرور</label>
            <input type="password" id="loginPassword" placeholder="أدخل كلمة المرور" required>
            <div class="actions">
                <button class="btn btn-gold"><i class="fas fa-sign-in-alt"></i> دخول</button>
                <button type="button" class="btn btn-gray" onclick="clearLoginFields()"><i class="fas fa-undo"></i></button>
            </div>
        </form>
    </div>

    <div class="panel" id="panel-register">
        <div class="err" id="regErr">⚠️ املأ جميع الحقول</div>
        <div class="load" id="regLoad"><div class="sp"></div> جاري...</div>
        <form onsubmit="handleStoreRegister(event)">
            <label><i class="fas fa-store"></i> اسم المتجر</label>
            <input type="text" id="regStoreName" placeholder="اسم المتجر" required>
            <label><i class="fas fa-phone"></i> رقم الهاتف</label>
            <input type="text" id="regPhone" placeholder="05XXXXXXXX" required>
            <button class="btn btn-green"><i class="fas fa-paper-plane"></i> إرسال</button>
        </form>
    </div>
</div>

<!-- ========================================== -->
<!-- نافذة المدير الخفي -->
<!-- ========================================== -->
<div class="modal-overlay" id="adminModal">
    <div class="modal-box">
        <button class="modal-close" onclick="closeAdminModal()"><i class="fas fa-times"></i></button>
        <div class="modal-title">
            <i class="fas fa-user-secret"></i>
            <h2>🔐 الدخول السري للمدير</h2>
            <p>نافذة المدير العام</p>
        </div>
        <div class="modal-shield">
            <i class="fas fa-shield-alt"></i>
            <p>هذه النافذة مخصصة للمدير فقط</p>
        </div>
        <form onsubmit="adminModalLogin(event)">
            <label><i class="fas fa-key"></i> كلمة المرور السرية</label>
            <input type="password" id="modalAdminPass" placeholder="أدخل كلمة المرور" required>
            <div class="err" id="modalAdminErr">❌ كلمة المرور غير صحيحة</div>
            <div class="load" id="modalAdminLoad"><div class="sp"></div> جاري...</div>
            <div id="modalVSection" class="hidden" style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,215,0,0.1);">
                <div style="text-align:center;color:var(--gold);font-size:13px;margin-bottom:10px;">
                    <i class="fas fa-shield-alt"></i> أدخل رمز التحقق
                </div>
                <label><i class="fas fa-code"></i> الرمز</label>
                <input type="text" id="modalVerifyCode" placeholder="أدخل الرمز" maxlength="6" style="text-align:center;font-size:18px;letter-spacing:3px;">
                <div class="err" id="modalVerifyErr">❌ الرمز غير صحيح</div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-gold" onclick="modalVerify()"><i class="fas fa-check"></i> تحقق</button>
                    <button type="button" class="btn btn-gray" onclick="modalResend()"><i class="fas fa-redo"></i> إعادة</button>
                </div>
            </div>
            <div class="modal-actions" style="margin-top:15px;">
                <button type="submit" class="btn btn-gold"><i class="fas fa-sign-in-alt"></i> دخول</button>
                <button type="button" class="btn btn-gray" onclick="closeAdminModal()"><i class="fas fa-times"></i> إلغاء</button>
            </div>
        </form>
        <div style="text-align:center;margin-top:15px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.05);">
            <span style="color:#555;font-size:11px;">🔑 كلمة المرور: <strong style="color:var(--gold);">admin123</strong></span>
        </div>
    </div>
</div>

<!-- ========================================== -->
<!-- نافذة طلب فتح متجر (مثل المرجعي الثاني) -->
<!-- ========================================== -->
<div class="modal-overlay" id="storeRequestModal">
    <div class="modal-box" style="max-width:450px;">
        <button class="modal-close" onclick="closeStoreRequestModal()"><i class="fas fa-times"></i></button>
        <div class="modal-title">
            <i class="fas fa-store"></i>
            <h2>🏪 طلب فتح متجر جديد</h2>
            <p>أدخل بيانات المتجر المطلوب</p>
        </div>
        <form id="storeRequestForm" onsubmit="handleStoreRegister(event)">
            <label><i class="fas fa-store"></i> اسم المتجر</label>
            <input type="text" id="reqStoreName" placeholder="أدخل اسم المتجر" required>
            
            <label><i class="fas fa-phone"></i> رقم الهاتف</label>
            <input type="text" id="reqStorePhone" placeholder="05XXXXXXXX" required>
            
            <div style="display:flex;gap:10px;margin-top:15px;">
                <button type="submit" class="btn btn-gold" style="flex:1;"><i class="fas fa-paper-plane"></i> إرسال الطلب</button>
                <button type="button" class="btn btn-gray" onclick="closeStoreRequestModal()" style="flex:1;"><i class="fas fa-times"></i> إلغاء</button>
            </div>
        </form>
        <div style="text-align:center;margin-top:15px;padding:10px;background:rgba(255,215,0,0.05);border-radius:8px;font-size:12px;color:#888;">
            <i class="fas fa-info-circle"></i> سيتم إرسال طلبك إلى المدير للموافقة عليه
        </div>
    </div>
</div>

<!-- ========================================== -->
<!-- نافذة إضافة منتج -->
<!-- ========================================== -->
<div class="modal-overlay modal-product" id="productModal">
    <div class="modal-box" style="max-width:600px;">
        <button class="modal-close" onclick="closeProductModal()"><i class="fas fa-times"></i></button>
        <div class="modal-title">
            <i class="fas fa-box"></i>
            <h2 id="productModalTitle">➕ إضافة منتج جديد</h2>
            <p id="productModalSub">أدخل بيانات المنتج</p>
        </div>
        <form id="productForm">
            <input type="hidden" id="editProductId" value="">
            <input type="hidden" id="productImages" value="[]">
            
            <label><i class="fas fa-barcode"></i> الباركود</label>
            <input type="text" id="pBarcode" placeholder="الباركود" required>
            
            <label><i class="fas fa-tag"></i> اسم المنتج</label>
            <input type="text" id="pName" placeholder="اسم المنتج" required>
            
            <label><i class="fas fa-id-card"></i> معرف المنتج</label>
            <input type="text" id="pProductId" placeholder="معرف المنتج (اختياري)">
            
            <div class="grid-2">
                <div>
                    <label><i class="fas fa-store"></i> المتجر</label>
                    <select id="pStore" required></select>
                </div>
                <div>
                    <label><i class="fas fa-tag"></i> الفئة</label>
                    <input type="text" id="pCategory" placeholder="الفئة">
                </div>
            </div>
            
            <div class="grid-2">
                <div>
                    <label><i class="fas fa-money-bill"></i> السعر (دج)</label>
                    <input type="number" id="pPrice" placeholder="السعر" required min="0">
                </div>
                <div>
                    <label><i class="fas fa-cubes"></i> الكمية</label>
                    <input type="number" id="pStock" placeholder="الكمية" required min="0">
                </div>
            </div>
            
            <label><i class="fas fa-image"></i> صور المنتج</label>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
                <input type="file" id="pImageFile" accept="image/*" multiple style="display:none;">
                <button type="button" class="btn btn-gold btn-sm" onclick="document.getElementById('pImageFile').click()">
                    <i class="fas fa-upload"></i> تحميل صورة
                </button>
                <button type="button" class="btn btn-outline btn-sm" onclick="addProductImageUrl()">
                    <i class="fas fa-link"></i> إضافة رابط
                </button>
            </div>
            <div class="image-preview" id="imagePreview" style="min-height:80px;background:rgba(0,0,0,0.2);border-radius:12px;padding:10px;"></div>
            
            <label><i class="fas fa-align-left"></i> الوصف</label>
            <textarea id="pDescription" placeholder="وصف المنتج..."></textarea>
            
            <div class="modal-actions" style="grid-template-columns:1fr 1fr 1fr;">
                <button type="button" class="btn btn-gold" onclick="saveProductOnly()"><i class="fas fa-save"></i> حفظ فقط</button>
                <button type="button" class="btn btn-telegram" onclick="saveAndPublishProduct()"><i class="fab fa-telegram"></i> حفظ ونشر</button>
                <button type="button" class="btn btn-gray" onclick="closeProductModal()"><i class="fas fa-times"></i> إلغاء</button>
            </div>
        </form>
    </div>
</div>

<!-- ========================================== -->
<!-- الواجهة الرئيسية -->
<!-- ========================================== -->
<div class="dashboard" id="dashboard">
    <div class="topbar">
        <div class="user-info">
            <i class="fas fa-user-circle"></i>
            <div>
                <strong id="userName">المستخدم</strong>
                <span id="userRole" style="display:block;font-size:11px;color:#666;">دور</span>
            </div>
        </div>
        <div id="adminStoreSelector" style="display:none;position:relative;">
            <select id="storeSelector" onchange="switchStore(this.value)">
                <option value="">🏪 اختر متجراً</option>
            </select>
        </div>
        <div><span class="store-badge" id="storeBadge">🏪 المستودع الرئيسي</span></div>
        <button class="btn btn-red" onclick="logout()" style="width:auto;padding:8px 20px;font-size:12px;">
            <i class="fas fa-sign-out-alt"></i> خروج
        </button>
    </div>

    <div class="main-layout">
        <div class="sidebar">
            <div class="menu-item active" onclick="showPage('home')"><i class="fas fa-home"></i> الرئيسية</div>
            <div class="menu-item" onclick="showPage('products')"><i class="fas fa-box"></i> المنتجات</div>
            <div class="menu-item" onclick="showPage('orders')"><i class="fas fa-shopping-cart"></i> الطلبات</div>
            <div class="menu-item" onclick="showPage('inventory')"><i class="fas fa-warehouse"></i> المخزون</div>
            <div class="menu-divider"></div>
            <div class="menu-item" onclick="showPage('stores')"><i class="fas fa-store"></i> المتاجر</div>
            <div class="menu-item" onclick="showPage('storeRequests')"><i class="fas fa-clock"></i> طلبات المتاجر</div>
            <div class="menu-divider"></div>
            <div class="menu-item" onclick="showPage('reports')"><i class="fas fa-chart-bar"></i> التقارير</div>
            <div class="menu-item" onclick="showPage('settings')"><i class="fas fa-cog"></i> الإعدادات</div>
        </div>

        <div class="content">
            <div class="page active" id="page-home">
                <h2 style="color:var(--gold);margin-bottom:15px;"><i class="fas fa-home"></i> لوحة التحكم</h2>
                <div class="stats" id="statsContainer">
                    <div class="stat-card"><div class="num" id="statProducts">0</div><div class="label">المنتجات</div></div>
                    <div class="stat-card"><div class="num" id="statOrders">0</div><div class="label">الطلبات</div></div>
                    <div class="stat-card"><div class="num" id="statRevenue">0</div><div class="label">الإيرادات</div></div>
                    <div class="stat-card"><div class="num" id="statStock">0</div><div class="label">نقص المخزون</div></div>
                    <div class="stat-card"><div class="num" id="statStores">0</div><div class="label">المتاجر</div></div>
                </div>
                <div style="background:#0a0a1a;border-radius:12px;padding:20px;border:1px solid rgba(255,215,0,0.08);">
                    <h3 style="color:#aaa;font-size:14px;margin-bottom:10px;"><i class="fas fa-clock"></i> النشاط الأخير</h3>
                    <div id="recentActivity" style="color:#888;font-size:13px;">لا يوجد نشاط</div>
                </div>
            </div>

            <div class="page" id="page-products">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;flex-wrap:wrap;gap:10px;">
                    <h2 style="color:var(--gold);"><i class="fas fa-box"></i> المنتجات</h2>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button class="btn btn-gold" onclick="openProductModal()" style="width:auto;padding:8px 20px;font-size:13px;">
                            <i class="fas fa-plus"></i> إضافة
                        </button>
                    </div>
                </div>
                <div class="product-grid" id="productGrid"></div>
            </div>

            <div class="page" id="page-orders">
                <h2 style="color:var(--gold);margin-bottom:15px;"><i class="fas fa-shopping-cart"></i> الطلبات</h2>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>#</th><th>العميل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th></tr></thead>
                        <tbody id="ordersTable"></tbody>
                    </table>
                </div>
            </div>

            <div class="page" id="page-inventory">
                <h2 style="color:var(--gold);margin-bottom:15px;"><i class="fas fa-warehouse"></i> المخزون</h2>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>#</th><th>المنتج</th><th>الفئة</th><th>السعر</th><th>الكمية</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                        <tbody id="inventoryTable"></tbody>
                    </table>
                </div>
            </div>

            <div class="page" id="page-stores">
                <h2 style="color:var(--gold);margin-bottom:20px;"><i class="fas fa-store"></i> 🏪 إدارة المتاجر</h2>
                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
                    <button class="btn btn-gold" onclick="openStoreRequestModal()" style="width:auto;padding:8px 20px;font-size:13px;">
                        <i class="fas fa-plus"></i> طلب متجر جديد
                    </button>
                    <button class="btn btn-purple" onclick="renderStores()" style="width:auto;padding:8px 20px;font-size:13px;">
                        <i class="fas fa-sync"></i> تحديث
                    </button>
                </div>
                <div id="storesList"></div>
            </div>

            <div class="page" id="page-storeRequests">
                <h2 style="color:var(--gold);margin-bottom:20px;"><i class="fas fa-clock"></i> 📋 طلبات فتح المتاجر</h2>
                <div id="storeRequestsContainer"></div>
            </div>

            <div class="page" id="page-reports">
                <h2 style="color:var(--gold);margin-bottom:15px;"><i class="fas fa-chart-bar"></i> التقارير</h2>
                <div style="color:#888;font-size:14px;">📊 قريباً...</div>
            </div>

            <div class="page" id="page-settings">
                <h2 style="color:var(--gold);margin-bottom:15px;"><i class="fas fa-cog"></i> الإعدادات</h2>
                <div style="color:#888;font-size:14px;">⚙️ قريباً...</div>
            </div>
        </div>
    </div>
</div>

<!-- ========================================== -->
<!-- السلة الجانبية -->
<!-- ========================================== -->
<div class="cart-sidebar" id="cartSidebar">
    <div class="cart-icon" onclick="openCartModal()">
        <i class="fas fa-shopping-cart"></i>
        <span class="badge hidden" id="cartBadge">0</span>
    </div>
</div>

<!-- ========================================== -->
<!-- نافذة السلة -->
<!-- ========================================== -->
<div class="modal-overlay" id="cartModal">
    <div class="modal-box" style="max-width:600px;">
        <button class="modal-close" onclick="closeCartModal()"><i class="fas fa-times"></i></button>
        <div class="modal-title">
            <i class="fas fa-shopping-cart"></i>
            <h2>🛒 سلة التسوق</h2>
            <p id="cartStoreName">متجر: المستودع الرئيسي</p>
        </div>
        <div id="cartItemsContainer"><div class="empty-cart" style="text-align:center;color:#666;padding:40px 0;">🛒 سلة فارغة</div></div>
        <div class="cart-total" style="padding:15px 0;font-size:18px;font-weight:700;color:var(--gold);text-align:center;border-top:2px solid rgba(255,215,0,0.2);margin-top:10px;">
            المجموع: <span id="cartTotalAmount">0</span> دج
        </div>
        <div class="modal-actions">
            <button class="btn btn-red" onclick="clearCart()"><i class="fas fa-trash"></i> تفريغ</button>
            <button class="btn btn-gold" onclick="checkoutFastCart()"><i class="fas fa-check"></i> إتمام الشراء</button>
        </div>
    </div>
</div>

<!-- ========================================== -->
<!-- نافذة الفاتورة -->
<!-- ========================================== -->
<div class="modal-overlay" id="invoiceModal">
    <div class="modal-box" style="max-width:500px;">
        <button class="modal-close" onclick="closeInvoiceModal()"><i class="fas fa-times"></i></button>
        <div class="modal-title">
            <i class="fas fa-receipt"></i>
            <h2>🧾 الفاتورة</h2>
            <p id="invoiceStore">المتجر: المستودع الرئيسي</p>
            <p id="invoiceDate" style="color:#666;font-size:12px;"></p>
        </div>
        <div id="invoiceItems"></div>
        <div class="invoice-total" style="font-size:18px;font-weight:700;color:var(--gold);padding:15px 0;text-align:center;border-top:2px solid rgba(255,215,0,0.2);margin-top:10px;">
            المجموع الكلي: <span id="invoiceTotalAmount">0</span> دج
        </div>
        <div class="modal-actions">
            <button class="btn btn-gray" onclick="closeInvoiceModal()"><i class="fas fa-times"></i> إغلاق</button>
            <button class="btn btn-green" onclick="printInvoice()"><i class="fas fa-print"></i> طباعة</button>
        </div>
    </div>
</div>

<!-- ========================================== -->
<!-- جافا سكريبت -->
<!-- ========================================== -->
<script>
// ============================================================
// 📡 إعدادات التليجرام
// ============================================================
const TELEGRAM = {
    botToken: '8309126051:AAH879JCr5fQBfaG8knbUAgmSB3wCBXKd5s',
    channelId: '-1004434068057',
    apiUrl: 'https://api.telegram.org/bot'
};
// ============================================================
// 👤 نظام المستخدمين خاص بدخول مستخدم (من الملف المرجعي)
// ============================================================

function loadUsers() {
    const storedUsers = localStorage.getItem('nardoUsers');
    if (storedUsers) {
        try {
            users = JSON.parse(storedUsers);
            console.log('✅ تم تحميل المستخدمين:', users.length);
            return;
        } catch (e) {
            console.error('❌ فشل تحميل المستخدمين:', e);
        }
    }
    
    // محاولة المفتاح القديم للتوافق
    const oldUsers = localStorage.getItem('nardo_users');
    if (oldUsers) {
        try {
            users = JSON.parse(oldUsers);
            localStorage.setItem('nardoUsers', JSON.stringify(users));
            localStorage.removeItem('nardo_users');
            console.log('✅ تم ترقية المستخدمين من المفتاح القديم');
            return;
        } catch (e) {}
    }
    
    // إنشاء المستخدم الافتراضي
    users = [
        {
            id: 'admin-001',
            phone: '0555000000',
            password: 'admin123',
            name: 'المدير العام',
            role: 'admin',
            level: 'super',
            storeId: stores.find(s => s.isMain)?.id || null,
            status: 'active',
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('nardoUsers', JSON.stringify(users));
    console.log('✅ تم إنشاء المستخدم الافتراضي');
}

function saveUserSession() {
    if (currentUser) {
        sessionStorage.setItem('nardoSession', JSON.stringify(currentUser));
        localStorage.setItem('nardo_current_user', JSON.stringify(currentUser));
    }
}

function updateUIBasedOnRole() {
    if (!currentUser) return;
    
    const isAdmin = currentUser.role === 'admin';
    
    document.querySelectorAll('.sidebar .menu-item').forEach(item => {
        const text = item.textContent || item.innerText;
        if (!isAdmin && (text.includes('المتاجر') || text.includes('طلبات المتاجر') || text.includes('التقارير'))) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
        }
    });
    
    if (!isAdmin && currentUser.storeId) {
        currentStoreId = currentUser.storeId;
        const select = document.getElementById('currentStore');
        if (select) {
            select.value = currentStoreId;
            select.disabled = true;
        }
    }
}

// ============================================================
// 🔍 التحقق من الموافقة عبر القناة (من الملف المرجعي)
// ============================================================

async function checkApprovalBeforeLogin(phone, password) {
    try {
        const res = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates?limit=100`);
        const data = await res.json();
        if (!data.ok) return false;
        
        for (const update of data.result || []) {
            const msg = update.channel_post || update.message;
            if (!msg || !msg.text) continue;
            const text = msg.text;
            
            if (text.includes('✅ تمت الموافقة') && text.includes(phone) && text.includes(password)) {
                return true;
            }
        }
        return false;
    } catch(e) {
        console.error('❌ خطأ في التحقق من الموافقة:', e);
        return false;
    }
}

async function getUserDataFromChannel(phone, password) {
    try {
        const res = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates?limit=100`);
        const data = await res.json();
        if (!data.ok) return null;
        
        for (const update of data.result || []) {
            const msg = update.channel_post || update.message;
            if (!msg || !msg.text) continue;
            const text = msg.text;
            
            if (text.includes('✅ تمت الموافقة') && text.includes(phone) && text.includes(password)) {
                const nameMatch = text.match(/🏪 اسم المتجر:\s*([^\n]+)/);
                const codeMatch = text.match(/🆔 معرف المتجر:\s*([^\n]+)/);
                const phoneMatch = text.match(/📞 رقم الهاتف:\s*([^\n]+)/);
                const passMatch = text.match(/🔐 كلمة المرور:\s*([^\n]+)/);
                
                if (nameMatch && codeMatch) {
                    return {
                        name: nameMatch[1].trim(),
                        code: codeMatch[1].trim(),
                        phone: phoneMatch ? phoneMatch[1].trim() : phone,
                        password: passMatch ? passMatch[1].trim() : password
                    };
                }
            }
        }
        return null;
    } catch(e) {
        console.error('❌ خطأ في جلب بيانات المستخدم:', e);
        return null;
    }
}    

// ============================================================
// 📂 البيانات الأساسية
// ============================================================
let currentUser = null;
let currentStoreId = null;
let clickCount = 0;
let verificationCode = null;
let sessionTimer = null;
let stores = JSON.parse(localStorage.getItem('nardo_stores') || '[]');
let users = JSON.parse(localStorage.getItem('nardo_users') || '[]');
let inventory = JSON.parse(localStorage.getItem('nardo_products') || '[]');
let orders = JSON.parse(localStorage.getItem('nardo_orders') || '[]');
let cart = JSON.parse(localStorage.getItem('nardo_cart') || '[]');
let pendingStoreRequests = JSON.parse(localStorage.getItem('nardoPendingStores') || '[]');
let processedProductIds = JSON.parse(localStorage.getItem('nardo_processed_product_ids') || '[]');
let lastAutoFetchTime = 0;
const AUTO_FETCH_INTERVAL = 15000;

// ============================================================
// 📨 دوال إرسال رسائل التليجرام
// ============================================================

// 1. إرسال رسالة عادية
async function sendToTelegram(text, chatId = null, buttons = null) {
    const targetId = chatId || TELEGRAM.channelId;
    const url = `${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`;
    try {
        const payload = {
            chat_id: targetId,
            text: text,
            parse_mode: 'HTML'
        };
        if (buttons) {
            payload.reply_markup = {
                inline_keyboard: buttons
            };
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return {
            success: data.ok,
            error: data.description,
            messageId: data.result?.message_id
        };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// 2. إرسال رسالة مع أزرار تفاعلية
async function sendToTelegramWithButtons(message, requestId) {
    try {
        const url = `${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM.channelId,
                text: message,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '✅ موافقة', callback_data: `approve_${requestId}` },
                            { text: '❌ رفض', callback_data: `reject_${requestId}` }
                        ],
                        [
                            { text: '📦 عرض التفاصيل', callback_data: `details_${requestId}` }
                        ]
                    ]
                }
            })
        });
        const data = await response.json();
        console.log('📨 نتيجة الإرسال:', data);
        return data.ok;
    } catch (e) {
        console.error('❌ فشل الإرسال بالأزرار:', e);
        return false;
    }
}

// 3. إرسال صورة مع نص
async function sendPhotoToTelegram(imageFile, caption) {
    try {
        const fd = new FormData();
        fd.append('chat_id', TELEGRAM.channelId);
        fd.append('photo', imageFile);
        fd.append('caption', caption);
        fd.append('parse_mode', 'HTML');
        const res = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendPhoto`, {
            method: 'POST',
            body: fd
        });
        const data = await res.json();
        return {
            success: data.ok,
            messageId: data.result?.message_id,
            error: data.description
        };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// 4. إرسال رسالة (اختصار)
async function sendTg(message) {
    const result = await sendToTelegram(message, TELEGRAM.channelId);
    return result.success;
}

// ============================================================
// 📥 جلب الرسائل من التليجرام
// ============================================================
async function fetchTelegramMessages(limit = 100) {
    try {
        const url = `${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates?limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data.ok) {
            throw new Error(data.description || 'فشل جلب البيانات');
        }
        return data.result || [];
    } catch (e) {
        console.error('❌ خطأ في جلب الرسائل:', e);
        return [];
    }
}

// ============================================================
// 🔐 نظام الدخول
// ============================================================

function handleTripleClick() {
    const hint = document.getElementById('clickHint');
    if (!hint) return;
    clickCount++;
    hint.classList.add('show');
    hint.textContent = 3 - clickCount + '';
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
        clickCount = 0;
        hint.textContent = '👆 اضغط 3 مرات';
        hint.classList.remove('show');
    }, 2000);
    if (clickCount >= 3) {
        clickCount = 0;
        hint.textContent = '✅';
        document.getElementById('adminTab').classList.add('show');
        setTimeout(() => {
            hint.textContent = '👆 اضغط 3 مرات';
            hint.classList.remove('show');
        }, 1500);
        openAdminModal();
    }
}

function switchLoginTab(tab) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('show'));
    document.querySelectorAll('.tab-login').forEach(t => t.classList.remove('active'));
    if (tab === 'user') {
        document.getElementById('panel-login').classList.add('show');
        document.querySelector('.tab-login[onclick="switchLoginTab(\'user\')"]').classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('panel-register').classList.add('show');
        document.querySelector('.tab-login[onclick="switchLoginTab(\'register\')"]').classList.add('active');
    }
}

function openAdminModal() {
    document.getElementById('adminModal').classList.add('show');
    document.getElementById('modalAdminPass').value = '';
    document.getElementById('modalAdminErr').classList.remove('show');
    document.getElementById('modalAdminLoad').classList.remove('show');
    document.getElementById('modalVSection').classList.add('hidden');
    document.getElementById('modalVerifyCode').value = '';
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('show');
}

async function adminModalLogin(e) {
    e.preventDefault();
    const password = document.getElementById('modalAdminPass').value;
    if (password !== 'admin123') {
        document.getElementById('modalAdminErr').classList.add('show');
        return;
    }
    document.getElementById('modalAdminLoad').classList.add('show');
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const ok = await sendTg('🔐 رمز التحقق: <b>' + verificationCode + '</b>');
    document.getElementById('modalAdminLoad').classList.remove('show');
    if (ok) {
        document.getElementById('modalVSection').classList.remove('hidden');
        toast('✅ تم إرسال الرمز');
    } else {
        toast('❌ فشل الإرسال');
    }
}

function modalVerify() {
    const code = document.getElementById('modalVerifyCode').value.trim();
    if (code === verificationCode) {
        toast('✅ مرحباً أيها المدير');
        document.getElementById('modalVSection').classList.add('hidden');
        document.getElementById('modalVerifyCode').value = '';
        closeAdminModal();
        currentUser = {
            id: 'admin-001',
            name: 'المدير العام',
            phone: '0555000000',
            role: 'admin',
            level: 'super'
        };
        let mainStore = stores.find(s => s.isMain === true);
        if (!mainStore) {
            mainStore = {
                id: Date.now(),
                name: 'المتجر الرئيسي',
                code: 'MAIN-001',
                isMain: true,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            stores.unshift(mainStore);
            localStorage.setItem('nardo_stores', JSON.stringify(stores));
        }
        currentStoreId = mainStore.id;
        showDashboard();
        updateStoreSelector();
        renderStores();
        renderStoreRequests();
        renderShop();
        renderInventory();
        updateStats();
        startAutoFetch();
        startStoreRequestWatcher();
    } else {
        document.getElementById('modalVerifyErr').classList.add('show');
        setTimeout(() => document.getElementById('modalVerifyErr').classList.remove('show'), 3000);
    }
}

async function modalResend() {
    if (!verificationCode) {
        toast('⚠️ اطلب رمزاً أولاً');
        return;
    }
    const ok = await sendTg('🔐 إعادة: <b>' + verificationCode + '</b>');
    if (ok) toast('✅ تم إعادة الإرسال');
    else toast('❌ فشل الإرسال');
}

async function handleUserLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!phone || !password) {
        document.getElementById('loginErr').textContent = '⚠️ يرجى إدخال جميع البيانات';
        document.getElementById('loginErr').classList.add('show');
        return;
    }
    
    document.getElementById('loginLoad').classList.add('show');
    await sleep(500);
    
    // ✅ 1. تحميل المستخدمين
    loadUsers();
    
    // ✅ 2. البحث عن المستخدم
    let user = users.find(u => u.phone === phone);
    
    // ✅ 3. إذا لم يوجد، جلب من القناة
    if (!user) {
        document.getElementById('loginErr').textContent = '⏳ جاري التحقق من الموافقة في القناة...';
        document.getElementById('loginErr').classList.add('show');
        await sleep(1000);
        
        const hasApproval = await checkApprovalBeforeLogin(phone, password);
        
        if (!hasApproval) {
            document.getElementById('loginLoad').classList.remove('show');
            document.getElementById('loginErr').textContent = '⏳ لم تتم الموافقة على طلبك بعد. يرجى الانتظار حتى يوافق المدير.';
            document.getElementById('loginErr').classList.add('show');
            setTimeout(() => document.getElementById('loginErr').classList.remove('show'), 5000);
            return;
        }
        
        const userData = await getUserDataFromChannel(phone, password);
        
        if (!userData) {
            document.getElementById('loginLoad').classList.remove('show');
            document.getElementById('loginErr').textContent = '❌ لم يتم العثور على بيانات المتجر في القناة';
            document.getElementById('loginErr').classList.add('show');
            setTimeout(() => document.getElementById('loginErr').classList.remove('show'), 3000);
            return;
        }
        
        // ✅ إنشاء المتجر والمستخدم تلقائياً
        const newStoreId = Date.now();
        const newStore = {
            id: newStoreId,
            name: userData.name,
            code: userData.code,
            phone: userData.phone,
            location: '',
            isMain: false,
            type: 'sub',
            status: 'active',
            createdAt: new Date().toISOString()
        };
        stores.push(newStore);
        
        const newUser = {
            id: 'user-' + Date.now(),
            phone: userData.phone,
            password: userData.password,
            name: userData.name,
            role: 'user',
            storeId: newStoreId,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        
        localStorage.setItem('nardo_stores', JSON.stringify(stores));
        localStorage.setItem('nardoUsers', JSON.stringify(users));
        
        user = newUser;
        
        toast('✅ تم إنشاء حسابك تلقائياً من القناة!', 'success');
    }
    
    document.getElementById('loginLoad').classList.remove('show');
    document.getElementById('loginErr').classList.remove('show');
    
    // ✅ التحقق من كلمة المرور
    if (user.password !== password) {
        document.getElementById('loginErr').textContent = '❌ كلمة المرور غير صحيحة';
        document.getElementById('loginErr').classList.add('show');
        setTimeout(() => document.getElementById('loginErr').classList.remove('show'), 3000);
        return;
    }
    
    const store = stores.find(s => s.id === user.storeId);
    
    if (!store) {
        document.getElementById('loginErr').textContent = '❌ لا يوجد متجر مرتبط';
        document.getElementById('loginErr').classList.add('show');
        return;
    }
    
    if (store.status !== 'active') {
        document.getElementById('loginErr').textContent = '⏳ المتجر غير مفعل بعد';
        document.getElementById('loginErr').classList.add('show');
        return;
    }
    
    // ✅ تسجيل الدخول
    currentUser = user;
    currentStoreId = store.id;
    saveUserSession();
    
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('dashboard').classList.add('show');
    document.getElementById('cartSidebar').classList.add('show');
    
    document.getElementById('userName').textContent = currentUser.name || 'المستخدم';
    document.getElementById('userRole').textContent = currentUser.role || 'مستخدم';
    document.getElementById('storeBadge').textContent = '🏪 ' + store.name;
    document.getElementById('cartStoreName').textContent = 'متجر: ' + store.name;
    
    renderShop();
    renderInventory();
    renderStores();
    renderStoreRequests();
    updateStats();
    updateStoreSelector();
    updateUIBasedOnRole();
    
    startAutoFetch();
    startStoreRequestWatcher();
    
    toast(`✅ مرحباً بك في متجر "${store.name}"`);
}

function showDashboard() {
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('dashboard').classList.add('show');
    document.getElementById('cartSidebar').classList.add('show');
    document.getElementById('userName').textContent = currentUser.name || 'المستخدم';
    document.getElementById('userRole').textContent = currentUser.role || 'مستخدم';
    const store = stores.find(s => s.id === currentStoreId);
    if (store) {
        document.getElementById('storeBadge').textContent = '🏪 ' + store.name;
        document.getElementById('cartStoreName').textContent = 'متجر: ' + store.name;
    }
    renderShop();
    renderInventory();
    renderStores();
    renderStoreRequests();
    updateStats();
    updateStoreSelector();
    if (currentUser && currentUser.role === 'admin') {
        startStoreRequestWatcher();
    }
}

function logout() {
    if (!currentUser) return;
    if (confirm('هل تريد تسجيل الخروج؟')) {
        sessionStorage.removeItem('nardo_session');
        currentUser = null;
        currentStoreId = null;
        cart = [];
        document.getElementById('loginBox').classList.remove('hidden');
        document.getElementById('dashboard').classList.remove('show');
        document.getElementById('cartSidebar').classList.remove('show');
        toast('👋 تم الخروج');
    }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function toast(message, type = 'info') {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

function clearLoginFields() {
    document.getElementById('loginPhone').value = '';
    document.getElementById('loginPassword').value = '';
}

// ============================================================
// 📂 قسم طلب فتح متجر (مثل المرجعي الثاني)
// ============================================================

// 1. فتح وإغلاق نافذة الطلب
function openStoreRequestModal() {
    document.getElementById('storeRequestModal').classList.add('show');
    document.getElementById('reqStoreName').value = '';
    document.getElementById('reqStorePhone').value = '';
}

function closeStoreRequestModal() {
    document.getElementById('storeRequestModal').classList.remove('show');
}


// ==========================================
//  2. دالة تسجيل طلب فتح متجر (بدون حقل الموقع)
// ==========================================
async function handleStoreRegister(e) {
    e.preventDefault();
    
    // ✅ محاولة الحصول على البيانات من النموذج الأول (نافذة الطلب)
    let nameInput = document.getElementById('reqStoreName');
    let phoneInput = document.getElementById('reqStorePhone');
    let name = nameInput?.value?.trim() || '';
    let phone = phoneInput?.value?.trim() || '';
    
    // ✅ إذا لم توجد، جرب النموذج الثاني (شاشة الدخول - تبويب طلب)
    if (!name || !phone) {
        nameInput = document.getElementById('regStoreName');
        phoneInput = document.getElementById('regPhone');
        name = nameInput?.value?.trim() || '';
        phone = phoneInput?.value?.trim() || '';
    }
    
    // ✅ التحقق النهائي
    if (!name || !phone) {
        toast('⚠️ يرجى إدخال اسم المتجر ورقم الهاتف');
        return;
    }
    
    // ✅ تنظيف رقم الهاتف
    const cleanPhone = phone.replace(/\s/g, '').replace(/\+/g, '');
    
    if (cleanPhone.length < 5) {
        toast('⚠️ رقم الهاتف يجب أن يكون 5 أرقام على الأقل');
        if (phoneInput) {
            phoneInput.style.borderColor = '#f87171';
            setTimeout(() => phoneInput.style.borderColor = '', 3000);
            phoneInput.focus();
        }
        return;
    }
    
    // ✅ التحقق من الطلبات المعلقة
    if (pendingStoreRequests.find(r => r.phone === cleanPhone && r.status === 'pending')) {
        toast('⚠️ يوجد طلب معلق لهذا الرقم');
        return;
    }
    
    // ✅ التحقق من وجود المتجر
    if (stores.find(s => s.phone === cleanPhone)) {
        toast('⚠️ هذا الرقم مسجل لمتجر موجود');
        return;
    }
    
    // ✅ إنشاء الطلب
    const requestId = 'REQ-' + Date.now();
    const newRequest = {
        id: requestId,
        name: name,
        phone: cleanPhone,
        status: 'pending',
        timestamp: new Date().toISOString(),
        approvedStoreId: null
    };
    
    pendingStoreRequests.push(newRequest);
    localStorage.setItem('nardoPendingStores', JSON.stringify(pendingStoreRequests));
    
    // ✅ إرسال للتليجرام
    await sendStoreRequestToTelegram(newRequest);
    
    // ✅ تنظيف كلا النموذجين
    const allNameInputs = document.querySelectorAll('#reqStoreName, #regStoreName');
    const allPhoneInputs = document.querySelectorAll('#reqStorePhone, #regPhone');
    allNameInputs.forEach(el => el.value = '');
    allPhoneInputs.forEach(el => el.value = '');
    
    // ✅ إغلاق النافذة إذا كانت مفتوحة
    const modal = document.getElementById('storeRequestModal');
    if (modal) modal.classList.remove('show');
    
    toast('✅ تم إرسال طلبك بنجاح، في انتظار موافقة المدير');
    renderStoreRequests();
}
    
// 3. إرسال الطلب للتليجرام
async function sendStoreRequestToTelegram(storeRequest) {
    const sentRequests = JSON.parse(localStorage.getItem('sent_store_requests') || '[]');
    if (sentRequests.includes(storeRequest.id)) return false;
    
    // ✅ نفس تنسيق المرجعي
    const message = `🏪 طلب فتح متجر جديد\n━━━━━━━━━━━━━━━━━━━━━━\n📝 اسم المتجر: ${storeRequest.name}\n📞 الهاتف: ${storeRequest.phone}\n🆔 معرف الطلب: ${storeRequest.id}\n⏰ التاريخ: ${new Date().toLocaleString('ar-EG')}\n━━━━━━━━━━━━━━━━━━━━━━\n✅ اضغط على الزر المناسب للموافقة أو الرفض`;
    
    const result = await sendToTelegramWithButtons(message, storeRequest.id);
    
    if (result) {
        sentRequests.push(storeRequest.id);
        localStorage.setItem('sent_store_requests', JSON.stringify(sentRequests));
        return true;
    }
    return false;
}

// 4. عرض طلبات المتاجر
function renderStoreRequests() {
    const container = document.getElementById('storeRequestsContainer');
    if (!container) return;
    
    const pending = pendingStoreRequests.filter(r => r.status === 'pending');
    
    if (pending.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#aaa;">
                <i class="fas fa-check-circle" style="font-size:48px;display:block;margin-bottom:15px;color:var(--success);"></i>
                📭 لا توجد طلبات متاجر معلقة
            </div>
        `;
        return;
    }
    
    container.innerHTML = pending.map(req => `
        <div class="exchange-card">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px;">
                <div style="flex:1;">
                    <div><strong style="color:var(--gold);font-size:16px;">🏪 ${req.name}</strong></div>
                    <div style="font-size:12px;color:#aaa;">📞 ${req.phone}</div>
                    <div style="font-size:12px;color:#aaa;">🆔 ${req.id}</div>
                    <div style="font-size:12px;color:#aaa;">📅 ${new Date(req.timestamp).toLocaleString('ar-EG')}</div>
                    ${req.fromTelegram ? '<div style="font-size:11px;color:#0088cc;">📡 من تليجرام</div>' : ''}
                </div>
                <div style="display:flex;gap:10px;">
                    <button class="btn btn-success btn-sm" onclick="approveStoreRequest('${req.id}')"><i class="fas fa-check"></i> موافقة</button>
                    <button class="btn btn-error btn-sm" onclick="rejectStoreRequest('${req.id}')"><i class="fas fa-times"></i> رفض</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 5. الموافقة على الطلب
function approveStoreRequest(requestId) {
    const request = pendingStoreRequests.find(r => r.id === requestId);
    if (!request) {
        toast('❌ لم يتم العثور على الطلب', 'error');
        return;
    }
    
    if (stores.find(s => s.name === request.name || s.phone === request.phone)) {
        toast(`⚠️ المتجر ${request.name} مسجل مسبقاً`, 'warning');
        pendingStoreRequests = pendingStoreRequests.filter(r => r.id !== requestId);
        localStorage.setItem('nardoPendingStores', JSON.stringify(pendingStoreRequests));
        renderStoreRequests();
        return;
    }
    
    const storeCode = `STR-${Math.floor(Math.random() * 900000) + 100000}`;
    const tempPassword = `store${request.phone.slice(-4)}`;
    
    const newStore = {
        id: Date.now(),
        name: request.name,
        code: storeCode,
        phone: request.phone,
        location: '',
        isMain: false,
        type: 'sub',
        status: 'active',
        pass: tempPassword,
        createdAt: new Date().toISOString()
    };
    stores.push(newStore);
    
    const newUser = {
        id: 'user-' + Date.now(),
        phone: request.phone,
        password: tempPassword,
        name: request.name,
        role: 'user',
        storeId: newStore.id,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    
    request.status = 'approved';
    request.approvedStoreId = newStore.id;
    
    // ✅ حفظ باستخدام المفتاح الصحيح
    localStorage.setItem('nardo_stores', JSON.stringify(stores));
    localStorage.setItem('nardoUsers', JSON.stringify(users));
    localStorage.setItem('nardoPendingStores', JSON.stringify(pendingStoreRequests));
    
    console.log('✅ تم حفظ المتجر:', newStore);
    console.log('✅ تم حفظ المستخدم:', newUser);
    console.log('📋 جميع المستخدمين:', users);
    
    sendStoreIDNotification(request, storeCode, tempPassword);
    
    renderStoreRequests();
    renderStores();
    updateStoreSelector();
    updateStats();
    
    toast(`✅ تمت الموافقة على متجر "${request.name}"`, 'success');
}
// 6. رفض الطلب
function rejectStoreRequest(requestId) {
    const request = pendingStoreRequests.find(r => r.id === requestId);
    if (!request) {
        toast('❌ لم يتم العثور على الطلب', 'error');
        return;
    }
    
    request.status = 'rejected';
    localStorage.setItem('nardoPendingStores', JSON.stringify(pendingStoreRequests));
    
    const msg = `❌ تم رفض طلب فتح المتجر:\n🏪 الاسم: ${request.name}\n📞 الهاتف: ${request.phone}\n⏰ التاريخ: ${new Date().toLocaleString('ar-EG')}`;
    sendToTelegram(msg, TELEGRAM.channelId);
    
    renderStoreRequests();
    toast(`❌ تم رفض متجر "${request.name}"`, 'warning');
}

// 7. إرسال إشعار الموافقة
async function sendStoreIDNotification(request, storeCode, tempPassword) {
    const msg = `✅ تمت الموافقة على متجرك الجديد!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🏪 اسم المتجر: ${request.name}\n🆔 معرف المتجر: ${storeCode}\n📞 رقم الهاتف: ${request.phone}\n🔐 كلمة المرور: ${tempPassword}\n⏰ التاريخ: ${new Date().toLocaleString('ar-EG')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚠️ يرجى حفظ هذه البيانات لتسجيل الدخول`;
    await sendToTelegram(msg, TELEGRAM.channelId);
}

// 8. جلب الطلبات من التليجرام
async function fetchTelegramStoreRequests() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    try {
        const url = `${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates?limit=100`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data.ok) return;
        
        let newRequests = 0;
        const processedIds = JSON.parse(localStorage.getItem('processed_store_requests') || '[]');
        
        for (const update of data.result || []) {
            const msg = update.channel_post || update.message;
            if (!msg || !msg.text) continue;
            if (processedIds.includes(msg.message_id)) continue;
            
            const isStoreRequest = msg.text.includes('طلب فتح متجر') || 
                                  msg.text.includes('🏪 طلب فتح متجر جديد') ||
                                  (msg.text.includes('📝 اسم المتجر:') && msg.text.includes('📞 الهاتف:'));
            
            if (!isStoreRequest) continue;
            if (msg.text.includes('تمت الموافقة') || msg.text.includes('تم رفض')) continue;
            
            const nameMatch = msg.text.match(/📝\s*اسم المتجر:\s*([^\n]+)/) || 
                             msg.text.match(/اسم المتجر:\s*([^\n]+)/);
            const phoneMatch = msg.text.match(/📞\s*الهاتف:\s*([0-9]+)/) || 
                              msg.text.match(/هاتف:\s*([0-9]+)/);
            const idMatch = msg.text.match(/🆔\s*معرف الطلب:\s*([^\n]+)/) || 
                           msg.text.match(/معرف الطلب:\s*([^\n]+)/);
            
            if (!nameMatch || !phoneMatch) continue;
            
            const storeName = nameMatch[1].trim();
            const phone = phoneMatch[1].trim();
            const requestId = idMatch ? idMatch[1].trim() : `REQ-TG-${msg.message_id}`;
            
            const existsInPending = pendingStoreRequests.some(r => r.phone === phone && r.status === 'pending');
            const existsInStores = stores.some(s => s.phone === phone);
            
            if (!existsInPending && !existsInStores) {
                pendingStoreRequests.push({
                    id: requestId,
                    name: storeName,
                    phone: phone,
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    fromTelegram: true,
                    telegramMessageId: msg.message_id
                });
                processedIds.push(msg.message_id);
                newRequests++;
            }
        }
        
        if (newRequests > 0) {
            localStorage.setItem('nardoPendingStores', JSON.stringify(pendingStoreRequests));
            localStorage.setItem('processed_store_requests', JSON.stringify(processedIds));
            renderStoreRequests();
            toast(`📩 تم جلب ${newRequests} طلب جديد من التليجرام`);
        }
        
    } catch (error) {
        console.error('❌ خطأ في جلب الطلبات:', error);
    }
}

// 9. مراقبة الطلبات الجديدة
function startStoreRequestWatcher() {
    setTimeout(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchTelegramStoreRequests();
        }
    }, 3000);
    
    setInterval(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchTelegramStoreRequests();
        }
    }, 10000);
    
    console.log('👀 مراقبة طلبات فتح المتاجر من التليجرام (كل 10 ثواني)');
}

// ============================================================
// 📦 إدارة المنتجات
// ============================================================

function openProductModal(id = null) {
    const modal = document.getElementById('productModal');
    const storeSelect = document.getElementById('pStore');
    storeSelect.innerHTML = stores.map(s => `<option value="${s.id}" ${s.id === currentStoreId ? 'selected' : ''}>${s.name}</option>`).join('');
    document.getElementById('productImages').value = '[]';
    document.getElementById('imagePreview').innerHTML = '';
    if (id) {
        const product = inventory.find(p => p.id === id);
        if (product) {
            document.getElementById('productModalTitle').textContent = '✏️ تعديل المنتج';
            document.getElementById('productModalSub').textContent = 'قم بتعديل بيانات المنتج';
            document.getElementById('editProductId').value = product.id;
            document.getElementById('pBarcode').value = product.barcode || '';
            document.getElementById('pName').value = product.name;
            document.getElementById('pProductId').value = product.productId || '';
            document.getElementById('pStore').value = product.storeId;
            document.getElementById('pCategory').value = product.category || '';
            document.getElementById('pPrice').value = product.price;
            document.getElementById('pStock').value = product.stock;
            document.getElementById('pDescription').value = product.description || '';
            document.getElementById('productImages').value = JSON.stringify(product.images || []);
            renderImagePreview();
        }
    } else {
        document.getElementById('productModalTitle').textContent = '➕ إضافة منتج جديد';
        document.getElementById('productModalSub').textContent = 'أدخل بيانات المنتج';
        document.getElementById('editProductId').value = '';
        document.getElementById('pBarcode').value = '';
        document.getElementById('pName').value = '';
        document.getElementById('pProductId').value = '';
        document.getElementById('pStore').value = currentStoreId || '';
        document.getElementById('pCategory').value = '';
        document.getElementById('pPrice').value = '';
        document.getElementById('pStock').value = '';
        document.getElementById('pDescription').value = '';
        document.getElementById('pImageFile').value = '';
    }
    modal.classList.add('show');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
}

function saveProductOnly() {
    const id = document.getElementById('editProductId').value;
    const storeId = parseInt(document.getElementById('pStore').value);
    const store = stores.find(s => s.id === storeId);
    const storeCode = store?.code || 'NARDO';
    const product = {
        id: id ? parseInt(id) : Date.now() + Math.random(),
        barcode: document.getElementById('pBarcode').value,
        name: document.getElementById('pName').value,
        productId: document.getElementById('pProductId').value || `${storeCode}-${Date.now().toString().slice(-6)}`,
        storeId: storeId,
        category: document.getElementById('pCategory').value || 'عام',
        price: parseInt(document.getElementById('pPrice').value),
        stock: parseInt(document.getElementById('pStock').value),
        description: document.getElementById('pDescription').value || '',
        images: JSON.parse(document.getElementById('productImages').value || '[]'),
        source: 'local'
    };
    if (id) {
        const idx = inventory.findIndex(p => p.id === parseInt(id));
        if (idx !== -1) {
            inventory[idx] = { ...inventory[idx], ...product };
            toast('✅ تم تعديل المنتج', 'success');
        }
    } else {
        inventory.push(product);
        toast('✅ تم إضافة المنتج', 'success');
    }
    localStorage.setItem('nardo_products', JSON.stringify(inventory));
    renderShop();
    renderInventory();
    updateStats();
    closeProductModal();
}

async function saveAndPublishProduct() {
    const id = document.getElementById('editProductId').value;
    const storeId = parseInt(document.getElementById('pStore').value);
    const store = stores.find(s => s.id === storeId);
    const storeCode = store?.code || 'NARDO';
    
    const fileInput = document.getElementById('pImageFile');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        toast('⚠️ لا يمكن النشر بدون صورة', 'warning');
        return;
    }
    const imageFile = fileInput.files[0];
    
    const product = {
        id: id ? parseInt(id) : Date.now() + Math.random(),
        barcode: document.getElementById('pBarcode').value,
        name: document.getElementById('pName').value,
        productId: document.getElementById('pProductId').value || `${storeCode}-${Date.now().toString().slice(-6)}`,
        storeId: storeId,
        category: document.getElementById('pCategory').value || 'عام',
        price: parseInt(document.getElementById('pPrice').value),
        stock: parseInt(document.getElementById('pStock').value),
        description: document.getElementById('pDescription').value || '',
        images: [],
        source: 'local'
    };
    
    if (id) {
        const idx = inventory.findIndex(p => p.id === parseInt(id));
        if (idx !== -1) {
            inventory[idx] = { ...inventory[idx], ...product };
            toast('✅ تم تعديل المنتج', 'success');
        }
    } else {
        inventory.push(product);
        toast('✅ تم إضافة المنتج', 'success');
    }
    localStorage.setItem('nardo_products', JSON.stringify(inventory));
    
    toast('📤 جاري النشر...', 'info');
    
    // ✅ تنسيق رسالة المنتج مثل المرجعي
    const caption = `🟣 منتج جديد في ${store?.name || 'المتجر الرئيسي'}\n━━━━━━━━━━━━━━━━━━\n📦 المنتج: ${product.name}\n💰 السعر: ${product.price.toLocaleString()} دج\n🏷️ القسم: ${product.category || 'عام'}\n📊 الكمية: ${product.stock}\n🆔 معرف المنتج: ${product.productId}\n🏪 المتجر: ${store?.name || 'المتجر الرئيسي'}\n🆔 معرف المتجر: ${storeCode}\n📝 الوصف: ${product.description || 'لا يوجد وصف'}`;
    
    const fd = new FormData();
    fd.append('chat_id', TELEGRAM.channelId);
    fd.append('photo', imageFile);
    fd.append('caption', caption);
    fd.append('parse_mode', 'HTML');
    
    try {
        const res = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/sendPhoto`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.ok) {
            product.telegramId = data.result.message_id;
            product.source = 'telegram';
            const idx = inventory.findIndex(p => p.id === product.id);
            if (idx !== -1) {
                inventory[idx] = { ...inventory[idx], telegramId: data.result.message_id, source: 'telegram' };
                localStorage.setItem('nardo_products', JSON.stringify(inventory));
            }
            toast('✅ تم النشر', 'success');
        } else {
            toast('⚠️ تم الحفظ ولكن فشل النشر', 'warning');
        }
    } catch (e) {
        toast('⚠️ تم الحفظ ولكن فشل الإرسال', 'warning');
    }
    renderShop();
    renderInventory();
    updateStats();
    closeProductModal();
}

function addProductImageUrl() {
    const url = prompt('أدخل رابط الصورة:');
    if (url && url.trim()) {
        let images = JSON.parse(document.getElementById('productImages').value || '[]');
        images.push(url.trim());
        document.getElementById('productImages').value = JSON.stringify(images);
        renderImagePreview();
    }
}

function renderImagePreview() {
    const images = JSON.parse(document.getElementById('productImages').value || '[]');
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = images.map((img, i) => `
        <div class="img-item">
            <img src="${img}" onerror="this.src='📦'">
            <button class="remove-img" onclick="removeImage(${i})">×</button>
        </div>
    `).join('');
}

function removeImage(idx) {
    let images = JSON.parse(document.getElementById('productImages').value || '[]');
    images.splice(idx, 1);
    document.getElementById('productImages').value = JSON.stringify(images);
    renderImagePreview();
}

document.addEventListener('DOMContentLoaded', function() {
    const pImageFile = document.getElementById('pImageFile');
    if (pImageFile) {
        pImageFile.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            let images = JSON.parse(document.getElementById('productImages').value || '[]');
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    images.push(event.target.result);
                    document.getElementById('productImages').value = JSON.stringify(images);
                    renderImagePreview();
                };
                reader.readAsDataURL(file);
            });
        });
    }
});

function editProduct(id) { openProductModal(id); }

function deleteProduct(id) {
    if (!confirm('⚠️ هل تريد حذف هذا المنتج نهائياً؟')) return;
    const product = inventory.find(p => p.id === id);
    inventory = inventory.filter(p => p.id !== id);
    localStorage.setItem('nardo_products', JSON.stringify(inventory));
    renderShop();
    renderInventory();
    updateStats();
    toast(`🗑️ تم حذف المنتج ${product?.name || ''}`, 'info');
}

// ============================================================
// 🔄 الجلب التلقائي للمنتجات
// ============================================================

async function autoFetchProducts() {
    const now = Date.now();
    if (now - lastAutoFetchTime < AUTO_FETCH_INTERVAL) return;
    lastAutoFetchTime = now;
    if (!currentUser) return;
    try {
        const res = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getUpdates?limit=50`);
        const data = await res.json();
        if (!data.ok) throw new Error();
        let newCount = 0;
        const currentStoreIdValue = currentStoreId;
        for (const u of data.result || []) {
            const post = u.channel_post;
            if (!post || !post.caption) continue;
            if (processedProductIds.includes(post.message_id)) continue;
            
            const nameMatch = post.caption.match(/📦 المنتج:\s*([^\n]+)/);
            const priceMatch = post.caption.match(/💰 السعر:\s*([\d,]+)/);
            const categoryMatch = post.caption.match(/🏷️ القسم:\s*([^\n]+)/);
            const stockMatch = post.caption.match(/📊 الكمية:\s*(\d+)/);
            const idMatch = post.caption.match(/🆔 معرف المنتج:\s*([^\n]+)/);
            
            if (!nameMatch) continue;
            const exists = inventory.some(p => p.telegramId === post.message_id);
            if (exists) {
                processedProductIds.push(post.message_id);
                continue;
            }
            let imageUrl = '';
            if (post.photo) {
                try {
                    const fileId = post.photo[post.photo.length - 1].file_id;
                    const fileRes = await fetch(`${TELEGRAM.apiUrl}${TELEGRAM.botToken}/getFile?file_id=${fileId}`);
                    const fileData = await fileRes.json();
                    if (fileData.ok) {
                        imageUrl = `https://api.telegram.org/file/bot${TELEGRAM.botToken}/${fileData.result.file_path}`;
                    }
                } catch (e) {}
            }
            inventory.push({
                id: Date.now() + Math.random(),
                telegramId: post.message_id,
                barcode: idMatch ? idMatch[1].trim() : `TG-${post.message_id}`,
                name: nameMatch[1].trim(),
                productId: idMatch ? idMatch[1].trim() : `TG-${post.message_id}`,
                price: priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0,
                stock: stockMatch ? parseInt(stockMatch[1]) : 10,
                storeId: currentStoreIdValue,
                category: categoryMatch ? categoryMatch[1].trim() : 'عام',
                description: '📡 تم جلب هذا المنتج من قناة التليجرام',
                images: imageUrl ? [imageUrl] : [],
                source: 'telegram',
                fetchedAt: new Date().toISOString()
            });
            processedProductIds.push(post.message_id);
            newCount++;
        }
        localStorage.setItem('nardo_processed_product_ids', JSON.stringify(processedProductIds));
        if (newCount > 0) {
            localStorage.setItem('nardo_products', JSON.stringify(inventory));
            renderShop();
            renderInventory();
            updateStats();
            toast(`✅ تم جلب ${newCount} منتج جديد تلقائياً`, 'success');
        }
    } catch (e) {
        console.error('❌ خطأ في الجلب التلقائي:', e);
    }
}

function startAutoFetch() {
    setTimeout(autoFetchProducts, 3000);
    setInterval(autoFetchProducts, AUTO_FETCH_INTERVAL);
}

// ============================================================
// 📊 عرض المنتجات والمخزون
// ============================================================

function renderShop() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    const products = inventory.filter(p => p.storeId === currentStoreId);
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center;padding:60px;color:#aaa;grid-column:1/-1;">
                <i class="fas fa-box-open" style="font-size:60px;display:block;margin-bottom:15px;opacity:0.3;"></i>
                📦 لا توجد منتجات
            </div>
        `;
        return;
    }
    grid.innerHTML = products.map(product => {
        const isTelegram = product.source === 'telegram' || product.telegramId;
        const imageHtml = (product.images && product.images.length > 0) ? 
            `<img src="${product.images[0]}" alt="${product.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-box\\' style=\\'font-size:48px;color:#444\\'></i>'">` : 
            `<i class="fas fa-box" style="font-size:48px;color:#444;"></i>`;
        let telegramBadge = '';
        if (isTelegram) {
            telegramBadge = `
                <div style="position:absolute;top:8px;right:8px;z-index:20;">
                    <div style="background:linear-gradient(135deg, #ffd700, #ffed4e);color:#0a0a1a;padding:2px 10px;border-radius:20px;font-size:8px;font-weight:700;border:1px solid #daa520;box-shadow:0 0 20px rgba(255,215,0,0.4);">
                        📡 من القناة
                    </div>
                </div>
            `;
        }
        return `
        <div class="product-card ${isTelegram ? 'telegram-fetched' : ''}" id="card-${product.id}">
            ${telegramBadge}
            <div class="img" onclick="incrementProduct(${product.id})">
                ${imageHtml}
            </div>
            <div class="name">${product.name}</div>
            <div class="price">${product.price.toLocaleString()} دج</div>
            ${isTelegram ? `<div style="font-size:9px;color:#ffd700;margin:2px 0;"><i class="fab fa-telegram"></i> من القناة</div>` : ''}
            <div class="stock ${product.stock < 5 ? 'low' : ''}" id="stock-${product.id}">📦 المخزون: ${product.stock}</div>
            <div class="quantity-controls">
                <button onclick="changeProductQty(${product.id}, -1)">−</button>
                <input type="number" id="qty-${product.id}" value="${product.stock}" min="0" onchange="setProductQty(${product.id}, this.value)">
                <button onclick="changeProductQty(${product.id}, 1)">+</button>
            </div>
            <button onclick="addToCart(${product.id})" class="btn btn-gold" style="width:100%;margin-top:5px;padding:6px;font-size:12px;">
                <i class="fas fa-cart-plus"></i> إضافة للسلة
            </button>
        </div>`;
    }).join('');
}

function renderInventory() {
    const tbody = document.getElementById('inventoryTable');
    if (!tbody) return;
    const products = inventory.filter(p => p.storeId === currentStoreId);
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#666;padding:30px;">📦 لا توجد منتجات</td></tr>';
        return;
    }
    tbody.innerHTML = products.map((p, i) => {
        const isTelegram = p.source === 'telegram' || p.telegramId;
        return `
        <tr>
            <td>${i+1}</td>
            <td>${p.name} ${isTelegram ? '<span style="color:#ffd700;font-size:10px;">📡</span>' : ''}</td>
            <td>${p.category || 'عام'}</td>
            <td>${p.price.toLocaleString()} دج</td>
            <td>${p.stock}</td>
            <td><span class="badge ${p.stock < 5 ? 'badge-red' : 'badge-green'}">${p.stock < 5 ? '⚠️ منخفض' : '✅ جيد'}</span></td>
            <td>
                <button class="btn btn-blue" onclick="openProductModal(${p.id})" style="width:auto;padding:4px 10px;font-size:11px;display:inline-block;margin:2px;"><i class="fas fa-edit"></i></button>
                <button class="btn btn-red" onclick="deleteProduct(${p.id})" style="width:auto;padding:4px 10px;font-size:11px;display:inline-block;margin:2px;"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');
}

function incrementProduct(id) {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    product.stock += 1;
    localStorage.setItem('nardo_products', JSON.stringify(inventory));
    updateDisplayQuantity(id);
    updateStats();
    renderInventory();
    toast(`✅ تمت إضافة قطعة إلى ${product.name}`, 'success');
}

function changeProductQty(id, delta) {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    const newQty = product.stock + delta;
    if (newQty < 0) {
        toast('⚠️ لا يمكن أن تكون الكمية سالبة', 'warning');
        return;
    }
    product.stock = newQty;
    localStorage.setItem('nardo_products', JSON.stringify(inventory));
    updateDisplayQuantity(id);
    updateStats();
    renderInventory();
}

function setProductQty(id, value) {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    let newQty = parseInt(value);
    if (isNaN(newQty) || newQty < 0) {
        toast('⚠️ يرجى إدخال رقم صحيح موجب', 'warning');
        updateDisplayQuantity(id);
        return;
    }
    product.stock = newQty;
    localStorage.setItem('nardo_products', JSON.stringify(inventory));
    updateDisplayQuantity(id);
    updateStats();
    renderInventory();
    toast(`✅ تم تحديث كمية ${product.name} إلى ${newQty}`, 'success');
}

function updateDisplayQuantity(id) {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    const qtyInput = document.getElementById(`qty-${id}`);
    if (qtyInput) qtyInput.value = product.stock;
    const stockDisplay = document.getElementById(`stock-${id}`);
    if (stockDisplay) {
        stockDisplay.textContent = `📦 المخزون: ${product.stock}`;
        stockDisplay.className = `stock ${product.stock < 5 ? 'low' : ''}`;
    }
}

// ============================================================
// 🛒 السلة والطلبات
// ============================================================

function addToCart(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) { toast('⚠️ المنتج غير موجود', 'warning'); return; }
    if (product.stock <= 0) { toast('⚠️ المنتج غير متوفر', 'warning'); return; }
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        if (existing.quantity < product.stock) {
            existing.quantity += 1;
            toast(`✅ تمت إضافة ${product.name} إلى السلة`, 'success');
        } else {
            toast(`⚠️ لا يوجد مخزون كافٍ لـ ${product.name}`, 'warning');
            return;
        }
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, images: product.images });
        toast(`✅ تمت إضافة ${product.name} إلى السلة`, 'success');
    }
    localStorage.setItem('nardo_cart', JSON.stringify(cart));
    updateCartBadges();
    renderShop();
}

function updateCartBadges() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const badge = document.getElementById('cartBadge');
    const totalEl = document.getElementById('cartTotalAmount');
    if (badge) {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
    if (totalEl) totalEl.textContent = totalPrice.toLocaleString();
}

function openCartModal() {
    document.getElementById('cartModal').classList.add('show');
    renderCartItems();
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('show');
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#666;padding:40px 0;">🛒 سلة فارغة</div>';
        return;
    }
    let html = '';
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <div>
                    <div style="font-weight:600;">${item.name}</div>
                    <div style="color:var(--gold);font-size:13px;">${item.price.toLocaleString()} دج × ${item.quantity}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <button onclick="cartChangeQty(${item.id}, -1)" style="width:28px;height:28px;border:none;border-radius:6px;background:#1a1a2e;color:var(--gold);cursor:pointer;font-size:14px;font-weight:700;">−</button>
                    <span style="min-width:30px;text-align:center;font-weight:700;">${item.quantity}</span>
                    <button onclick="cartChangeQty(${item.id}, 1)" style="width:28px;height:28px;border:none;border-radius:6px;background:#1a1a2e;color:var(--gold);cursor:pointer;font-size:14px;font-weight:700;">+</button>
                    <button onclick="cartRemoveItem(${item.id})" style="background:rgba(239,68,68,0.15);color:var(--error);width:28px;height:28px;border:none;border-radius:6px;cursor:pointer;font-size:12px;">✕</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    document.getElementById('cartTotalAmount').textContent = total.toLocaleString();
}

function cartChangeQty(productId, delta) {
    const item = cart.find(c => c.id === productId);
    if (!item) return;
    const product = inventory.find(p => p.id === productId);
    if (!product) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
        cart = cart.filter(c => c.id !== productId);
    } else if (newQty <= product.stock) {
        item.quantity = newQty;
    } else {
        toast(`⚠️ لا يوجد مخزون كافٍ لـ ${product.name}`, 'warning');
        return;
    }
    localStorage.setItem('nardo_cart', JSON.stringify(cart));
    updateCartBadges();
    renderShop();
    renderCartItems();
}

function cartRemoveItem(productId) {
    cart = cart.filter(c => c.id !== productId);
    localStorage.setItem('nardo_cart', JSON.stringify(cart));
    updateCartBadges();
    renderShop();
    renderCartItems();
    toast('🗑️ تم إزالة المنتج من السلة', 'info');
}

function clearCart() {
    if (cart.length === 0) { toast('⚠️ السلة فارغة', 'warning'); return; }
    if (confirm('هل تريد تفريغ السلة بالكامل؟')) {
        cart = [];
        localStorage.setItem('nardo_cart', JSON.stringify(cart));
        updateCartBadges();
        renderShop();
        renderCartItems();
        toast('🗑️ تم تفريغ السلة', 'info');
    }
}

function checkoutFastCart() {
    if (cart.length === 0) { toast('⚠️ السلة فارغة', 'warning'); return; }
    let unavailable = false;
    cart.forEach(item => {
        const product = inventory.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
            unavailable = true;
            toast(`⚠️ ${product ? product.name : 'منتج'} غير متوفر بالكمية المطلوبة`, 'warning');
        }
    });
    if (unavailable) return;
    checkoutWithTelegram();
}

async function checkoutWithTelegram() {
    if (cart.length === 0) { toast('⚠️ السلة فارغة', 'warning'); return; }
    let total = 0;
    let itemsList = '';
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemsList += `• ${item.name} × ${item.quantity} = ${subtotal.toLocaleString()} دج\n`;
    });
    const store = stores.find(s => s.id === currentStoreId);
    const storeName = store ? store.name : 'المتجر الرئيسي';
    
    // ✅ تنسيق رسالة الطلب مثل المرجعي
    const message = `🛒 طلب شراء جديد\n🏪 متجر: ${storeName}\n👤 العميل: ${currentUser?.name || 'غير معروف'}\n📞 الهاتف: ${currentUser?.phone || 'غير معروف'}\n📦 المنتجات:\n${itemsList}\n💰 المجموع: ${total.toLocaleString()} دج`;
    
    const ok = await sendTg(message);
    if (ok) {
        toast('✅ تم إرسال الطلب بنجاح', 'success');
        cart.forEach(item => {
            const product = inventory.find(p => p.id === item.id);
            if (product) product.stock -= item.quantity;
        });
        orders.push({
            id: Date.now(),
            customer: currentUser?.name || 'غير معروف',
            items: cart.map(c => `${c.name} ×${c.quantity}`).join('، '),
            total: total,
            status: 'قيد الانتظار',
            storeId: currentStoreId,
            date: new Date().toISOString()
        });
        localStorage.setItem('nardo_orders', JSON.stringify(orders));
        localStorage.setItem('nardo_products', JSON.stringify(inventory));
        cart = [];
        localStorage.setItem('nardo_cart', JSON.stringify(cart));
        updateCartBadges();
        renderShop();
        renderInventory();
        updateStats();
        renderOrders();
        closeCartModal();
        showInvoiceModal(total, itemsList);
    } else {
        toast('❌ فشل إرسال الطلب', 'error');
    }
}

function showInvoiceModal(total, itemsList) {
    document.getElementById('invoiceStore').textContent = `المتجر: ${stores.find(s => s.id === currentStoreId)?.name || 'غير معروف'}`;
    document.getElementById('invoiceDate').textContent = `التاريخ: ${new Date().toLocaleString('ar-EG')}`;
    document.getElementById('invoiceItems').innerHTML = itemsList.replace(/\n/g, '<br>');
    document.getElementById('invoiceTotalAmount').textContent = total.toLocaleString();
    document.getElementById('invoiceModal').classList.add('show');
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.remove('show');
}

function printInvoice() {
    window.print();
}

// ============================================================
// 👑 إدارة المتاجر
// ============================================================

function renderStores() {
    const container = document.getElementById('storesList');
    if (!container) return;
    if (stores.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#aaa;">
                <i class="fas fa-store" style="font-size:48px;display:block;margin-bottom:15px;opacity:0.3;"></i>
                🏪 لا توجد متاجر
            </div>
        `;
        return;
    }
    const sortedStores = [...stores].sort((a, b) => (a.level || 99) - (b.level || 99));
    container.innerHTML = sortedStores.map(store => {
        const isMain = store.isMain === true;
        const isSub = store.type === 'sub';
        const storeProducts = inventory.filter(p => p.storeId === store.id);
        const totalValue = storeProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
        const isCurrent = store.id === currentStoreId;
        let icon = '🏪';
        let typeLabel = '';
        let color = '#888';
        if (isMain) { icon = '👑'; typeLabel = 'الرئيسي'; color = 'var(--gold)'; }
        else if (isSub) { icon = '📂'; typeLabel = 'فرعي'; color = '#4ade80'; }
        return `
        <div style="background:${isCurrent ? 'rgba(255,215,0,0.1)' : 'var(--card-bg)'};border:2px solid ${isCurrent ? 'var(--gold)' : 'rgba(255,215,0,0.1)'};border-radius:16px;padding:15px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:20px;">${icon}</span>
                        <strong style="color:${isCurrent ? 'var(--gold)' : '#fff'};font-size:16px;">${store.name}</strong>
                        <span style="background:${color}22;color:${color};padding:2px 10px;border-radius:12px;font-size:10px;font-weight:bold;">${typeLabel}</span>
                        ${isCurrent ? '<span style="background:rgba(255,215,0,0.2);color:var(--gold);padding:2px 10px;border-radius:12px;font-size:10px;">✅ الحالي</span>' : ''}
                    </div>
                    <div style="display:flex;gap:15px;flex-wrap:wrap;font-size:12px;color:#888;margin-top:3px;">
                        <span><i class="fas fa-code"></i> ${store.code}</span>
                        <span><i class="fas fa-phone"></i> ${store.phone || 'غير محدد'}</span>
                        <span><i class="fas fa-box"></i> ${storeProducts.length} منتج</span>
                        <span><i class="fas fa-money-bill"></i> ${totalValue.toLocaleString()} دج</span>
                    </div>
                </div>
                <div style="display:flex;gap:5px;">
                    <button class="btn btn-outline btn-sm" onclick="switchToStore(${store.id})" style="padding:4px 12px;font-size:11px;">
                        <i class="fas fa-arrow-left"></i> اختيار
                    </button>
                    ${!isMain ? `
                    <button class="btn btn-outline btn-sm" onclick="deleteStore(${store.id})" style="padding:4px 12px;font-size:11px;color:var(--error);border-color:var(--error);">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function switchToStore(storeId) {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;
    currentStoreId = storeId;
    document.getElementById('storeBadge').textContent = '🏪 ' + store.name;
    document.getElementById('cartStoreName').textContent = 'متجر: ' + store.name;
    const select = document.getElementById('storeSelector');
    if (select) select.value = storeId;
    renderShop();
    renderInventory();
    renderStores();
    updateStats();
    toast(`✅ تم التبديل إلى "${store.name}"`, 'success');
}

function deleteStore(storeId) {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;
    if (!confirm(`⚠️ هل تريد حذف متجر "${store.name}" نهائياً؟`)) return;
    stores = stores.filter(s => s.id !== storeId);
    inventory = inventory.filter(p => p.storeId !== storeId);
    users = users.filter(u => u.storeId !== storeId);
    localStorage.setItem('nardo_stores', JSON.stringify(stores));
    localStorage.setItem('nardo_products', JSON.stringify(inventory));
    localStorage.setItem('nardo_users', JSON.stringify(users));
    if (currentStoreId === storeId) {
        currentStoreId = stores.find(s => s.isMain)?.id || stores[0]?.id || null;
    }
    renderStores();
    updateStoreSelector();
    renderInventory();
    updateStats();
    toast(`🗑️ تم حذف متجر "${store.name}"`, 'info');
}

function updateStoreSelector() {
    const select = document.getElementById('storeSelector');
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = '';
    if (currentUser && currentUser.role === 'admin') {
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = '📊 عرض الكل';
        if (currentValue === 'all') allOption.selected = true;
        select.appendChild(allOption);
    }
    const activeStores = stores.filter(s => s.status === 'active');
    const sortedStores = [
        ...activeStores.filter(s => s.isMain),
        ...activeStores.filter(s => s.type === 'sub')
    ];
    sortedStores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.id;
        let icon = '🏪';
        if (store.isMain) icon = '👑';
        else if (store.type === 'sub') icon = '📂';
        option.textContent = `${icon} ${store.name}`;
        if (store.id == currentStoreId || store.id == currentValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    const container = document.getElementById('adminStoreSelector');
    if (container) {
        container.style.display = (currentUser && currentUser.role === 'admin') ? 'block' : 'none';
    }
}

function switchStore(storeId) {
    if (!storeId) return;
    if (storeId === 'all') {
        currentStoreId = null;
        document.getElementById('storeBadge').textContent = '📊 عرض الكل';
        renderShop();
        renderInventory();
        updateStatsAll();
        return;
    }
    switchToStore(parseInt(storeId));
}

function updateStatsAll() {
    document.getElementById('statProducts').textContent = inventory.length;
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statRevenue').textContent = orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString();
    document.getElementById('statStock').textContent = inventory.filter(p => p.stock < 5).length;
    document.getElementById('statStores').textContent = stores.length;
}

// ============================================================
// 📊 دوال عامة
// ============================================================

function showPage(page) {
    document.querySelectorAll('.sidebar .menu-item').forEach(m => m.classList.remove('active'));
    document.querySelector(`.sidebar .menu-item[onclick="showPage('${page}')"]`)?.classList.add('active');
    document.querySelectorAll('.content .page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`)?.classList.add('active');
}

function updateStats() {
    const products = inventory.filter(p => p.storeId === currentStoreId);
    document.getElementById('statProducts').textContent = products.length;
    document.getElementById('statOrders').textContent = orders.filter(o => o.storeId === currentStoreId).length;
    document.getElementById('statRevenue').textContent = orders.filter(o => o.storeId === currentStoreId).reduce((s, o) => s + (o.total || 0), 0).toLocaleString();
    document.getElementById('statStock').textContent = products.filter(p => p.stock < 5).length;
    document.getElementById('statStores').textContent = stores.filter(s => s.status === 'active').length;
}

function renderOrders() {
    const tbody = document.getElementById('ordersTable');
    if (!tbody) return;
    const storeOrders = orders.filter(o => o.storeId === currentStoreId);
    if (storeOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#666;padding:30px;">📋 لا توجد طلبات</td></tr>';
        return;
    }
    tbody.innerHTML = storeOrders.map(o => `
        <tr>
            <td>#${o.id}</td>
            <td>${o.customer}</td>
            <td>${o.items}</td>
            <td>${o.total.toLocaleString()} دج</td>
            <td><span class="badge ${o.status === 'مكتمل' ? 'badge-green' : 'badge-gold'}">${o.status}</span></td>
        </tr>
    `).join('');
}

// ============================================================
// 🚀 التهيئة
// ============================================================
function init() {
    console.log('🚀 بدء تشغيل ناردو كارت برو...');
    
    // ========================================
    // 1. تحميل البيانات من localStorage
    // ========================================
    
    // تحميل المتاجر
    stores = JSON.parse(localStorage.getItem('nardo_stores') || '[]');
    
    // إنشاء المتجر الرئيسي إذا لم يوجد
    let mainStore = stores.find(s => s.isMain === true);
    if (!mainStore) {
        mainStore = {
            id: Date.now(),
            name: 'المتجر الرئيسي',
            code: 'MAIN-001',
            isMain: true,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        stores.unshift(mainStore);
        localStorage.setItem('nardo_stores', JSON.stringify(stores));
    }
    
    // تحميل المستخدمين
    loadUsers();
    
    // تحميل باقي البيانات
    inventory = JSON.parse(localStorage.getItem('nardo_products') || '[]');
    orders = JSON.parse(localStorage.getItem('nardo_orders') || '[]');
    cart = JSON.parse(localStorage.getItem('nardo_cart') || '[]');
    pendingStoreRequests = JSON.parse(localStorage.getItem('nardoPendingStores') || '[]');
    
    // ========================================
    // 2. محاولة استعادة الجلسة
    // ========================================
    
    const session = sessionStorage.getItem('nardoSession');
    if (session) {
        try {
            currentUser = JSON.parse(session);
            const store = stores.find(s => s.id === currentUser.storeId);
            if (store && store.status === 'active') {
                currentStoreId = store.id;
                showDashboard();
                startAutoFetch();
                startStoreRequestWatcher();
                updateUIBasedOnRole();
                console.log('✅ تم استعادة الجلسة');
                return;
            }
        } catch (e) {
            console.error('❌ فشل استعادة الجلسة:', e);
        }
    }
    
    // ========================================
    // 3. إظهار شاشة الدخول فقط
    // ========================================
    
    showOnlyLoginScreen();
    
    // ========================================
    // 4. ربط أزرار السلة
    // ========================================
    
    const cartFab = document.getElementById('cartFab');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const clearBtn = document.getElementById('modalClearCartBtn');
    const checkoutBtn = document.getElementById('modalCheckoutBtn');
    
    if (cartFab && cartModal) {
        cartFab.onclick = function() {
            if (typeof renderInvoiceModal === 'function') renderInvoiceModal();
            cartModal.style.display = 'flex';
        };
        if (closeBtn) closeBtn.onclick = function() { cartModal.style.display = 'none'; };
        if (clearBtn) clearBtn.onclick = clearCart;
        if (checkoutBtn) checkoutBtn.onclick = checkoutWithTelegram;
        window.onclick = function(e) { if (e.target === cartModal) cartModal.style.display = 'none'; };
    }
    
    // ========================================
    // 5. استيراد المتجر الرئيسي من الخارج
    // ========================================
    
    setTimeout(() => {
        if (!stores.find(s => s.isMain && s.isExternal)) {
            importMainStoreFromExternal();
        }
    }, 1000);
    
    // ========================================
    // 6. عرض طلبات المتاجر المعلقة
    // ========================================
    
    renderPendingStoreRequests();
    
    console.log('✅ النظام جاهز');
}


</script>

</body>
</html>

