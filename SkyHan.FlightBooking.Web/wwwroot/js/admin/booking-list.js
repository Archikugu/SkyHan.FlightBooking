(() => {
    const allData = [
        { id: 'RES-001', flight: 'TK1932', name: 'Ahmet Yılmaz', passengers: 2, price: '492 EUR', date: '2025-04-06', status: 'Confirmed' },
        { id: 'RES-002', flight: 'PC2014', name: 'Ayşe Kara', passengers: 1, price: '146 EUR', date: '2025-04-06', status: 'Pending' },
        { id: 'RES-003', flight: 'TK1021', name: 'Mehmet Demir', passengers: 3, price: '633 EUR', date: '2025-04-07', status: 'Confirmed' },
        { id: 'RES-004', flight: 'LH1305', name: 'Fatma Çelik', passengers: 1, price: '260 EUR', date: '2025-04-07', status: 'Cancelled' },
        { id: 'RES-005', flight: 'TK1850', name: 'Ali Öztürk', passengers: 4, price: '1100 EUR', date: '2025-04-08', status: 'Confirmed' },
        { id: 'RES-006', flight: 'PC3022', name: 'Zeynep Arslan', passengers: 2, price: '640 EUR', date: '2025-04-08', status: 'Pending' },
        { id: 'RES-007', flight: 'TK9001', name: 'Hasan Şahin', passengers: 1, price: '780 EUR', date: '2025-04-09', status: 'Confirmed' },
        { id: 'RES-008', flight: 'TK1932', name: 'Elif Yıldız', passengers: 2, price: '492 EUR', date: '2025-04-09', status: 'Cancelled' },
        { id: 'RES-009', flight: 'LH1305', name: 'Mustafa Aydın', passengers: 3, price: '780 EUR', date: '2025-04-10', status: 'Confirmed' },
        { id: 'RES-010', flight: 'PC2014', name: 'Selin Güneş', passengers: 1, price: '146 EUR', date: '2025-04-10', status: 'Pending' },
        { id: 'RES-011', flight: 'TK1021', name: 'Burak Koç', passengers: 2, price: '422 EUR', date: '2025-04-11', status: 'Confirmed' },
        { id: 'RES-012', flight: 'TK9001', name: 'Deniz Polat', passengers: 1, price: '780 EUR', date: '2025-04-11', status: 'Cancelled' },
        { id: 'RES-013', flight: 'PC3022', name: 'Gizem Erdoğan', passengers: 4, price: '1280 EUR', date: '2025-04-12', status: 'Confirmed' },
        { id: 'RES-014', flight: 'TK1850', name: 'Serkan Doğan', passengers: 2, price: '550 EUR', date: '2025-04-12', status: 'Pending' },
        { id: 'RES-015', flight: 'LH1305', name: 'Merve Aksoy', passengers: 1, price: '260 EUR', date: '2025-04-13', status: 'Confirmed' },
        { id: 'RES-016', flight: 'TK1932', name: 'Cem Kılıç', passengers: 3, price: '738 EUR', date: '2025-04-13', status: 'Confirmed' },
        { id: 'RES-017', flight: 'PC2014', name: 'Neslihan Bozkurt', passengers: 1, price: '146 EUR', date: '2025-04-14', status: 'Cancelled' },
        { id: 'RES-018', flight: 'TK1021', name: 'Oğuz Tekin', passengers: 2, price: '422 EUR', date: '2025-04-14', status: 'Pending' },
        { id: 'RES-019', flight: 'TK9001', name: 'Pınar Çakır', passengers: 1, price: '780 EUR', date: '2025-04-15', status: 'Confirmed' },
        { id: 'RES-020', flight: 'LH1305', name: 'Emre Yavuz', passengers: 3, price: '780 EUR', date: '2025-04-15', status: 'Confirmed' }
    ];

    let filtered = allData.slice();
    let currentPage = 1;
    const perPage = 8;

    const statusCfg = {
        Confirmed: { label: 'Onaylandı', cls: 'bg-success-subtle text-success', icon: 'bi-check-circle-fill' },
        Pending: { label: 'Beklemede', cls: 'bg-warning-subtle text-warning', icon: 'bi-clock-fill' },
        Cancelled: { label: 'İptal', cls: 'bg-danger-subtle text-danger', icon: 'bi-x-circle-fill' }
    };

    function applyFilter() {
        const flightQ = (document.getElementById('filterFlight')?.value || '').toLowerCase().trim();
        const statusQ = document.getElementById('filterStatus')?.value || '';
        const dateQ = document.getElementById('filterDate')?.value || '';

        filtered = allData.filter(r => {
            const mF = !flightQ || r.flight.toLowerCase().includes(flightQ) || r.id.toLowerCase().includes(flightQ);
            const mS = !statusQ || r.status === statusQ;
            const mD = !dateQ || r.date === dateQ;
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
        filtered = allData.slice();
        currentPage = 1;
        render();
    }

    function render() {
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
        const to = Math.min(currentPage * perPage, total);
        const slice = filtered.slice(from - 1, to);

        const totalCount = document.getElementById('totalCount');
        const pageInfo = document.getElementById('pageInfo');
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        if (totalCount) totalCount.textContent = `${total} kayıt`;
        if (pageInfo) pageInfo.textContent = total === 0
            ? 'Sonuç bulunamadı'
            : `${from}–${to} / ${total} kayıt gösteriliyor`;

        if (slice.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">
                <i class="bi bi-inbox booking-empty-icon"></i>
                Kayıt bulunamadı.
            </td></tr>`;
            const pagination = document.getElementById('pagination');
            if (pagination) pagination.innerHTML = '';
            return;
        }

        tbody.innerHTML = slice.map((r, i) => {
            const cfg = statusCfg[r.status] || { label: r.status, cls: 'bg-secondary-subtle text-secondary', icon: 'bi-circle' };
            const rowNum = (currentPage - 1) * perPage + i + 1;
            const initials = r.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

            return `<tr class="booking-row">
                <td class="booking-cell-index">${rowNum}</td>
                <td class="booking-cell">
                    <span class="booking-flight-code">${r.flight}</span>
                    <div class="booking-id-sub">${r.id}</div>
                </td>
                <td class="booking-cell">
                    <div class="d-flex align-items-center gap-2">
                        <div class="booking-name-badge">${initials}</div>
                        <span class="booking-name-text">${r.name}</span>
                    </div>
                </td>
                <td class="booking-cell">
                    <div class="d-flex align-items-center gap-1">
                        <i class="bi bi-people-fill text-muted booking-mini-icon"></i>
                        <span class="booking-passenger-count">${r.passengers}</span>
                        <span class="booking-passenger-label">yolcu</span>
                    </div>
                </td>
                <td class="booking-cell"><span class="booking-price">${r.price}</span></td>
                <td class="booking-cell"><span class="booking-date">${formatDate(r.date)}</span></td>
                <td class="booking-cell">
                    <span class="badge ${cfg.cls} d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill booking-status-badge">
                        <i class="bi ${cfg.icon} booking-status-icon"></i>${cfg.label}
                    </span>
                </td>
                <td class="booking-cell">
                    <div class="d-flex gap-1">
                        <a href="#" class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 booking-action-btn">
                            <i class="bi bi-eye-fill booking-action-icon"></i> Detay
                        </a>
                        <button class="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 booking-action-btn" onclick="cancelBooking('${r.id}')">
                            <i class="bi bi-x-circle-fill booking-action-icon"></i> İptal
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        renderPagination(totalPages);
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

    function formatDate(d) {
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const parts = d.split('-');
        return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    }

    function cancelBooking(id) {
        if (!confirm(`${id} numaralı rezervasyonu iptal etmek istediğinize emin misiniz?`)) return;
        const row = allData.find(r => r.id === id);
        if (row) {
            row.status = 'Cancelled';
            applyFilter();
        }
    }

    window.applyFilter = applyFilter;
    window.clearFilter = clearFilter;
    window.goPage = goPage;
    window.cancelBooking = cancelBooking;

    document.addEventListener('DOMContentLoaded', () => render());
})();
