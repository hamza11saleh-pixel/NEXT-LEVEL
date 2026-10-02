document.addEventListener('DOMContentLoaded', () => {
    // 1. تحديث الشريط الإخباري وحالة المكان
    try {
        const savedTicker = localStorage.getItem('nextlevel_ticker');
        const tickerElem = document.getElementById('ticker-text') || document.querySelector('.ticker-content span');
        if (tickerElem && savedTicker) {
            tickerElem.innerText = savedTicker;
        }

        const currentStatus = localStorage.getItem('nextlevel_hall_status');
        const statusElem = document.getElementById('hall-status-text');
        if (statusElem && currentStatus) {
            statusElem.innerText = currentStatus;
        }
    } catch (e) {}

    // 2. تحميل العناصر الإضافية
    loadCustomItems();

    // 3. فحص جلسة تسجيل الدخول للرقم
    checkUserSession();
});

function loadCustomItems() {
    const items = JSON.parse(localStorage.getItem('nextlevel_custom_items')) || [];
    if (items.length === 0) return;

    items.forEach(item => {
        // إذا كان المضاف للمنيو (أكل/عصائر/أراجيل)
        if (item.cat === 'drinks' || item.cat === 'food' || item.cat === 'shisha') {
            const menuGrid = document.querySelector('.menu-grid');
            if (menuGrid) {
                const card = document.createElement('div');
                card.style.cssText = 'background: #151824; border: 1px solid #333; border-radius: 16px; overflow: hidden;';
                card.innerHTML = `
                    <img src="${item.img}" style="width: 100%; height: 180px; object-fit: cover;">
                    <div style="padding: 15px;">
                        <h3 style="color: #ffd700; margin-bottom: 8px;">${item.name}</h3>
                        <p style="color:#aaa; font-size:0.85rem; margin-bottom:10px;">${item.desc || ''}</p>
                        <div style="display: flex; justify-content: space-between; color: #ccc;">
                            <span>السعر:</span>
                            <strong style="color: #00f0ff;">${item.price}</strong>
                        </div>
                    </div>
                `;
                menuGrid.appendChild(card);
            }
        } 
        // إذا كان أنشطة وصالات
        else if (item.cat === 'activities') {
            const actContainer = document.getElementById('dynamic-activities-container');
            if (actContainer) {
                const card = document.createElement('div');
                card.style.cssText = 'background: #151824; border: 1px solid #333; border-radius: 16px; overflow: hidden;';
                card.innerHTML = `
                    <img src="${item.img}" style="width: 100%; height: 180px; object-fit: cover;">
                    <div style="padding: 15px;">
                        <h3 style="color: #fff; margin-bottom: 8px;">${item.name}</h3>
                        <p style="color:#aaa; font-size:0.85rem; margin-bottom:10px;">${item.desc || ''}</p>
                        <div style="display: flex; justify-content: space-between; color: #ccc;">
                            <span>السعر:</span>
                            <strong style="color: #ffd700;">${item.price}</strong>
                        </div>
                    </div>
                `;
                actContainer.appendChild(card);
            }
        } 
        // إذا كان بطولات
        else if (item.cat === 'tournaments') {
            const tourContainer = document.getElementById('dynamic-tournaments-container');
            if (tourContainer) {
                const card = document.createElement('div');
                card.style.cssText = 'background: #151824; border: 1px solid #ffd700; border-radius: 16px; padding: 20px; margin-top: 15px;';
                card.innerHTML = `
                    <h3 style="color: #ffd700; margin-bottom: 5px;">🏆 ${item.name}</h3>
                    <p style="color: #aaa; margin-bottom: 5px;">${item.desc || ''}</p>
                    <p style="color: #00f0ff; font-weight: bold;">الجوائز / الاشتراك: ${item.price}</p>
                `;
                tourContainer.appendChild(card);
            }
        }
    });
}

function checkUserSession() {
    const activePhone = localStorage.getItem('nextlevel_active_user');
    if (activePhone) {
        loadUserDashboard(activePhone);
    }
}

function handleLogin() {
    const inputElem = document.getElementById('phone-input');
    if (!inputElem) return;

    const phoneInput = inputElem.value.trim();
    if (!phoneInput || phoneInput.length < 8) {
        alert('يرجى إدخال رقم هاتف صحيح');
        return;
    }

    let users = JSON.parse(localStorage.getItem('nextlevel_users')) || {};
    if (!users[phoneInput]) {
        users[phoneInput] = { points: 10 };
        localStorage.setItem('nextlevel_users', JSON.stringify(users));
        alert('أهلاً بك! تم منحك 10 نقاط هدية التسجيل 🎉');
    }

    localStorage.setItem('nextlevel_active_user', phoneInput);
    loadUserDashboard(phoneInput);
}

function loadUserDashboard(phone) {
    let users = JSON.parse(localStorage.getItem('nextlevel_users')) || {};
    const userData = users[phone] || { points: 0 };

    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('dashboard-section');

    if (loginSec) loginSec.style.display = 'none';
    if (dashSec) dashSec.style.display = 'block';

    const phoneElem = document.getElementById('user-phone');
    const pointsElem = document.getElementById('user-points');

    if (phoneElem) phoneElem.innerText = phone;
    if (pointsElem) pointsElem.innerText = userData.points;
}

function handleLogout() {
    localStorage.removeItem('nextlevel_active_user');
    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('dashboard-section');

    if (loginSec) loginSec.style.display = 'block';
    if (dashSec) dashSec.style.display = 'none';

    const inputElem = document.getElementById('phone-input');
    if (inputElem) inputElem.value = '';
}

function submitFeedback() {
    const textElem = document.getElementById('feedback-text');
    if (!textElem) return;

    const text = textElem.value.trim();
    if (!text) {
        alert('يرجى كتابة التقييم أولاً');
        return;
    }

    let feedbacks = JSON.parse(localStorage.getItem('nextlevel_feedbacks')) || [];
    feedbacks.push({
        text: text,
        date: new Date().toLocaleDateString('ar-EG')
    });

    localStorage.setItem('nextlevel_feedbacks', JSON.stringify(feedbacks));
    alert('شكراً لك! تم إرسال التقييم بنجاح.');
    textElem.value = '';
}