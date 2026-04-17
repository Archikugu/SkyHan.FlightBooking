/* ── Config ──────────────────────────────────────────── */
var pageData = document.getElementById("checkinPage");
var BASE_PRICE = parseFloat((pageData && pageData.dataset.basePrice) || "0") || 0;
var CURRENCY = (pageData && pageData.dataset.currency) || "₺";
var ROWS = 20;
var COLS = ["A", "B", "C", "D", "E", "F"];

var OCCUPIED = [
  "1A","1B","2C","3D","4A","4F","5B","5E","6C","7A","7D","8B","8F","9C","10A","10E",
  "11B","12D","13A","13C","14F","15B","15E","16A","17C","18D","19B","20F","3B","6E"
];
var PREMIUM = ["1C","1D","2A","2F","3A","3F","4C","4D"];

/* ── State ───────────────────────────────────────────── */
var currentTab = 1;
var selectedSeat = null;
var selectedMeal = null;
var selectedExtras = [];
var specialBags = {};
var cabinChoice = { id: "free", price: 0, name: "Kişisel Eşya" };
var holdKg = 0;
var holdPrice = 0;
var mealPrice = 0;
var HOLD_PRICES = { 0: 0, 8: 100, 16: 180, 24: 240, 32: 300 };

var meals = [
  { id: "pasta", name: "Fırın Makarna", desc: "Domates soslu, peynirli fırın makarnası", emoji: "🍝", tags: ["hot","veg"], price: 0, free: true, cat: "hot" },
  { id: "chicken", name: "Izgara Tavuk", desc: "Sebzeli pirinç pilavı ve mevsim salatası", emoji: "🍗", tags: ["hot","hal"], price: 0, free: true, cat: "hot" },
  { id: "beef", name: "Et Sote", desc: "Mantar soslu biftek, patates püresiyle", emoji: "🥩", tags: ["hot","hal"], price: 30, free: false, cat: "hot" },
  { id: "salad", name: "Akdeniz Salatası", desc: "Taze sebzeler, zeytinyağı, limon", emoji: "🥗", tags: ["cold","veg"], price: 0, free: true, cat: "cold" },
  { id: "wrap", name: "Tavuklu Wrap", desc: "Marul, domates, özel sos ile wrap", emoji: "🌯", tags: ["cold","hal"], price: 0, free: true, cat: "cold" },
  { id: "sushi", name: "Sushi Tabağı", desc: "8 parça sushi, wasabi ve soya sosu", emoji: "🍱", tags: ["cold"], price: 50, free: false, cat: "cold" },
  { id: "veg", name: "Vejetaryen Köfte", desc: "Mercimek ve sebze köftesi, yoğurt sosu", emoji: "🧆", tags: ["hot","veg"], price: 0, free: true, cat: "veg" },
  { id: "fruit", name: "Meyve Tabağı", desc: "Mevsim meyveleri, bal, granola", emoji: "🍓", tags: ["cold","veg"], price: 0, free: true, cat: "snack" },
  { id: "sand", name: "Sandviç Menü", desc: "Peynirli sandviç + çips + içecek", emoji: "🥪", tags: ["cold"], price: 25, free: false, cat: "snack" },
  { id: "cake", name: "Çikolatalı Kek", desc: "Fındıklı çikolata sos ile servis edilir", emoji: "🍰", tags: ["cold"], price: 20, free: false, cat: "snack" },
  { id: "halal", name: "Helal Tabak", desc: "Helal sertifikalı et + pilav + salata", emoji: "🍛", tags: ["hot","hal"], price: 0, free: true, cat: "hal" },
  { id: "kid", name: "Çocuk Menüsü", desc: "Nugget, patates, meyve suyu", emoji: "🍟", tags: ["hot"], price: 0, free: true, cat: "hot" }
];

