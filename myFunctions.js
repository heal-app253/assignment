// myFunctions.js

// 1. عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الصفحة - جاهز للتشغيل');
    
    // التحقق من تسجيل الدخول
    checkLogin();
    
    // إعداد القائمة المتنقلة
    setupMobileMenu();
    
    // التحقق من الصفحة الحالية وتشغيل الوظائف المناسبة
    if (window.location.pathname.includes('apps.html') || document.querySelector('#apps-table')) {
        console.log('تم التعرف على صفحة التطبيقات');
        setupAppsPage();
    }
    
    if (window.location.pathname.includes('add_app.html') || document.querySelector('#add-app-form')) {
        console.log('تم التعرف على صفحة إضافة التطبيق');
        setupAddAppPage();
    }
    
    if (window.location.pathname.includes('login.html') || document.querySelector('#login-form')) {
        console.log('تم التعرف على صفحة تسجيل الدخول');
        setupLoginPage();
    }
});

// 2. التحقق من حالة تسجيل الدخول
function checkLogin() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('حالة تسجيل الدخول:', isLoggedIn);
    
    if (window.location.pathname.includes('add_app.html') && isLoggedIn !== 'true') {
        console.log('لم يتم تسجيل الدخول، يتم التوجيه إلى صفحة تسجيل الدخول');
        window.location.href = 'login.html';
    }
}

