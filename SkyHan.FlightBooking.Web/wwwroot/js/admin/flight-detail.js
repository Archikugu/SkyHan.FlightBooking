function normalizePassenger(p) {
    return {
        name: p.name || "",
        surname: p.surname || "",
        email: p.email || "",
        phone: p.phone || "",
        flightId: p.flightId || "",
        gender: p.gender || "",
        type: p.type || "Yetişkin",
        pnr: p.pnr || "",
        seat: p.seat || "—",
        checkin: p.checkin || "Not Checked",
        payment: p.payment || "Pending",
        ticket: p.ticket || "Not Issued"
    };
}

var allPassengers = (window.flightDetailPassengersData || []).map(normalizePassenger);
var filtered = allPassengers.slice();
var currentPage = 1;
var perPage = 8;

var avatarColors = [
    "#1a2e4a", "#065f46", "#7c2d12", "#1e40af",
    "#6b21a8", "#991b1b", "#0e7490", "#a16207",
    "#064e3b", "#1e3a5f", "#4a044e", "#7f1d1d"
];

function getColor(name) {
    var i = 0;
    var n = name || "";
    for (var c = 0; c < n.length; c++) i += n.charCodeAt(c);
    return avatarColors[i % avatarColors.length];
}

function initials(name, surname) {
    var n = name || "";
    var s = surname || "";
    return ((n[0] || "") + (s[0] || "")).toUpperCase();
}

function checkinBadge(v) {
    return v === "Checked-In"
        ? '<span class="bp bp-green"><span class="dot"></span>Yapıldı</span>'
        : '<span class="bp bp-gray"><span class="dot"></span>Yapılmadı</span>';
}

function paymentBadge(v) {
    if (v === "Paid") return '<span class="bp bp-green"><span class="dot"></span>Ödendi</span>';
    if (v === "Pending") return '<span class="bp bp-yellow"><span class="dot"></span>Beklemede</span>';
    if (v === "Failed") return '<span class="bp bp-red"><span class="dot"></span>Başarısız</span>';
    return '<span class="bp bp-gray"><span class="dot"></span>' + (v || "—") + "</span>";
}

function ticketBadge(v) {
    return v === "Issued"
        ? '<span class="bp bp-blue"><span class="dot"></span>Kesildi</span>'
        : '<span class="bp bp-gray"><span class="dot"></span>Kesilmedi</span>';
}

function typeBadge(v) {
    var cls = v === "Yetişkin" ? "bp-blue" : v === "Çocuk" ? "bp-yellow" : "bp-gray";
    return '<span class="bp ' + cls + '">' + (v || "—") + "</span>";
}

function applyFilter() {
    var name = (document.getElementById("fName").value || "").toLowerCase().trim();
    var pnr = (document.getElementById("fPnr").value || "").toLowerCase().trim();
    var checkin = document.getElementById("fCheckin").value;
    var payment = document.getElementById("fPayment").value;
    var type = document.getElementById("fType").value;

    filtered = allPassengers.filter(function (raw) {
        var p = normalizePassenger(raw);
        var fullName = ((p.name || "") + " " + (p.surname || "")).toLowerCase();
        return (!name || fullName.includes(name))
            && (!pnr || (p.pnr || "").toLowerCase().includes(pnr))
            && (!checkin || p.checkin === checkin)
            && (!payment || p.payment === payment)
            && (!type || p.type === type);
    });

    currentPage = 1;
    render();
}

function clearFilter() {
    document.getElementById("fName").value = "";
    document.getElementById("fPnr").value = "";
    document.getElementById("fCheckin").value = "";
    document.getElementById("fPayment").value = "";
    document.getElementById("fType").value = "";
    filtered = allPassengers.slice();
    currentPage = 1;
    render();
}

