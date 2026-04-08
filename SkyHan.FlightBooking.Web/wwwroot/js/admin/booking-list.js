(() => {
    let allRows = [];
    let filtered = [];
    let currentPage = 1;
    const perPage = 8;

    function getRows() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return [];
        return Array.from(tbody.querySelectorAll('tr.booking-row'));
    }

    function applyFilter() {
        const flightQ = (document.getElementById('filterFlight')?.value || '').toLowerCase().trim();
        const statusQ = document.getElementById('filterStatus')?.value || '';
        const dateQ = document.getElementById('filterDate')?.value || '';

        filtered = allRows.filter(row => {
            const flightValue = (row.dataset.flight || '').toLowerCase();
            const bookingIdValue = (row.dataset.bookingId || '').toLowerCase();
            const statusValue = row.dataset.status || '';
            const dateValue = row.dataset.date || '';

            const mF = !flightQ || flightValue.includes(flightQ) || bookingIdValue.includes(flightQ);
            const mS = !statusQ || statusValue === statusQ;
            const mD = !dateQ || dateValue === dateQ;
            return mF && mS && mD;
        });

        currentPage = 1;
        render();
    }

    function clearFilter() {
        const f1 = document.getElementById('filterFlight');
        const f2 = document.getElementById('filterStatus');
        const f3 = document.getElementById('filterDate');
        if (f1) f1.value = '';
        if (f2) f2.value = '';
        if (f3) f3.value = '';
        filtered = allRows.slice();
        currentPage = 1;
        render();
    }

    function render() {
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
        const to = Math.min(currentPage * perPage, total);
        const slice = new Set(filtered.slice(from - 1, to));

        const totalCount = document.getElementById('totalCount');
        const pageInfo = document.getElementById('pageInfo');
        const tbody = document.getElementById('tableBody');
        const emptyRow = document.getElementById('noDataRow');
        if (!tbody) return;

        if (totalCount) totalCount.textContent = `${total} kayıt`;
        if (pageInfo) pageInfo.textContent = total === 0
            ? 'Sonuç bulunamadı'
            : `${from}–${to} / ${total} kayıt gösteriliyor`;

        if (emptyRow) {
            emptyRow.style.display = total === 0 ? '' : 'none';
        }

        allRows.forEach(row => {
            row.style.display = slice.has(row) ? '' : 'none';
        });

        if (total === 0) {
            const pagination = document.getElementById('pagination');
            if (pagination) pagination.innerHTML = '';
            if (pageInfo) pageInfo.textContent = 'Sonuç bulunamadı';
            return;
        }

        renderPagination(totalPages);
        reindexVisibleRows();
    }

    function renderPagination(totalPages) {
        const ul = document.getElementById('pagination');
        if (!ul) return;

        let html = `<li class="page-item${currentPage === 1 ? ' disabled' : ''}">
            <a class="page-link booking-page-link" href="#" onclick="goPage(${currentPage - 1});return false;">
                <i class="bi bi-chevron-left booking-page-icon"></i>
            </a></li>`;

        const pages = buildRange(currentPage, totalPages);
        pages.forEach(p => {
            if (p === '...') {
                html += '<li class="page-item disabled"><span class="page-link booking-page-dots">…</span></li>';
            } else {
                html += `<li class="page-item${p === currentPage ? ' active' : ''}">
                    <a class="page-link booking-page-link booking-page-number" href="#" onclick="goPage(${p});return false;">${p}</a>
                </li>`;
            }
        });

        html += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}">
            <a class="page-link booking-page-link" href="#" onclick="goPage(${currentPage + 1});return false;">
                <i class="bi bi-chevron-right booking-page-icon"></i>
            </a></li>`;

        ul.innerHTML = html;
    }

    function buildRange(cur, total) {
        if (total <= 7) {
            const arr = [];
            for (let i = 1; i <= total; i++) arr.push(i);
            return arr;
        }
        const p = [1];
        if (cur > 3) p.push('...');
        for (let x = Math.max(2, cur - 1); x <= Math.min(total - 1, cur + 1); x++) p.push(x);
        if (cur < total - 2) p.push('...');
        p.push(total);
        return p;
    }

    function goPage(p) {
        const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
        if (p < 1 || p > totalPages) return;
        currentPage = p;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function reindexVisibleRows() {
        const visibleRows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
        visibleRows.forEach((row, i) => {
            const indexCell = row.querySelector('.booking-cell-index');
            if (indexCell) {
                indexCell.textContent = ((currentPage - 1) * perPage + i + 1).toString();
            }
        });
    }

    function cancelBooking(id) {
        if (!confirm(`${id} numaralı rezervasyonu iptal etmek istediğinize emin misiniz?`)) return;
        const row = allRows.find(r => (r.dataset.bookingId || '') === id);
        if (row) {
            row.dataset.status = 'Cancelled';
            const badge = row.querySelector('.booking-status-badge');
            if (badge) {
                badge.className = 'badge bg-danger-subtle text-danger d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill booking-status-badge';
                badge.innerHTML = '<i class="bi bi-x-circle-fill booking-status-icon"></i>İptal';
            }
            applyFilter();
        }
    }

    window.applyFilter = applyFilter;
    window.clearFilter = clearFilter;
    window.goPage = goPage;
    window.cancelBooking = cancelBooking;

    document.addEventListener('DOMContentLoaded', () => {
        allRows = getRows();
        filtered = allRows.slice();
        render();
    });
})();
