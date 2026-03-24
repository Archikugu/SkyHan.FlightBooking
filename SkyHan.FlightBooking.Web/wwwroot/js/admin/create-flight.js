var statusColors = {
    Scheduled: { bg: 'rgba(30,111,217,.25)', color: '#93C5FD', label: 'Planlandı', dot: 'var(--accent)' },
    Boarding: { bg: 'rgba(16,185,129,.25)', color: '#6EE7B7', label: 'Boarding', dot: '#10B981' },
    Delayed: { bg: 'rgba(245,158,11,.25)', color: '#FCD34D', label: 'Gecikmeli', dot: '#F59E0B' },
    Cancelled: { bg: 'rgba(239,68,68,.25)', color: '#FCA5A5', label: 'İptal', dot: '#EF4444' },
    Completed: { bg: 'rgba(107,114,153,.2)', color: '#C7D2FE', label: 'Tamamlandı', dot: '#9CA3AF' }
};

var currentSymbol = '';
var demoPreview = {
    flightNo: 'TK102',
    airlineText: 'TK - Turkish Airlines',
    depCode: 'IST',
    depName: 'Istanbul Havalimani',
    arrCode: 'LHR',
    arrName: 'London Heathrow',
    depTimeText: '25.03.2026 09:30',
    arrTimeText: '25.03.2026 12:45',
    durationText: '3s 15dk',
    priceText: '₺4.299',
    totalSeats: 180,
    availableSeats: 42,
    statusKey: 'Scheduled'
};

function isPreviewDemoMode() {
    var selectors = [
        '[name="FlightNumber"]',
        '[name="AirlineCode"]',
        '[name="DepartureAirportCode"]',
        '[name="ArrivalAirportCode"]',
        '[name="DepartureTime"]',
        '[name="ArrivalTime"]',
        '[name="DurationMinutes"]',
        '[name="TotalSeats"]',
        '[name="AvailableSeats"]',
        '[name="BasePrice"]',
        '[name="Status"]'
    ];

    return selectors.every(function (selector) {
        var el = document.querySelector(selector);
        if (!el) return true;
        return !el.value || String(el.value).trim() === '';
    });
}

function syncStatus() {
    var statusSel = document.getElementById('statusSel');
    if (!statusSel) return;

    var val = statusSel.value;
    var dot = document.getElementById('statusDot');
    var info = statusColors[val];

    if (info && dot) dot.style.color = info.dot;

    var rcs = document.getElementById('rc-status');
    var rcst = document.getElementById('rc-status-txt');
    if (!info && isPreviewDemoMode()) {
        info = statusColors[demoPreview.statusKey];
    }

    if (rcs && info) {
        rcs.style.background = info.bg;
        rcs.style.color = info.color;
    }

    if (rcst) rcst.textContent = info ? info.label : (isPreviewDemoMode() ? statusColors[demoPreview.statusKey].label : 'Durum seçin');
}

function pickCurrency(radio, sym) {
    currentSymbol = sym;
    document.querySelectorAll('.cc-label').forEach(function (l) { l.classList.remove('selected'); });
    if (radio && radio.closest) radio.closest('.cc-label').classList.add('selected');
    syncPrice();
}

function syncPrice() {
    var priceInput = document.querySelector('[name="BasePrice"]');
    var val = priceInput ? (parseFloat(priceInput.value) || 0) : 0;
    var el = document.getElementById('priceSuffix');
    if (el) {
        if (val > 0) {
            el.textContent = currentSymbol + val.toLocaleString('tr-TR');
        } else {
            el.textContent = isPreviewDemoMode() ? demoPreview.priceText : '—';
        }
    }

    var rcp = document.getElementById('rc-price');
    if (rcp) rcp.textContent = (val > 0 && currentSymbol) ? currentSymbol + val.toLocaleString('tr-TR') : (isPreviewDemoMode() ? demoPreview.priceText : '—');
}

function syncDurSuffix() {
    var durInput = document.getElementById('durInput');
    var val = durInput ? (parseInt(durInput.value, 10) || 0) : 0;
    var h = Math.floor(val / 60);
    var m = val % 60;
    var txt = val > 0 ? (h > 0 ? h + 's ' + m + 'dk' : m + 'dk') : (isPreviewDemoMode() ? demoPreview.durationText : '—');

    var durSuffix = document.getElementById('durSuffix');
    var rcDur = document.getElementById('rc-dur');
    if (durSuffix) durSuffix.textContent = txt;
    if (rcDur) rcDur.textContent = txt;
}

function calcDuration() {
    var depInput = document.querySelector('[name="DepartureTime"]');
    var arrInput = document.querySelector('[name="ArrivalTime"]');
    if (!depInput || !arrInput) return;

    var dv = depInput.value;
    var av = arrInput.value;
    if (!dv || !av) return;

    var dep = new Date(dv);
    var arr = new Date(av);
    if (isNaN(dep) || isNaN(arr) || arr <= dep) return;

    var mins = Math.round((arr - dep) / 60000);
    var durInput = document.getElementById('durInput');
    if (durInput) durInput.value = mins;
    syncDurSuffix();
}

