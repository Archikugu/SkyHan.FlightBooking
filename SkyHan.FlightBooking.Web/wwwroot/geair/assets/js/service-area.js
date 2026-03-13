(function () {
    const track  = document.getElementById('svc-track');
    const outer  = document.getElementById('svc-outer');
    const btnPrev = document.getElementById('svc-prev');
    const btnNext = document.getElementById('svc-next');
    const dotsEl  = document.getElementById('svc-dots');

    if(!track || !outer || !btnPrev || !btnNext || !dotsEl) return;

    const cards      = Array.from(track.querySelectorAll('.svc-card'));
    const CARD_W     = () => cards[0].offsetWidth + 20; // card width + gap
    const VISIBLE    = () => Math.floor(outer.offsetWidth / CARD_W());
    const MAX_IDX    = () => Math.max(0, cards.length - VISIBLE());

    let current = 0;

    /* ── Dots ── */
    function buildDots() {
    dotsEl.innerHTML = '';
    const count = MAX_IDX() + 1;
    for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'svc-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', `Slayt ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
    }
    }

    function updateDots() {
    dotsEl.querySelectorAll('.svc-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
    });
    }

    /* ── Move ── */
    function goTo(idx) {
    current = Math.max(0, Math.min(idx, MAX_IDX()));
    track.style.transform = `translateX(-${current * CARD_W()}px)`;
    updateDots();
    btnPrev.style.opacity = current === 0 ? '.4' : '1';
    btnNext.style.opacity = current >= MAX_IDX() ? '.4' : '1';
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    /* ── Touch / drag ── */
    let startX = 0, startIdx = 0, dragging = false;

    outer.addEventListener('pointerdown', e => {
    startX = e.clientX; startIdx = current; dragging = true;
    outer.classList.add('is-dragging');
    outer.setPointerCapture(e.pointerId);
    });

    outer.addEventListener('pointermove', e => {
    if (!dragging) return;
    const delta = startX - e.clientX;
    const shifted = startIdx + delta / CARD_W();
    const clamped = Math.max(0, Math.min(shifted, MAX_IDX()));
    track.style.transform = `translateX(-${clamped * CARD_W()}px)`;
    });

    outer.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    outer.classList.remove('is-dragging');
    const delta = startX - e.clientX;
    if (Math.abs(delta) > CARD_W() * 0.25) {
        goTo(delta > 0 ? startIdx + 1 : startIdx - 1);
    } else {
        goTo(startIdx);
    }
    });

    /* ── Init & resize ── */
    buildDots();
    goTo(0);
    window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, MAX_IDX())); });
})();
