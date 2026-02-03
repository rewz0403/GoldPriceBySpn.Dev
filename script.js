const firebaseConfig = {
    apiKey: "AIzaSyCYl172KQ-5PAPzJV0eosHuC07IoeCQ0DQ",
    authDomain: "goldprice-55844.firebaseapp.com",
    databaseURL: "https://goldprice-55844-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "goldprice-55844",
    storageBucket: "goldprice-55844.firebasestorage.app",
    messagingSenderId: "149157196988",
    appId: "1:149157196988:web:c845e87d9550b3ac118cb9",
    measurementId: "G-CF3B6P1M57"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ฟังก์ชันเปิด-ปิด กราฟ (แบบ Global)
window.toggleGraph = function() {
    const widget = document.getElementById('graph-widget');
    if (widget) {
        widget.classList.toggle('translate-x-[280px]');
        widget.classList.toggle('translate-x-0');
    }
};

// ฟังก์ชันตรวจสอบสถานะระบบ (เวอร์ชัน UI Gold Luxury)
// ฟังก์ชันจัดการสถานะเว็บ (Maintenance -> Loading -> Main)
function checkMaintenance() {
    let isInitialLoad = true; // ตัวแปรเช็คการโหลดครั้งแรก

    db.ref('is_maintenance').on('value', (snapshot) => {
        const isMaintenance = snapshot.val();
        const existingScreen = document.getElementById('transition-screen');
        
        // กรณีที่ 1: เปิดโหมดปิดปรับปรุง (Maintenance)
        if (isMaintenance === true) {
            showSpecialScreen('maintenance');
            isInitialLoad = false;
        } 
        // กรณีที่ 2: ปิดโหมดปิดปรับปรุง (กำลังจะกลับเข้าหน้าหลัก)
        else {
            // ถ้าเป็นการโหลดครั้งแรกสุดและค่าเป็น false อยู่แล้ว ไม่ต้องโชว์ Loading
            if (isInitialLoad) {
                isInitialLoad = false;
                return; 
            }
            
            // โชว์หน้า Loading ก่อนเข้าสู่หน้าจริง
            showSpecialScreen('loading');
            
            // หน่วงเวลา 2 วินาทีให้ดูเหมือนกำลังโหลดข้อมูลจริงๆ แล้วค่อยเอาหน้าจอออก
            setTimeout(() => {
                const screen = document.getElementById('transition-screen');
                if (screen) {
                    screen.classList.add('opacity-0'); // ค่อยๆ จางออก
                    setTimeout(() => {
                        screen.remove();
                        document.body.style.overflow = '';
                    }, 1000); // รอให้จางเสร็จค่อยลบ Element
                }
            }, 2000);
        }
    });
}

// ฟังก์ชันสร้าง UI สำหรับหน้า Maintenance และ Loading
function showSpecialScreen(type) {
    let screen = document.getElementById('transition-screen');
    if (!screen) {
        document.body.insertAdjacentHTML('afterbegin', `<div id="transition-screen" class="fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center transition-opacity duration-500 overflow-hidden"></div>`);
        screen = document.getElementById('transition-screen');
    }

    const isMaintenance = type === 'maintenance';
    
    screen.innerHTML = `
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full"></div>
        <div class="relative max-w-sm w-full text-center p-8">
            <div class="mb-8 relative inline-flex">
                <div class="absolute inset-0 bg-amber-500/30 blur-2xl rounded-full"></div>
                <div class="relative p-6 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-[2rem] shadow-2xl">
                    ${isMaintenance 
                        ? '<svg class="w-12 h-12 text-slate-900 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>'
                        : '<svg class="w-12 h-12 text-slate-900 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>'
                    }
                </div>
            </div>

            <h1 class="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">
                ${isMaintenance ? 'System Maintenance' : 'Entering Main Page'}
            </h1>
            <p class="text-slate-400 text-sm mb-8 font-medium">
                ${isMaintenance ? 'เว็บไซต์อยู่ในระหว่างการปรับปรุง...' : 'กำลังเข้าสู่หน้าหลัก...'}
            </p>

            <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 w-1/2 animate-[luxury_2s_infinite]"></div>
            </div>
        </div>
        <style>
            @keyframes luxury {
                0% { transform: translateX(-100%) skewX(-20deg); }
                100% { transform: translateX(200%) skewX(-20deg); }
            }
        </style>
    `;
    document.body.style.overflow = 'hidden';
}

checkMaintenance();



// 1. นาฬิกาดิจิทัล
function updateClock() {
    const now = new Date();
    const dateEl = document.getElementById('current-date');
    const timeEl = document.getElementById('current-time');
    if (dateEl) dateEl.innerText = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    if (timeEl) timeEl.innerText = now.toLocaleTimeString('th-TH');
}

// 2. ดึงข้อมูลจาก API
async function updateGoldPrice() {
    const statusEl = document.getElementById('update-status');
    if (statusEl) statusEl.innerText = "กำลังดึงราคาล่าสุด...";
    
    try {
        const response = await fetch('https://api.chnwt.dev/thai-gold-api/latest');
        const data = await response.json();
        console.log("Connected to API successfully.");
        console.log("Fetched Gold Data:", data);
        if (data.status === "success" && data.response) {
            const gold = data.response;
            renderUI(gold);
            saveToFirebase(gold);
            if (statusEl) statusEl.innerText = "ข้อมูลอัปเดตล่าสุด: " + new Date().toLocaleTimeString('th-TH');
        }
    } catch (err) {
        if (statusEl) statusEl.innerText = "⚠️ เชื่อมต่อ API ล้มเหลว (กรุณาเปิด Server)";
    }
}
// บันทึกข้อมูลลง Firebase
function saveToFirebase(data) {
    if (!data.update_date || !data.update_time) return;
    const dateKey = data.update_date.replace(/\//g, "-");
    const roundMatch = data.update_time.match(/ครั้งที่ (\d+)/);
    const roundKey = roundMatch ? `round_${roundMatch[1]}` : "round_1";

    db.ref(`gold_history/${dateKey}/${roundKey}`).set({
        time: data.update_time,
        price: data.price,
        timestamp: Date.now()
    });
}
// อัปเดต UI
function renderUI(data) {
    const ids = ['display-date', 'display-time', 'bar-buy', 'bar-sell', 'gold-buy', 'gold-sell'];
    const fields = [data.update_date, data.update_time, data.price.gold_bar.buy, data.price.gold_bar.sell, data.price.gold.buy, data.price.gold.sell];
    
    ids.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) el.innerText = fields[index];
    });
}
// โหลดประวัติราคาทองคำ
function loadGoldHistory() {
    const historyRef = db.ref('gold_history');
    const container = document.getElementById('history-container');
    const summaryContainer = document.getElementById('daily-summary-container');

    historyRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            if (container) container.innerHTML = '<p class="text-center text-slate-400 py-8 italic">ไม่มีข้อมูลประวัติในระบบ</p>';
            return;
        }

        // อัปเดตกราฟ
        if (typeof updateChartLogic === 'function') {
            updateChartLogic(data);
        }

        let historyHtml = '';
        let summaryHtml = `
            <div class="bg-slate-900/90 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-700 mb-4">
                <h2 class="text-amber-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    สรุปรายวันล่าสุด
                </h2>
                <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        `;
        
        const dates = Object.keys(data).sort((a, b) => {
            const dateA = a.split('-').reverse().join('-');
            const dateB = b.split('-').reverse().join('-');
            return dateB.localeCompare(dateA);
        });

        // --- คำนวณสรุปรายวัน ---
        let prevDayLastPrice = null;
        const dailyStats = [];

        [...dates].reverse().forEach((date) => {
            const rounds = data[date];
            const rKeys = Object.keys(rounds).sort((a, b) => parseInt(a.replace('round_', '')) - parseInt(b.replace('round_', '')));
            
            let prices = rKeys.map(rk => {
                const pStr = rounds[rk]?.price?.gold_bar?.sell;
                return pStr ? parseInt(String(pStr).replace(/,/g, '')) : null;
            }).filter(p => p !== null);
            
            if (prices.length > 0) {
                let maxPrice = Math.max(...prices);
                let minPrice = Math.min(...prices);
                let lastPrice = prices[prices.length - 1];
                let dayDiff = prevDayLastPrice !== null ? lastPrice - prevDayLastPrice : 0;
                
                dailyStats.push({ date, max: maxPrice, min: minPrice, diff: dayDiff });
                prevDayLastPrice = lastPrice;
            }
        });

        // สร้าง HTML สำหรับ Summary Widget (ด้านซ้าย)
        dailyStats.reverse().slice(0, 5).forEach(stat => { // แสดงแค่ 5 วันล่าสุดใน Widget
            const diffClass = stat.diff > 0 ? 'text-emerald-400' : stat.diff < 0 ? 'text-red-400' : 'text-slate-400';
            const diffSign = stat.diff > 0 ? '+' : '';

            summaryHtml += `
            <div class="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-bold text-slate-400">${stat.date}</span>
                    <span class="text-[10px] font-black ${diffClass}"> ${diffSign}${stat.diff.toLocaleString()}</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <p class="text-[8px] text-slate-500 uppercase font-bold">สูงสุด</p>
                        <p class="text-[11px] font-bold text-slate-200">${stat.max.toLocaleString()}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[8px] text-slate-500 uppercase font-bold">ต่ำสุด</p>
                        <p class="text-[11px] font-bold text-slate-200">${stat.min.toLocaleString()}</p>
                    </div>
                </div>
            </div>`;
        });

        summaryHtml += `</div></div>`;
        if (summaryContainer) summaryContainer.innerHTML = summaryHtml;

        // --- ส่วนสร้างประวัติรายรอบ (History Card กลางจอ) ---
        const latestDate = dates[0];
        dates.forEach((date) => {
            const rounds = data[date];
            const roundKeys = Object.keys(rounds).sort((a, b) => parseInt(a.replace('round_', '')) - parseInt(b.replace('round_', '')));
            const roundItems = [];
            let lastPriceInDay = null;

            roundKeys.forEach((rk) => {
                const item = rounds[rk];
                if (!item?.price?.gold_bar || !item?.price?.gold) return;

                const currentPrice = parseInt(String(item.price.gold_bar.sell).replace(/,/g, ''));
                let diff = 0, diffText = '', diffClass = 'text-slate-400';

                if (lastPriceInDay !== null) {
                    diff = currentPrice - lastPriceInDay;
                    if (diff > 0) { diffText = `+${diff.toLocaleString()}`; diffClass = 'text-emerald-500'; }
                    else if (diff < 0) { diffText = `${diff.toLocaleString()}`; diffClass = 'text-red-500'; }
                    else { diffText = '0'; }
                } else { diffText = '-'; }

                lastPriceInDay = currentPrice;

                roundItems.push(`
                <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
                    <div class="bg-slate-50/50 px-6 py-2 flex justify-between items-center border-b border-slate-100">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold text-slate-400">${item.time}</span>
                            <span class="text-[10px] font-bold ${diffClass} bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm">
                                ${diff > 0 ? '▲' : diff < 0 ? '▼' : ''} ${diffText}
                            </span>
                        </div>
                        <span class="text-[9px] font-black text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded uppercase">
                            ครั้งที่ ${rk.replace('round_', '')} • ${item.time.split(' ')[1] || ''}
                        </span>
                    </div>
                    <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:divide-x divide-slate-100">
                        <div class="flex items-center justify-between">
                            <span class="text-[12px] font-bold text-slate-700 italic">ทองคำแท่ง</span>
                            <div class="flex gap-4">
                                <div class="text-right"><p class="text-[9px] text-slate-400 font-bold">ซื้อ</p><p class="text-sm font-bold text-green-600">${item.price.gold_bar.buy}</p></div>
                                <div class="text-right"><p class="text-[9px] text-slate-400 font-bold">ขาย</p><p class="text-sm font-bold text-red-600">${item.price.gold_bar.sell}</p></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between pl-0 md:pl-4">
                            <span class="text-[12px] font-bold text-slate-700 italic">รูปพรรณ</span>
                            <div class="flex gap-4">
                                <div class="text-right"><p class="text-[9px] text-slate-400 font-bold">ซื้อ</p><p class="text-sm font-bold text-green-600">${item.price.gold.buy}</p></div>
                                <div class="text-right"><p class="text-[9px] text-slate-400 font-bold">ขาย</p><p class="text-sm font-bold text-red-600">${item.price.gold.sell}</p></div>
                            </div>
                        </div>
                    </div>
                </div>`);
            });

            const isLatest = date === latestDate;
            const itemsVisibleClass = isLatest ? '' : 'hidden';

            historyHtml += `
            <div class="mb-10">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                    <h3 class="text-2xl font-bold text-slate-800 tracking-tight">${date}</h3>
                    <div class="flex-1"></div>
                    <button class="toggle-day-btn flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 bg-slate-50 px-3 py-1 rounded-xl shadow-sm border" data-date="${date}" aria-expanded="${isLatest}">
                        <span class="chev inline-block transition-transform ${isLatest ? 'rotate-180' : ''}">▼</span>
                        <span class="text-[11px] font-bold">${isLatest ? 'ซ่อน' : 'แสดง'}</span>
                    </button>
                </div>

                <div class="space-y-4 day-items ${itemsVisibleClass}" data-date="${date}">
                    ${roundItems.reverse().join('')}
                </div>
            </div>`;
        });
        container.innerHTML = historyHtml;

        // เพิ่มตัวจัดการเหตุการณ์สำหรับปุ่มเปิด/ปิดของแต่ละวัน
        container.querySelectorAll('.toggle-day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const date = btn.dataset.date;
                const items = container.querySelector(`.day-items[data-date="${date}"]`);
                const che = btn.querySelector('.chev');
                const label = btn.querySelector('span:nth-child(2)');
                if (!items) return;
                const isHidden = items.classList.toggle('hidden');
                btn.setAttribute('aria-expanded', (!isHidden).toString());
                if (che) che.classList.toggle('rotate-180');
                if (label) label.innerText = isHidden ? 'แสดง' : 'ปิด';
            });
        });
    });
}
// 3. อัปเดตกราฟ
let goldChart = null;
function updateChartLogic(data) {
    // วาดกราฟเวอร์ชัน Desktop
    const canvasDesktop = document.getElementById('goldChart');
    if (canvasDesktop) {
        renderMyChart(canvasDesktop, data);
    }

    // วาดกราฟเวอร์ชัน Mobile
    const canvasMobile = document.getElementById('goldChartMobile');
    if (canvasMobile) {
        renderMyChart(canvasMobile, data);
    }
}