// 3. إعداد القائمة المتنقلة للهواتف
function setupMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        console.log('تم إعداد القائمة المتنقلة');
        
        hamburger.addEventListener('click', function() {
            console.log('تم النقر على زر القائمة');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 4. وظائف صفحة التطبيقات 
function setupAppsPage() {
    console.log('بدء إعداد صفحة التطبيقات');
    
    // تهيئة جميع مربعات الاختيار الموجودة
    initCheckboxes();
    
    // استخدام event delegation للتعامل مع الـ checkboxes الجديدة
    $(document).on('click', '.custom-checkbox', function() {
        handleCheckboxClick($(this));
    });
    
    // التحقق من وجود تطبيقات جديدة
    checkForNewApps();
}

// 5. تهيئة جميع مربعات الاختيار
function initCheckboxes() {
    console.log('تهيئة مربعات الاختيار - العدد:', $('.custom-checkbox').length);
    
    $('.custom-checkbox').each(function() {
        var checkbox = $(this);
        if (!checkbox.hasClass('initialized')) {
            checkbox.addClass('initialized');
        }
    });
}

// 6. معالجة النقر على الـ checkbox
function handleCheckboxClick(checkbox) {
    console.log('تم النقر على مربع اختيار');
    var tableRow = checkbox.closest('tr');
    var appId = checkbox.data('app-id');
    
    console.log('معرف التطبيق:', appId);
    
    checkbox.toggleClass('checked');
    
    var detailsRow = tableRow.next('.app-details-row');
    
    if (detailsRow.length > 0) {
        console.log('إخفاء التفاصيل');
        detailsRow.remove();
    } else {
        console.log('عرض التفاصيل للتطبيق:', appId);
        showAppDetails(tableRow, appId);
    }
}

// 7. عرض تفاصيل التطبيق - محدث مع دعم URLs
function showAppDetails(tableRow, appId) {
    console.log('عرض تفاصيل التطبيق رقم:', appId);
    
    var appInfo = getAppInfo(appId);
    
    var detailsRow = $('<tr class="app-details-row"></tr>');
    var detailsCell = $('<td colspan="5"></td>');
    
    // بناء محتوى الوسائط
    var mediaContent = buildMediaContent(appInfo);
    
    detailsCell.html(`
        <div class="app-details">
            <h4>📍 عنوان الموقع الإلكتروني:</h4>
            <p><a href="${appInfo.website}" target="_blank" class="app-link">${appInfo.website}</a></p>
            
            <h4>📝 شرح مختصر:</h4>
            <p>${appInfo.description}</p>
            
            <h4>ℹ️ معلومات إضافية:</h4>
            <p>${appInfo.additionalInfo}</p>
            
            ${appInfo.features ? `<h4>⭐ المميزات:</h4><p>${appInfo.features}</p>` : ''}
            
            ${mediaContent ? `<h4>🎬 وسائط التطبيق:</h4><div class="app-media">${mediaContent}</div>` : ''}
            
            ${appInfo.isNew ? `<h4>🆕 حالة:</h4><p>هذا التطبيق تمت إضافته حديثاً</p>` : ''}
        </div>
    `);
    
    detailsRow.append(detailsCell);
    tableRow.after(detailsRow);
    
    // إضافة تأثير ظهور سلس
    detailsRow.hide().fadeIn(400);
}

// 8. بناء محتوى الوسائط - محدث لاستخدام URLs
function buildMediaContent(appInfo) {
    var mediaContent = '';
    
    if (appInfo.logoUrl) {
        mediaContent += `
            <div class="media-item">
                <h5>🖼️ شعار التطبيق:</h5>
                <img src="${appInfo.logoUrl}" alt="شعار ${appInfo.name}" class="app-logo" 
                     onerror="this.style.display='none'">
            </div>
        `;
    }
    
    if (appInfo.videoUrl) {
        mediaContent += `
            <div class="media-item video-container">
                <h5>🎥 فيديو تعريفي:</h5>
                <div class="video-wrapper">
                    <iframe 
                        src="${appInfo.videoUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
    }
    
    return mediaContent;
}

// 9. معلومات التطبيقات (قاعدة البيانات) - محدثة
function getAppInfo(appId) {
    var apps = {
        1: {
            name: "DeepVision AI",
            website: "http://deepvisionai.in",
            description: "تطبيق متقدم للتعرف على الصور وتحليلها باستخدام الذكاء الاصطناعي. يدعم التعرف على الوجوه والأشياء والمشاهد المختلفة بدقة عالية.",
            additionalInfo: "🕒 يعمل في الوقت الفعلي | 📊 دقة تصل إلى 99% | 🌐 يدعم أكثر من 100 نوع من الصور",
            features: "التعرف على الوجوه 🔍 | تحليل المشاهد 🖼️ | معالجة الصور في الوقت الفعلي ⚡",
            logoUrl: "https://deepvisionai.in/img/logo2.png",
            videoUrl: "https://www.youtube.com/embed/KakD2UnEpZM?si=8tGhEFWh5ociIaz9"
        },
        2: {
            name: "SmartLearn", 
            website: "https://web.smartlearn.com",
            description: "منصة تعليمية ذكية تساعد الطلاب في التعلم المخصص بناءً على مستوى كل طالب وأسلوب تعلمه المفضل.",
            additionalInfo: "📈 يتكيف مع أسلوب التعلم | 📋 يوفر تقارير أداء مفصلة | 🗣️ يدعم多种 اللغات",
            features: "تعلم مخصص 🎯 | تقارير أداء 📊 | دعم多 اللغات 🌍",
            logoUrl: "https://web.smartlearn.com/wp-content/uploads/2023/09/smartlearn-logo.svg",
            videoUrl: "https://www.youtube.com/embed/GaFREka5auI?si=oCObXOysskJTSceB"
        },
        3: {
            name: "ChatBot Pro",
            website: "https://www.chatbotproapp.com",
            description: "روبوت محادثة متقدم للدعم الفني وخدمة العملاء، يمكنه فهم الاستفسارات المعقدة وتقديم إجابات دقيقة.",
            additionalInfo: "⚡ وقت استجابة أقل من ثانيتين | 🌍 يدعم 50+ لغة | 🔌 تكامل مع منصات متعددة",
            features: "ردود فورية ⚡ | دعم多 اللغات 🗣️ | تكامل سهل 🔌",
            logoUrl: "https://app.pro-chatbot.net/assets/img/logo.png",
            videoUrl: "https://www.youtube.com/embed/hGXiV8hGMcA?si=BefU9GQxJxW6k3v5"
        }
    };
    
    // إذا كان appId رقم كبير (تطبيق جديد)، نستخدم البيانات من localStorage
    if (appId > 1000) {
        var newAppData = localStorage.getItem('app_' + appId);
        if (newAppData) {
            var appData = JSON.parse(newAppData);
            appData.isNew = true;
            return appData;
        }
    }
    
    return apps[appId] || {
        name: "تطبيق غير معروف",
        website: "https://example.com",
        description: "معلومات التطبيق غير متوفرة حالياً.",
        additionalInfo: "جاري تحديث المعلومات...",
        features: "غير متوفر"
    };
}

// 10. التحقق من التطبيقات الجديدة
function checkForNewApps() {
    var newAppData = localStorage.getItem('newAppData');
    console.log('التحقق من التطبيقات الجديدة:', newAppData);
    
    if (newAppData) {
        try {
            var appData = JSON.parse(newAppData);
            console.log('تم العثور على تطبيق جديد:', appData);
            addNewAppToTable(appData);
            localStorage.removeItem('newAppData');
        } catch (error) {
            console.error('خطأ في تحليل بيانات التطبيق الجديد:', error);
        }
    }
}

// 11. إضافة تطبيق جديد للجدول - محدث
function addNewAppToTable(appData) {
    console.log('إضافة تطبيق جديد إلى الجدول:', appData);
    
    var tableBody = $('#apps-table tbody');
    var newAppId = Date.now();
    
    // حفظ البيانات الكاملة للتطبيق الجديد
    localStorage.setItem('app_' + newAppId, JSON.stringify(appData));
    
    var newRow = $('<tr></tr>');
    newRow.html(`
        <td>${appData.name}</td>
        <td>${appData.company}</td>
        <td>${appData.category}</td>
        <td>${appData.isFree}</td>
        <td>
            <div class="checkbox-container">
                <div class="custom-checkbox" data-app-id="${newAppId}"></div>
            </div>
        </td>
    `);
    
    tableBody.append(newRow);
    
    // إضافة class initialized للـ checkbox الجديد
    newRow.find('.custom-checkbox').addClass('initialized');
    
    // عرض رسالة نجاح
    setTimeout(function() {
        alert('🎉 تم إضافة التطبيق "' + appData.name + '" بنجاح!');
        console.log('يمكنك الآن النقر على مربع الاختيار لعرض تفاصيل التطبيق');
    }, 300);
}

// 12. وظائف صفحة إضافة التطبيقات - محدثة
function setupAddAppPage() {
    console.log('بدء إعداد صفحة إضافة التطبيقات');
    
    var form = document.getElementById('add-app-form');
    var resetButton = document.getElementById('reset-btn');
    
    if (form) {
        console.log('تم العثور على النموذج');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('تم محاولة إرسال النموذج');
            
            if (validateForm()) {
                console.log('النموذج صالح، جمع البيانات...');
                
                var formData = {
                    name: document.getElementById('app-name').value,
                    company: document.getElementById('company').value,
                    website: document.getElementById('website').value,
                    isFree: document.getElementById('is-free').value,
                    category: document.getElementById('category').value,
                    description: document.getElementById('description').value,
                    logoUrl: document.getElementById('logo-url').value,
                    videoUrl: document.getElementById('video-url').value
                };
                
                console.log('بيانات النموذج:', formData);
                
                // حفظ البيانات والتوجيه
                saveAndRedirect(formData);
            } else {
                console.log('النموذج غير صالح');
            }
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            console.log('تم النقر على زر الإعادة');
            form.reset();
            clearAllErrors();
        });
    }
}

// 13. حفظ البيانات والتوجيه
function saveAndRedirect(formData) {
    // حفظ البيانات في localStorage
    localStorage.setItem('newAppData', JSON.stringify(formData));
    console.log('تم حفظ البيانات في localStorage');
    
    // الانتقال إلى صفحة التطبيقات
    setTimeout(function() {
        window.location.href = 'apps.html';
    }, 500);
}

// 14. التحقق من صحة النموذج - محدث
function validateForm() {
    console.log('بدء التحقق من صحة النموذج');
    var isValid = true;
    
    // اسم التطبيق (أحرف إنجليزية فقط بدون مسافات)
    var appName = document.getElementById('app-name').value;
    var englishLettersOnly = /^[A-Za-z]+$/;
    if (!englishLettersOnly.test(appName)) {
        console.log('خطأ في اسم التطبيق');
        document.getElementById("app-name").focus(); 
        showError('app-name', 'يجب أن يحتوي اسم التطبيق على أحرف إنجليزية فقط بدون مسافات');
        isValid = false;
    } else {
        clearError('app-name');
    }
    
    // اسم الشركة (أحرف إنجليزية فقط)
    var company = document.getElementById('company').value;
    var englishLettersWithSpaces = /^[A-Za-z0-9\s]+$/;
    if (!englishLettersWithSpaces.test(company)) {
        console.log('خطأ في اسم الشركة');
        document.getElementById("company").focus(); 
        showError('company', 'يجب أن يحتوي اسم الشركة على أحرف إنجليزية مع أرقام');
        isValid = false;
    } else {
        clearError('company');
    }
    
    // الموقع الإلكتروني
    var website = document.getElementById('website').value;
    var urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(website)) {
        console.log('خطأ في الموقع الإلكتروني');
        document.getElementById("website").focus(); 
        showError('website', 'يرجى إدخال عنوان موقع إلكتروني صحيح');
        isValid = false;
    } else {
        clearError('website');
    }
    
    // رابط الشعار (إذا تم إدخاله)
    var logoUrl = document.getElementById('logo-url').value;
    if (logoUrl && !urlPattern.test(logoUrl)) {
        console.log('خطأ في رابط الشعار');
        document.getElementById("logo-url").focus(); 
        showError('logo-url', 'يرجى إدخال رابط صحيح للشعار');
        isValid = false;
    } else {
        clearError('logo-url');
    }
    
    // رابط الفيديو (إذا تم إدخاله)
    var videoUrl = document.getElementById('video-url').value;   
        clearError('video-url');    
    
    // التحقق من اختيار نوع التطبيق
    var isFree = document.getElementById('is-free').value;
    if (isFree === '') {
        console.log('خطأ في نوع التطبيق');
        document.getElementById("is-free").focus();
        showError('is-free', 'يرجى اختيار نوع التطبيق');
        isValid = false;
    } else {
        clearError('is-free');
    }
    
    // التحقق من اختيار مجال الاستخدام
    var category = document.getElementById('category').value;
    if (category === '') {
        console.log('خطأ في مجال الاستخدام');
        document.getElementById("category").focus();
        showError('category', 'يرجى اختيار مجال الاستخدام');
        isValid = false;
    } else {
        clearError('category');
    }
    
    console.log('نتيجة التحقق:', isValid ? 'صالح' : 'غير صالح');
    return isValid;
}

// 15. عرض رسالة الخطأ
function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    
    // إضافة class للخطأ
    field.classList.add('error');
    
    // إزالة رسالة الخطأ القديمة إذا كانت موجودة
    var oldError = field.parentNode.querySelector('.error-message');
    if (oldError) {
        oldError.remove();
    }
    
    // إنشاء رسالة الخطأ الجديدة
    var errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // إضافة رسالة الخطأ بعد حقل الإدخال
    field.parentNode.appendChild(errorElement);
}

// 16. مسح رسالة الخطأ
function clearError(fieldId) {
    var field = document.getElementById(fieldId);
    field.classList.remove('error');
    
    var errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// 17. مسح جميع رسائل الخطأ
function clearAllErrors() {
    var errorFields = document.querySelectorAll('.error');
    var errorMessages = document.querySelectorAll('.error-message');
    
    errorFields.forEach(function(field) {
        field.classList.remove('error');
    });
    
    errorMessages.forEach(function(message) {
        message.remove();
    });
}

// 18. وظائف صفحة تسجيل الدخول
function setupLoginPage() {
    console.log('بدء إعداد صفحة تسجيل الدخول');
    
    var loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        console.log('تم العثور على نموذج تسجيل الدخول');
        
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('تم محاولة تسجيل الدخول');
            
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            
            console.log('اسم المستخدم:', username);
            console.log('كلمة المرور:', password);
            
            // بيانات الدخول الثابتة
            var correctUsername = 'admin';
            var correctPassword = '1234';
            
            if (username === correctUsername && password === correctPassword) {
                console.log('✅ تسجيل الدخول ناجح');
                
                // حفظ حالة الدخول
                localStorage.setItem('isLoggedIn', 'true');
                console.log('تم حفظ حالة تسجيل الدخول');
                
                // عرض رسالة نجاح
                alert('✅ تم تسجيل الدخول بنجاح! يتم توجيهك إلى صفحة إضافة التطبيقات...');
                
                // الانتقال إلى صفحة إضافة التطبيقات بعد تأخير بسيط
                setTimeout(function() {
                    window.location.href = 'add_app.html';
                }, 1000);
                
            } else {
                console.log('❌ فشل تسجيل الدخول');
                alert('❌ اسم المستخدم أو كلمة المرور غير صحيحة! حاول مرة أخرى.\n\nتلميح: استخدم admin / password123');
            }
        });
    }
}

// 19. إضافة تنسيقات CSS ديناميكية
var dynamicStyles = `
    .app-link {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .app-link:hover {
        color: #1d4ed8;
        text-decoration: underline;
    }
    
    .app-details h4 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .media-item {
        margin-bottom: 1.5rem;
    }
    
    .media-item h5 {
        margin-bottom: 0.75rem;
        color: #4b5563;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .video-container {
        width: 100%;
    }
    
    .video-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%; /* نسبة 16:9 */
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .video-wrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }
    
    .custom-checkbox.initialized {
        cursor: pointer;
    }
    
    .app-logo {
        max-width: 120px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

var styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;

document.head.appendChild(styleSheet);