function syncCapacity() {
    var totalInput = document.querySelector('[name="TotalSeats"]');
    var availInput = document.querySelector('[name="AvailableSeats"]');
    var total = totalInput ? (parseInt(totalInput.value, 10) || 0) : 0;
    var avail = availInput ? (parseInt(availInput.value, 10) || 0) : 0;
    if (total === 0 && avail === 0 && isPreviewDemoMode()) {
        total = demoPreview.totalSeats;
        avail = demoPreview.availableSeats;
    }

    var occ = Math.max(0, total - avail);
    var pct = total > 0 ? Math.round(occ / total * 100) : 0;

    var fill = document.getElementById('capFill');
    if (fill) {
        fill.style.width = pct + '%';
        fill.style.background = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : 'var(--accent)';
    }

    var capPct = document.getElementById('capPct');
    var capOcc = document.getElementById('capOcc');
    var capFree = document.getElementById('capFree');
    var rcCap = document.getElementById('rc-cap');
    if (capPct) capPct.textContent = total > 0 ? '%' + pct + ' dolu' : '—';
    if (capOcc) capOcc.textContent = total > 0 ? occ + ' dolu koltuk' : '—';
    if (capFree) capFree.textContent = total > 0 ? avail + ' müsait koltuk' : '—';
    if (rcCap) rcCap.textContent = total > 0 ? avail + '/' + total : (isPreviewDemoMode() ? demoPreview.availableSeats + '/' + demoPreview.totalSeats : '—');
}

function syncPreview() {
    function getVal(selector, fallback) {
        var input = document.querySelector(selector);
        return input && input.value ? input.value : fallback;
    }

    var demoMode = isPreviewDemoMode();
    var no = getVal('[name="FlightNumber"]', demoMode ? demoPreview.flightNo : '——');
    var dep = getVal('[name="DepartureAirportCode"]', demoMode ? demoPreview.depCode : 'IST');
    var depName = getVal('[name="DepartureAirportName"]', demoMode ? demoPreview.depName : 'Kalkış');
    var arr = getVal('[name="ArrivalAirportCode"]', demoMode ? demoPreview.arrCode : '—');
    var arrName = getVal('[name="ArrivalAirportName"]', demoMode ? demoPreview.arrName : 'Varış');

    var airlineSel = document.querySelector('[name="AirlineCode"]');
    var airlineTxt = airlineSel && airlineSel.selectedIndex > 0
        ? airlineSel.options[airlineSel.selectedIndex].text
        : (demoMode ? demoPreview.airlineText : 'Havayolu seçin');

    var rcNo = document.getElementById('rc-no');
    var rcAirline = document.getElementById('rc-airline');
    var rcDepCode = document.getElementById('rc-dep-code');
    var rcDepName = document.getElementById('rc-dep-name');
    var rcArrCode = document.getElementById('rc-arr-code');
    var rcArrName = document.getElementById('rc-arr-name');
    if (rcNo) rcNo.textContent = no;
    if (rcAirline) rcAirline.textContent = airlineTxt;
    if (rcDepCode) rcDepCode.textContent = dep;
    if (rcDepName) rcDepName.textContent = depName;
    if (rcArrCode) rcArrCode.textContent = arr;
    if (rcArrName) rcArrName.textContent = arrName;

    var depT = getVal('[name="DepartureTime"]', '');
    var arrT = getVal('[name="ArrivalTime"]', '');

    function fmtTime(s) {
        if (!s) return '—';
        var d = new Date(s);
        return isNaN(d) ? '—' : d.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
    }

    var rcDepTime = document.getElementById('rc-dep-time');
    var rcArrTime = document.getElementById('rc-arr-time');
    if (rcDepTime) rcDepTime.textContent = depT ? fmtTime(depT) : (demoMode ? demoPreview.depTimeText : '—');
    if (rcArrTime) rcArrTime.textContent = arrT ? fmtTime(arrT) : (demoMode ? demoPreview.arrTimeText : '—');
}

document.addEventListener('DOMContentLoaded', function () {
    var selectedCurrency = document.querySelector('input[name="Currency"]:checked');
    if (selectedCurrency) {
        var symbolMap = { TRY: '₺', EUR: '€', USD: '$', GBP: '£' };
        pickCurrency(selectedCurrency, symbolMap[selectedCurrency.value] || '');
    } else {
        syncPrice();
    }

    syncStatus();
    syncDurSuffix();
    syncCapacity();
    syncPreview();

    var form = document.getElementById('flightForm');
    if (form) {
        form.addEventListener('submit', function () {
            var btn = document.getElementById('saveBtn');
            var idle = document.getElementById('saveBtnIdle');
            var load = document.getElementById('saveBtnLoad');
            if (idle) idle.style.display = 'none';
            if (load) load.style.display = 'inline-flex';
            if (btn) btn.disabled = true;
        });
    }
});