function render() {
    var total = filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / perPage));
    if (currentPage > totalPages) currentPage = totalPages;

    var from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    var to = Math.min(currentPage * perPage, total);
    var slice = filtered.slice(from - 1, to);

    document.getElementById("totalBadge").textContent = total + " yolcu";
    document.getElementById("pageInfo").textContent = total === 0
        ? "Sonuç bulunamadı"
        : "Showing " + from + " to " + to + " of " + total + " entries";

    var tbody = document.getElementById("tableBody");
    if (slice.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="10" class="text-center py-5 text-muted">' +
            '<i class="bi bi-person-slash" style="font-size:36px;display:block;margin-bottom:10px;opacity:.2;"></i>' +
            "Yolcu bulunamadı." +
            "</td></tr>";
        document.getElementById("pagination").innerHTML = "";
        return;
    }

    tbody.innerHTML = slice.map(function (raw) {
        var p = normalizePassenger(raw);
        var color = getColor(p.name);
        var init = initials(p.name, p.surname);
        var gender = p.gender || "—";
        var genderIcon = gender === "Erkek" || gender === "Male"
            ? "gender-male text-primary"
            : (gender === "Kadın" || gender === "Female" ? "gender-female text-danger" : "dash");
        var checkInUrl = "/Admin/CheckIn/Index?flightId=" + encodeURIComponent(p.flightId || "") + "&pnr=" + encodeURIComponent(p.pnr || "");

        return "<tr>" +
            "<td><div class=\"pax-name-cell\">" +
            "<div class=\"pax-avatar\" style=\"background:" + color + "1a;color:" + color + ";\">" + init + "</div>" +
            "<div><div class=\"pax-name\">" + (p.name || "") + " " + (p.surname || "") + "</div>" +
            "<div class=\"pax-email\">" + (p.email || "") + "</div></div></div></td>" +
            "<td><span style=\"font-size:13px;color:#475569;\"><i class=\"bi bi-" + genderIcon + " me-1\"></i>" + gender + "</span></td>" +
            "<td>" + typeBadge(p.type) + "</td>" +
            "<td><span style=\"font-family:monospace;font-weight:700;font-size:12.5px;color:#0f172a;background:#f8fafc;padding:3px 8px;border-radius:6px;border:1px solid #f1f5f9;\">" + (p.pnr || "—") + "</span></td>" +
            "<td><span class=\"seat-badge\">" + (p.seat || "—") + "</span></td>" +
            "<td>" + checkinBadge(p.checkin) + "</td>" +
            "<td>" + paymentBadge(p.payment) + "</td>" +
            "<td>" + ticketBadge(p.ticket) + "</td>" +
            "<td><span style=\"font-size:12.5px;color:#64748b;white-space:nowrap;\">" +
            (p.phone ? "<i class=\"bi bi-telephone me-1\" style=\"font-size:11px;\"></i>" + p.phone : "—") +
            "</span></td>" +
            "<td><div class=\"act-wrap\">" +
            "<a href=\"#\" class=\"aib aib-view\" title=\"Detay\"><i class=\"bi bi-eye-fill\"></i></a>" +
            "<a href=\"#\" class=\"aib aib-edit\" title=\"Düzenle\"><i class=\"bi bi-pencil-fill\"></i></a>" +
            "<a href=\"" + checkInUrl + "\" class=\"aib aib-checkin\" title=\"Check-In\"><i class=\"bi bi-person-check-fill\"></i></a>" +
            "<button class=\"aib aib-del\" title=\"İptal\" style=\"border:none;cursor:pointer;\"><i class=\"bi bi-trash-fill\"></i></button>" +
            "</div></td>" +
            "</tr>";
    }).join("");

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    var ul = document.getElementById("pagination");
    var html = "";

    html += '<li class="' + (currentPage === 1 ? "disabled" : "") + '">' +
        '<span onclick="' + (currentPage > 1 ? "goPage(currentPage-1)" : "") + '"' +
        ' style="cursor:' + (currentPage === 1 ? "default" : "pointer") + '">' +
        '<i class="bi bi-chevron-left" style="font-size:10px;"></i></span></li>';

    buildRange(currentPage, totalPages).forEach(function (p) {
        if (p === "...") {
            html += '<li><span style="cursor:default;border:none;background:none;color:#94a3b8;">…</span></li>';
        } else {
            html += '<li class="' + (p === currentPage ? "active" : "") + '">' +
                '<a onclick="goPage(' + p + ')">' + p + "</a></li>";
        }
    });

    html += '<li class="' + (currentPage === totalPages ? "disabled" : "") + '">' +
        '<span onclick="' + (currentPage < totalPages ? "goPage(currentPage+1)" : "") + '"' +
        ' style="cursor:' + (currentPage === totalPages ? "default" : "pointer") + '">' +
        '<i class="bi bi-chevron-right" style="font-size:10px;"></i></span></li>';

    ul.innerHTML = html;
}

function buildRange(cur, total) {
    if (total <= 7) {
        var a = [];
        for (var i = 1; i <= total; i++) a.push(i);
        return a;
    }
    var pages = [1];
    if (cur > 3) pages.push("...");
    for (var x = Math.max(2, cur - 1); x <= Math.min(total - 1, cur + 1); x++) pages.push(x);
    if (cur < total - 2) pages.push("...");
    pages.push(total);
    return pages;
}

function goPage(p) {
    var total = Math.max(1, Math.ceil(filtered.length / perPage));
    if (p < 1 || p > total) return;
    currentPage = p;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

window.applyFilter = applyFilter;
window.clearFilter = clearFilter;
window.goPage = goPage;

document.addEventListener("DOMContentLoaded", function () {
    render();
});
