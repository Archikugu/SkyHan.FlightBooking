/* ---------------------------------------------------------------
   Client-side filter + pagination
   Sunucu zaten tum listeyi render eder; JS sadece DOM'u filtreler.
--------------------------------------------------------------- */
(() => {
    const PER_PAGE = 8;
    let currentPage = 1;

    function allRows() {
        return Array.from(document.querySelectorAll('#tableBody tr[data-flight-no]'));
    }

    function filterTable() {
        currentPage = 1;
        applyFiltersAndRender();
    }

    function applyFiltersAndRender() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const airlineFilter = document.getElementById('airlineFilter');
        if (!searchInput || !statusFilter || !airlineFilter) return;

        const q = (searchInput.value || '').toLowerCase().trim();
        const status = statusFilter.value;
        const airline = airlineFilter.value;
        const rows = allRows();

        const visible = rows.filter(row => {
            const flightNo = row.dataset.flightNo || '';
            const depAirport = row.dataset.depAirport || '';
            const arrAirport = row.dataset.arrAirport || '';
            const rowAirline = row.dataset.airline || '';
            const rowStatus = row.dataset.status || '';

            const matchQ = !q || [flightNo, depAirport, arrAirport, rowAirline].some(v => v.includes(q));
            const matchStatus = !status || rowStatus === status;
            const matchAirline = !airline || rowAirline === airline;

            row.style.display = 'none';
            return matchQ && matchStatus && matchAirline;
        });

        const total = visible.length;
        const totalPages = total === 0 ? 0 : Math.ceil(total / PER_PAGE);
        if (totalPages === 0) currentPage = 1;
        else if (currentPage > totalPages) currentPage = totalPages;
        else if (currentPage < 1) currentPage = 1;

        const from = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
        const to = Math.min(currentPage * PER_PAGE, total);
        const slice = visible.slice(from - 1, to);
        slice.forEach(row => row.style.display = '');

        const rowCount = document.getElementById('rowCount');
        const footerInfo = document.getElementById('footerInfo');
        if (rowCount) rowCount.textContent = `${total} ucus bulundu`;
        if (footerInfo) footerInfo.textContent = total === 0 ? 'Kayit yok' : `${from}-${to} / ${total} ucus`;

        toggleNoResultRow(total === 0);
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const ul = document.getElementById('paginationList');
        if (!ul) return;
        if (totalPages <= 1) {
            ul.innerHTML = '';
            return;
        }

        let html = `<li class="${currentPage === 1 ? 'disabled' : ''}">
        <span class="pg-btn pg-arrow" onclick="${currentPage > 1 ? 'goPage(' + (currentPage - 1) + ')' : ''}">
            <i class="bi bi-chevron-left"></i>
        </span>
    </li>`;

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

        html += `<li class="${currentPage === totalPages ? 'disabled' : ''}">
        <span class="pg-btn pg-arrow" onclick="${currentPage < totalPages ? 'goPage(' + (currentPage + 1) + ')' : ''}">
            <i class="bi bi-chevron-right"></i>
        </span>
    </li>`;

        ul.innerHTML = html;
    }

    function buildPageRange(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = [1];
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

    function confirmDelete(flightId, flightNo) {
        const flightNoEl = document.getElementById('deleteFlightNo');
        const deleteForm = document.getElementById('deleteForm');
        const deleteModal = document.getElementById('deleteModal');
        if (flightNoEl) flightNoEl.textContent = flightNo;
        if (deleteForm) deleteForm.action = `/Admin/Flight/Delete/${flightId}`;
        if (deleteModal) deleteModal.classList.add('open');
    }

    function closeDeleteModal() {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) deleteModal.classList.remove('open');
    }

    window.filterTable = filterTable;
    window.goPage = goPage;
    window.confirmDelete = confirmDelete;
    window.closeDeleteModal = closeDeleteModal;

    document.addEventListener('DOMContentLoaded', () => {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.addEventListener('click', function (e) {
                if (e.target === this) closeDeleteModal();
            });
        }
        applyFiltersAndRender();
    });
})();
