(function () {
    const items = document.querySelectorAll('#faq-list .faq-item');

    items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked (if it was closed)
        if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        }
    });
    });
})();