var extras = [
  { id: "priority", name: "Öncelikli Biniş", desc: "İlk binen yolcu", price: 120, icon: "bi-lightning-charge-fill", bg: "#fefce8", fg: "#ca8a04" },
  { id: "comfort", name: "Konfor Paketi", desc: "Battaniye + yastık + maske", price: 90, icon: "bi-stars", bg: "#f5f3ff", fg: "#7c3aed" },
  { id: "insurance", name: "Seyahat Sigortası", desc: "Tam kapsamlı sigorta", price: 200, icon: "bi-shield-check-fill", bg: "#f0fdf4", fg: "#16a34a" },
  { id: "lounge", name: "Lounge Erişimi", desc: "VIP bekleme salonu", price: 350, icon: "bi-gem", bg: "#fff1f2", fg: "#e11d48" },
  { id: "wifi", name: "Uçuş içi Wi-Fi", desc: "Tüm uçuş boyunca", price: 80, icon: "bi-wifi", bg: "#eff6ff", fg: "#2563eb" },
  { id: "assist", name: "Özel Yardım", desc: "Tekerlekli sandalye vb.", price: 0, icon: "bi-person-heart", bg: "#f0fdf4", fg: "#16a34a" }
];

function goTab(n) {
  document.getElementById("panel-" + currentTab).classList.remove("active");
  document.getElementById("step-tab-" + currentTab).classList.remove("active");
  if (n > currentTab) {
    document.getElementById("step-tab-" + currentTab).classList.add("done");
    document.getElementById("step-num-" + currentTab).innerHTML = '<i class="bi bi-check-lg" style="font-size:11px;"></i>';
  } else {
    for (var i = n; i <= 5; i++) {
      document.getElementById("step-tab-" + i).classList.remove("done");
      document.getElementById("step-num-" + i).textContent = i;
    }
  }
  currentTab = n;
  document.getElementById("panel-" + n).classList.add("active");
  document.getElementById("step-tab-" + n).classList.add("active");
  var pct = Math.round((n / 5) * 100);
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressLabel").textContent = "Adım " + n + " / 5";
  document.getElementById("progressPct").textContent = "%" + pct;
  if (n === 5) buildSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function selectBaggage(group, id, price) {
  document.querySelectorAll('[id^="cabin-"]').forEach(function (el) { el.classList.remove("selected"); });
  document.getElementById("cabin-" + id).classList.add("selected");
  var names = { free: "Kişisel Eşya", small: "Kabin (S)", large: "Kabin (L)" };
  cabinChoice = { id: id, price: price, name: names[id] };
  document.getElementById("sideCabin").textContent = names[id];
  updatePrice();
}

function updateHoldSlider(val) {
  val = parseInt(val, 10);
  holdKg = val;
  holdPrice = HOLD_PRICES[val] || 0;
  var slider = document.getElementById("holdKgSlider");
  var pct = (val / 32) * 100;
  slider.style.setProperty("--val", pct + "%");
  var display = document.getElementById("holdKgDisplay");
  if (val === 0) {
    display.textContent = "0 kg";
    document.getElementById("sideHold").textContent = "—";
  } else {
    display.textContent = val + " kg";
    document.getElementById("sideHold").textContent = val + " kg · " + holdPrice + " " + CURRENCY;
  }
  updatePrice();
}

function toggleSpecial(id, price) {
  var card = document.getElementById("special-" + id);
  if (specialBags[id]) {
    delete specialBags[id];
    card.classList.remove("selected");
  } else {
    specialBags[id] = price;
    card.classList.add("selected");
  }
  updatePrice();
}

function makeSeatBtn(sid, colIdx) {
  var occ = OCCUPIED.indexOf(sid) !== -1;
  var prem = PREMIUM.indexOf(sid) !== -1;
  var cls = "seat";
  if (occ) cls += " occupied";
  if (prem && !occ) cls += " window";
  var style = (prem && !occ) ? 'style="background:#fefce8;border-color:#fde68a;"' : "";
  return '<button class="' + cls + '" id="s-' + sid + '"' +
    (occ ? " disabled" : ' onclick="pickSeat(\'' + sid + '\'' + (prem ? ",true" : ",false") + ')"') +
    " " + style + ">" + sid + "</button>";
}

function buildSeatMap() {
  var map = document.getElementById("seatMap");
  if (!map) return;
  var html = '<div class="smap-hdr"><div></div>';
  ["A", "B", "C"].forEach(function (c) { html += '<div class="smap-col-lbl">' + c + "</div>"; });
  html += "<div></div>";
  ["D", "E", "F"].forEach(function (c) { html += '<div class="smap-col-lbl">' + c + "</div>"; });
  html += "</div>";
  for (var r = 1; r <= ROWS; r++) {
    html += '<div class="smap-row"><div class="smap-row-num">' + r + "</div>";
    for (var i = 0; i < 3; i++) html += makeSeatBtn(r + COLS[i], i);
    html += "<div></div>";
    for (var j = 3; j < 6; j++) html += makeSeatBtn(r + COLS[j], j);
    html += "</div>";
  }
  map.innerHTML = html;
  updateHoldSlider(0);
}

function pickSeat(id, premium) {
  if (selectedSeat) {
    var prev = document.getElementById("s-" + selectedSeat);
    if (prev) {
      prev.classList.remove("selected");
      if (PREMIUM.indexOf(selectedSeat) !== -1) {
        prev.style.background = "#fefce8";
        prev.style.borderColor = "#fde68a";
      }
    }
  }
  selectedSeat = (selectedSeat === id) ? null : id;
  var tag = document.getElementById("selectedTag");
  var label = document.getElementById("selectedLabel");
  if (selectedSeat) {
    var el = document.getElementById("s-" + selectedSeat);
    if (el) {
      el.classList.add("selected");
      el.style.background = "";
      el.style.borderColor = "";
    }
    tag.classList.remove("empty");
    label.textContent = "Seçilen: " + selectedSeat + (premium ? " (Ücretli)" : "");
    document.getElementById("sideSeat").textContent = selectedSeat;
  } else {
    tag.classList.add("empty");
    label.textContent = "Koltuk seçilmedi";
    document.getElementById("sideSeat").textContent = "—";
  }
}

function filterSeats(type, btn) {
  document.querySelectorAll(".seat-filter-btn").forEach(function (b) { b.classList.remove("active"); });
  btn.classList.add("active");
  for (var r = 1; r <= ROWS; r++) {
    for (var ci = 0; ci < COLS.length; ci++) {
      var sid = r + COLS[ci];
      var el = document.getElementById("s-" + sid);
      if (!el || el.classList.contains("occupied")) continue;
      var show = true;
      if (type === "window") show = (ci === 0 || ci === 5);
      else if (type === "middle") show = (ci === 1 || ci === 4);
      else if (type === "aisle") show = (ci === 2 || ci === 3);
      else if (type === "front") show = r <= 5;
      else if (type === "exit") show = (r === 10 || r === 11);
      el.style.opacity = show ? "1" : ".25";
      el.style.pointerEvents = show ? "" : "none";
    }
  }
}

function buildMeals(cat) {
  cat = cat || "all";
  var list = meals.filter(function (m) { return cat === "all" || m.cat === cat; });
  var mealGrid = document.getElementById("mealGrid");
  if (!mealGrid) return;
  mealGrid.innerHTML = list.map(function (m) {
    var tagHtml = m.tags.map(function (t) {
      var labels = { hot: "Sıcak", cold: "Soğuk", veg: "Vejetaryen", hal: "Helal" };
      return '<span class="meal-tag ' + t + '">' + (labels[t] || t) + "</span>";
    }).join("");
    return '<div class="meal-card' + (selectedMeal === m.id ? " selected" : "") + '" id="meal-' + m.id + '" onclick="pickMeal(\'' + m.id + '\',' + m.price + ')">' +
      '<div class="meal-check"><i class="bi bi-check-lg"></i></div><div class="meal-img">' + m.emoji + '</div><div class="meal-info"><div class="meal-name">' + m.name + '</div><div class="meal-desc">' + m.desc + '</div><div class="meal-tags">' + tagHtml + "</div>" +
      (m.free ? '<div class="meal-free">Ücretsiz</div>' : '<div class="meal-price">+ ' + m.price + " " + CURRENCY + "</div>") +
      "</div></div>";
  }).join("");
}

function pickMeal(id, price) {
  if (selectedMeal === id) { selectedMeal = null; mealPrice = 0; } else { selectedMeal = id; mealPrice = price; }
  document.querySelectorAll(".meal-card").forEach(function (c) { c.classList.remove("selected"); });
  if (selectedMeal) {
    var el = document.getElementById("meal-" + selectedMeal);
    if (el) el.classList.add("selected");
    var m = meals.find(function (x) { return x.id === id; });
    document.getElementById("sideMeal").textContent = m ? m.name : "—";
  } else {
    document.getElementById("sideMeal").textContent = "—";
  }
  updatePrice();
}

function filterMeals(cat, btn) {
  document.querySelectorAll(".meal-cat-btn").forEach(function (b) { b.classList.remove("active"); });
  btn.classList.add("active");
  buildMeals(cat);
}

function buildExtras() {
  var extrasGrid = document.getElementById("extrasGrid");
  if (!extrasGrid) return;
  extrasGrid.innerHTML = extras.map(function (e) {
    var freeTag = e.price === 0 ? '<div class="ec-price" style="color:#16a34a;">Ücretsiz</div>' : '<div class="ec-price">+ ' + e.price + " " + CURRENCY + "</div>";
    return '<label class="extra-card' + (selectedExtras.indexOf(e.id) !== -1 ? " selected" : "") + '" id="ex-' + e.id + '" onclick="toggleExtra(\'' + e.id + '\',' + e.price + ')">' +
      '<input type="checkbox" /><div class="ec-check"><i class="bi bi-check-lg"></i></div><div class="ec-ico" style="background:' + e.bg + ";color:" + e.fg + ';"><i class="bi ' + e.icon + '"></i></div><div class="ec-name">' + e.name + '</div><div class="ec-desc">' + e.desc + "</div>" + freeTag + "</label>";
  }).join("");
}

function toggleExtra(id, price) {
  var idx = selectedExtras.indexOf(id);
  var card = document.getElementById("ex-" + id);
  if (idx === -1) { selectedExtras.push(id); if (card) card.classList.add("selected"); }
  else { selectedExtras.splice(idx, 1); if (card) card.classList.remove("selected"); }
  updatePrice();
}

function updatePrice() {
  var total = BASE_PRICE;
  var breakdown = "";
  if (cabinChoice.price > 0) {
    total += cabinChoice.price;
    breakdown += '<div class="pr-row"><span class="pr-lbl">' + cabinChoice.name + '</span><span class="pr-val">+ ' + cabinChoice.price + " " + CURRENCY + "</span></div>";
  }
  if (holdPrice > 0) {
    total += holdPrice;
    breakdown += '<div class="pr-row"><span class="pr-lbl">Ambar bagaj ' + holdKg + ' kg</span><span class="pr-val">+ ' + holdPrice + " " + CURRENCY + "</span></div>";
  }
  Object.keys(specialBags).forEach(function (k) {
    total += specialBags[k];
    var n = { sport: "Spor Ekipmanı", golf: "Golf Ekipmanı", pet: "Evcil Hayvan" };
    breakdown += '<div class="pr-row"><span class="pr-lbl">' + n[k] + '</span><span class="pr-val">+ ' + specialBags[k] + " " + CURRENCY + "</span></div>";
  });
  if (mealPrice > 0) {
    total += mealPrice;
    breakdown += '<div class="pr-row"><span class="pr-lbl">Yemek</span><span class="pr-val">+ ' + mealPrice + " " + CURRENCY + "</span></div>";
  }
  selectedExtras.forEach(function (id) {
    var ex = extras.find(function (e) { return e.id === id; });
    if (!ex || ex.price === 0) return;
    total += ex.price;
    breakdown += '<div class="pr-row"><span class="pr-lbl">' + ex.name + '</span><span class="pr-val">+ ' + ex.price + " " + CURRENCY + "</span></div>";
  });
  var pb = document.getElementById("priceBreakdown");
  var tp = document.getElementById("totalPrice");
  if (pb) pb.innerHTML = breakdown;
  if (tp) tp.textContent = total + " " + CURRENCY;
  return total;
}

function buildSummary() {
  var mealObj = meals.find(function (m) { return m.id === selectedMeal; });
  var extList = selectedExtras.map(function (id) { return extras.find(function (e) { return e.id === id; }); }).filter(Boolean);
  var html =
    '<div class="summary-block"><div class="sb-title"><i class="bi bi-grid-3x3-gap me-1"></i> Koltuk</div><div class="sb-row"><span class="sb-lbl">Seçilen Koltuk</span><span class="sb-val">' + (selectedSeat || "—") + "</span></div></div>" +
    '<div class="summary-block"><div class="sb-title"><i class="bi bi-luggage me-1"></i> Bagaj</div><div class="sb-row"><span class="sb-lbl">Kabin</span><span class="sb-val">' + cabinChoice.name + '</span></div><div class="sb-row"><span class="sb-lbl">Uçak Altı</span><span class="sb-val">' + (holdKg > 0 ? holdKg + " kg" : "Yok") + '</span></div><div class="sb-row"><span class="sb-lbl">Özel</span><span class="sb-val">' + (Object.keys(specialBags).length > 0 ? Object.keys(specialBags).length + " kalem" : "Yok") + "</span></div></div>" +
    '<div class="summary-block"><div class="sb-title"><i class="bi bi-cup-hot me-1"></i> Yemek</div><div class="sb-row"><span class="sb-lbl">Seçilen</span><span class="sb-val">' + (mealObj ? mealObj.name : "—") + "</span></div></div>" +
    '<div class="summary-block"><div class="sb-title"><i class="bi bi-bag-check me-1"></i> Ek Hizmetler</div>' +
    (extList.length > 0 ? extList.map(function (e) { return '<div class="sb-row"><span class="sb-lbl">' + e.name + '</span><span class="sb-val">' + (e.price > 0 ? e.price + " " + CURRENCY : "Ücretsiz") + "</span></div>"; }).join("") : '<div class="sb-empty">Seçilmedi</div>') +
    "</div>";
  document.getElementById("summaryGrid").innerHTML = html;
}

function completeCheckin() {
  if (!selectedSeat) { alert("Lütfen önce koltuk seçin (Adım 2)."); goTab(2); return; }
  var total = updatePrice();
  document.getElementById("modalSeat").textContent = selectedSeat;
  document.getElementById("modalTotal").textContent = total + " " + CURRENCY;
  generateBarcode();
  document.getElementById("ciModal").classList.add("open");
}

function generateBarcode() {
  var bars = document.getElementById("barcodeBars");
  if (!bars) return;
  var html = "";
  var widths = [2,1,3,1,2,4,1,2,1,3,2,1,4,1,2,1,3,2,1,4,2,1,3,1,2,4,1,2,3,1,2,1];
  var heights = [36,28,36,20,36,32,24,36,20,36,28,36,24,36,20,36,32,28,36,24,36,20,36,28,32,20,36,28,24,36,20,36];
  widths.forEach(function (w, i) { html += '<div class="bp-bar" style="width:' + w + "px;height:" + heights[i] + 'px;"></div>'; });
  bars.innerHTML = html;
}

function downloadTicket() { alert("Biniş kartı PDF formatında indirilecek. (Demo)"); }
function printTicket() { window.print(); }
function closeModal() { document.getElementById("ciModal").classList.remove("open"); }

document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("ciModal");
  if (modal) modal.addEventListener("click", function (e) { if (e.target === this) closeModal(); });
  buildSeatMap();
  buildMeals("all");
  buildExtras();
  updatePrice();
  var s = document.getElementById("holdKgSlider");
  if (s) s.style.setProperty("--val", "0%");
});
