/* ---------------------------------------------------------------
   Client-side filter + pagination
   Sunucu zaten tum listeyi render eder; JS sadece DOM'u filtreler.
   Buyuk veri setlerinde server-side pagination tercih edilmeli.
--------------------------------------------------------------- */
const PER_PAGE = 8;
let currentPage = 1;

/* Tum <tr> satirlarini bir kez al */
function allRows() {
    return Array.from(document.querySelectorAll('#tableBody tr[data-flight-no]'));
}

function filterTable() {
    currentPage = 1;
    applyFiltersAndRender();
}

function applyFiltersAndRender() {
    const q = (document.getElementById('searchInput').value || '').toLowerCase().trim();
    const status = document.getElementById('statusFilter').value;
    const airline = document.getElementById('airlineFilter').value;

    const rows = allRows();

    /* Her satiri filtrele; gorunur olanlari topla */
    const visible = rows.filter(row => {
        const flightNo = row.dataset.flightNo || '';
        const depAirport = row.dataset.depAirport || '';
        const arrAirport = row.dataset.arrAirport || '';
        const rowAirline = row.dataset.airline || '';
        const rowStatus = row.dataset.status || '';

        const matchQ = !q || [flightNo, depAirport, arrAirport, rowAirline].some(v => v.includes(q));
        const matchStatus = !status || rowStatus === status;
        const matchAirline = !airline || rowAirline === airline;

        /* Once hepsini gizle */
        row.style.display = 'none';
        return matchQ && matchStatus && matchAirline;
    });

    /* Pagination hesapla */
    const total = visible.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / PER_PAGE);
    if (totalPages === 0) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    } else if (currentPage < 1) {
        currentPage = 1;
    }

    const from = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
    const to = Math.min(currentPage * PER_PAGE, total);
    const slice = visible.slice(from - 1, to);

    /* Sadece mevcut sayfanin satirlarini goster */
    slice.forEach(row => row.style.display = '');

    /* Sayac & info */
    document.getElementById('rowCount').textContent = `${total} ucus bulundu`;
    document.getElementById('footerInfo').textContent =
        total === 0 ? 'Kayit yok' : `${from}-${to} / ${total} ucus`;

    toggleNoResultRow(total === 0);

    renderPagination(totalPages);
}

/* ---- Pagination render ---- */
function renderPagination(totalPages) {
    const ul = document.getElementById('paginationList');
    if (!ul) return;

    if (totalPages <= 1) {
        ul.innerHTML = '';
        return;
    }

    let html = '';

    /* Onceki */
    html += `<li class="${currentPage === 1 ? 'disabled' : ''}">
        <span class="pg-btn pg-arrow" onclick="${currentPage > 1 ? 'goPage(currentPage-1)' : ''}">
            <i class="bi bi-chevron-left"></i>
        </span>
    </li>`;

    /* Sayfa numaralari (max 7 goster, ortada "...") */
    const pages = buildPageRange(currentPage, totalPages);
    pages.forEach(p => {
        if (p === '...') {
            html += `<li><span class="pg-dots">...</span></li>`;
        } else {
            html += `<li class="${p === currentPage ? 'active' : ''}">
                <a class="pg-btn pg-num" onclick="goPage(${p})">${p}</a>
            </li>`;
        }
    });

    /* Sonraki */
    html += `<li class="${currentPage === totalPages ? 'disabled' : ''}">
        <span class="pg-btn pg-arrow" onclick="${currentPage < totalPages ? 'goPage(currentPage+1)' : ''}">
            <i class="bi bi-chevron-right"></i>
        </span>
    </li>`;

    ul.innerHTML = html;
}

/* 1 2 3 ... 8 9 10 tarzi akilli sayfa dizisi */
function buildPageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

function goPage(p) {
    if (typeof p !== 'number' || Number.isNaN(p)) return;
    currentPage = p;
    applyFiltersAndRender();
}

function toggleNoResultRow(show) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    let row = document.getElementById('js-empty-row');
    if (!show) {
        if (row) row.remove();
        return;
    }

    if (!row) {
        row = document.createElement('tr');
        row.id = 'js-empty-row';
        row.innerHTML = `
            <td colspan="11" class="empty-row">
                <i class="bi bi-search" style="font-size:24px;display:block;margin-bottom:8px;opacity:.45;"></i>
                Filtreye uygun ucus bulunamadi.
            </td>`;
        tbody.appendChild(row);
    }
}

/* ---- Delete modal ---- */
function confirmDelete(flightId, flightNo) {
    document.getElementById('deleteFlightNo').textContent = flightNo;
    document.getElementById('deleteForm').action =
        `/Admin/Flights/Delete/${flightId}`; // route'a gore duzenle
    document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
}

/* Overlay tiklamasinda kapat */
const deleteModal = document.getElementById('deleteModal');
if (deleteModal) {
    deleteModal.addEventListener('click', function (e) {
        if (e.target === this) closeDeleteModal();
    });
}

/* ---- Toast ---- */
function showToast(msg, type = 'info') {
    const icons = {
        success: 'bi-check-circle-fill',
        danger: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const t = document.createElement('div');
    t.className = 'toast-item';
    t.innerHTML = `<i class="bi ${icons[type] ?? icons.info} toast-icon ${type}"></i><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => {
        t.style.cssText += 'opacity:0;transform:translateY(20px);transition:.3s;';
        setTimeout(() => t.remove(), 320);
    }, 3200);
}

/* ---- Ilk yukleme ---- */
document.addEventListener('DOMContentLoaded', () => applyFiltersAndRender());
