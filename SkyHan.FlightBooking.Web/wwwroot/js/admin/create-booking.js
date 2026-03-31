var passengerCount = 0;
var currencyCode = 'EUR';
var BASE_PRICE = 246;
var CHILD_PRICE = 180;
var INFANT_PRICE = 50;

function addPassenger(defaultType) {
    passengerCount++;
    var idx = passengerCount;
    var type = defaultType || 'Yetişkin';

    var card = document.createElement('div');
    card.className = 'card border-0 mb-3 passenger-card passenger-dynamic-card';
    card.id = 'passenger-' + idx;

    card.innerHTML =
        '<div class="card-body p-3">' +
        '<div class="d-flex align-items-center justify-content-between mb-3">' +
        '<div class="d-flex align-items-center gap-2">' +
        '<div class="passenger-index-badge">' + idx + '</div>' +
        '<span class="passenger-index-title">Yolcu ' + idx + '</span>' +
        '</div>' +
        '<button type="button" class="btn btn-danger btn-sm py-1 px-2 passenger-remove-btn" onclick="removePassenger(' + idx + ')">' +
        '<i class="bi bi-trash3-fill me-1"></i>Sil' +
        '</button>' +
        '</div>' +
        '<div class="row g-3">' +
        '<div class="col-md-3 col-6">' +
        '<label class="form-label fw-semibold passenger-field-label">Ad</label>' +
        '<input type="text" class="form-control form-control-sm passenger-field-input passenger-name" placeholder="Ad" required />' +
        '</div>' +
        '<div class="col-md-3 col-6">' +
        '<label class="form-label fw-semibold passenger-field-label">Soyad</label>' +
        '<input type="text" class="form-control form-control-sm passenger-field-input passenger-surname" placeholder="Soyad" required />' +
        '</div>' +
        '<div class="col-md-2 col-6">' +
        '<label class="form-label fw-semibold passenger-field-label">Doğum Tarihi</label>' +
        '<input type="date" class="form-control form-control-sm passenger-field-input passenger-birthdate" required />' +
        '</div>' +
        '<div class="col-md-2 col-6">' +
        '<label class="form-label fw-semibold passenger-field-label">Cinsiyet</label>' +
        '<select class="form-select form-select-sm passenger-field-input passenger-gender" required>' +
        '<option value="">Seçin</option>' +
        '<option value="Male">Erkek</option>' +
        '<option value="Female">Kadın</option>' +
        '</select>' +
        '</div>' +
        '<div class="col-md-2 col-12">' +
        '<label class="form-label fw-semibold passenger-field-label">Yolcu Tipi</label>' +
        '<select class="form-select form-select-sm passenger-type-select passenger-field-input" onchange="updateSummary()">' +
        '<option value="Yetişkin"' + (type === 'Yetişkin' ? ' selected' : '') + '>Yetişkin</option>' +
        '<option value="Çocuk"' + (type === 'Çocuk' ? ' selected' : '') + '>Çocuk</option>' +
        '<option value="Bebek"' + (type === 'Bebek' ? ' selected' : '') + '>Bebek</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '</div>';

    document.getElementById('passengerList').appendChild(card);
    updateSummary();
}

function removePassenger(idx) {
    var el = document.getElementById('passenger-' + idx);
    if (el) {
        el.remove();
        updateSummary();
    }
}

function updateSummary() {
    var cards = document.querySelectorAll('.passenger-card');
    var adults = 0, children = 0, infants = 0;

    cards.forEach(function (card) {
        var sel = card.querySelector('.passenger-type-select');
        if (!sel) return;
        if (sel.value === 'Yetişkin') adults++;
        else if (sel.value === 'Çocuk') children++;
        else if (sel.value === 'Bebek') infants++;
    });

    var total = adults + children + infants;
    var price = (adults * BASE_PRICE) + (children * CHILD_PRICE) + (infants * INFANT_PRICE);

    document.getElementById('totalPassengerBadge').textContent = total;
    document.getElementById('adultCount').textContent = adults;
    document.getElementById('adultPrice').textContent = adults * BASE_PRICE;
    document.getElementById('childCount').textContent = children;
    document.getElementById('childPrice').textContent = children * CHILD_PRICE;
    document.getElementById('infantCount').textContent = infants;
    document.getElementById('infantPrice').textContent = infants * INFANT_PRICE;
    document.getElementById('totalPrice').textContent = price + ' ' + currencyCode;
    var totalPriceInput = document.getElementById('totalPriceInput');
    if (totalPriceInput) {
        totalPriceInput.value = price;
    }

    var childRow = document.getElementById('childRow');
    var infantRow = document.getElementById('infantRow');
    childRow.style.display = children > 0 ? 'flex' : 'none';
    infantRow.style.display = infants > 0 ? 'flex' : 'none';
    reindexPassengerFields();
}

function reindexPassengerFields() {
    var cards = document.querySelectorAll('.passenger-card');
    cards.forEach(function (card, index) {
        var displayIndex = index + 1;
        var badge = card.querySelector('.passenger-index-badge');
        var title = card.querySelector('.passenger-index-title');

        if (badge) badge.textContent = displayIndex;
        if (title) title.textContent = 'Yolcu ' + displayIndex;

        var nameInput = card.querySelector('.passenger-name');
        var surnameInput = card.querySelector('.passenger-surname');
        var birthDateInput = card.querySelector('.passenger-birthdate');
        var genderInput = card.querySelector('.passenger-gender');

        if (nameInput) nameInput.name = 'Passengers[' + index + '].Name';
        if (surnameInput) surnameInput.name = 'Passengers[' + index + '].Surname';
        if (birthDateInput) birthDateInput.name = 'Passengers[' + index + '].BirthDate';
        if (genderInput) genderInput.name = 'Passengers[' + index + '].Gender';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var bookingPage = document.querySelector('.booking-page');
    if (bookingPage) {
        var dynamicBasePrice = parseFloat(bookingPage.dataset.basePrice);
        if (!isNaN(dynamicBasePrice) && dynamicBasePrice > 0) {
            BASE_PRICE = dynamicBasePrice;
            CHILD_PRICE = Math.round(dynamicBasePrice * 0.73);
            INFANT_PRICE = Math.round(dynamicBasePrice * 0.2);
        }

        if (bookingPage.dataset.currency) {
            currencyCode = bookingPage.dataset.currency;
        }
    }

    addPassenger('Yetişkin');

    var bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            reindexPassengerFields();

            var totalPassengers = document.querySelectorAll('.passenger-card').length;
            if (totalPassengers === 0) {
                event.preventDefault();
                alert('Lütfen en az bir yolcu ekleyin.');
            }
        });
    }
});