function updateChartLogic(data) {
    const canvas = document.getElementById('goldChart');
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    let chartPoints = [];

    // เรียงวันที่จากเก่าไปใหม่
    const datesForChart = Object.keys(data).sort((a, b) => {
        return a.split('-').reverse().join('-').localeCompare(b.split('-').reverse().join('-'));
    });

    datesForChart.forEach(date => {
        const rounds = data[date];
        const roundKeys = Object.keys(rounds).sort((a, b) => parseInt(a.replace('round_', '')) - parseInt(b.replace('round_', '')));
        
        roundKeys.forEach(rk => {
            const item = rounds[rk];
            if (item?.price?.gold_bar?.sell) {
                const cleanPrice = parseFloat(String(item.price.gold_bar.sell).replace(/,/g, ''));
                if (!isNaN(cleanPrice)) {
                    chartPoints.push({
                        time: item.time.split(' ')[1] || '',
                        price: cleanPrice
                    });
                }
            }
        });
    });

    const displayPoints = chartPoints.slice(-12);
    const labels = displayPoints.map(p => p.time);
    const prices = displayPoints.map(p => p.price);

    const priceNowEl = document.getElementById('chart-price-now');
    if (priceNowEl && prices.length > 0) {
        priceNowEl.innerText = `฿ ${prices[prices.length - 1].toLocaleString()}`;
    }

    if (goldChart) goldChart.destroy();

    goldChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: prices,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#f59e0b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    callbacks: { label: (ctx) => `ราคาขาย: ${ctx.parsed.y.toLocaleString()} บาท` }
                }
            },
            scales: {
                y: { 
                    display: true, 
                    position: 'right',
                    ticks: { font: { size: 8 }, callback: (val) => val.toLocaleString() },
                    grace: '5%' 
                },
                x: { ticks: { font: { size: 8 } } }
            }
        }
    });
}






// เริ่มการทำงาน
setInterval(updateClock, 1000);
updateClock();
loadGoldHistory();
updateGoldPrice();
setInterval(updateGoldPrice, 60000); // อัปเดตข้อมูลทุก 1 นาที