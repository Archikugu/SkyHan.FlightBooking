/* ────────────────────────────────────────────────
   FLIGHT STATUS DATA & RENDERER (Localized to Turkish)
   ──────────────────────────────────────────────── */
const AIRLINES = [
  { name:'Türk Hava Yolları',  code:'TK', color:'#C70000', bg:'rgba(199,0,0,.15)' },
  { name:'Lufthansa',        code:'LH', color:'#05164d', bg:'rgba(5,22,77,.2)'  },
  { name:'British Airways',  code:'BA', color:'#2b5eac', bg:'rgba(43,94,172,.15)' },
  { name:'Emirates',         code:'EK', color:'#c09c2d', bg:'rgba(192,156,45,.15)' },
  { name:'Air France',       code:'AF', color:'#0066cc', bg:'rgba(0,102,204,.15)' },
  { name:'Qatar Airways',    code:'QR', color:'#5c0632', bg:'rgba(92,6,50,.25)'  },
  { name:'KLM',              code:'KL', color:'#00a1de', bg:'rgba(0,161,222,.15)' },
  { name:'Swiss Air',        code:'LX', color:'#e2001a', bg:'rgba(226,0,26,.15)' },
  { name:'Pegasus',          code:'PC', color:'#ff6600', bg:'rgba(255,102,0,.15)' },
  { name:'SunExpress',       code:'XQ', color:'#f5a623', bg:'rgba(245,166,35,.15)' },
];

const AIRPORTS = [
  { iata:'IST', city:'İstanbul' },
  { iata:'LHR', city:'Londra'   },
  { iata:'CDG', city:'Paris'    },
  { iata:'FRA', city:'Frankfurt'},
  { iata:'AMS', city:'Amsterdam'},
  { iata:'DXB', city:'Dubai'    },
  { iata:'DOH', city:'Doha'     },
  { iata:'MUC', city:'Münih'   },
  { iata:'MAD', city:'Madrid'   },
  { iata:'FCO', city:'Roma'     },
  { iata:'ZRH', city:'Zürih'   },
  { iata:'BCN', city:'Barselona'},
  { iata:'JFK', city:'New York' },
  { iata:'DUS', city:'Düsseldorf'},
];

const STATUSES = [
  { label:'Check-in Açık',  cls:'s-blue',   icon:'bi-ticket-perforated-fill' },  // 0
  { label:'Bankoya Gidin',  cls:'s-blue',   icon:'bi-person-lines-fill'      },  // 1
  { label:'Kapıya Gidin',   cls:'s-purple', icon:'bi-signpost-fill'           }, // 2
  { label:'Biniş / Boarding', cls:'s-orange', icon:'bi-door-open-fill'          }, // 3
  { label:'Son Çağrı',      cls:'s-orange', icon:'bi-megaphone-fill'          },  // 4
  { label:'Kapı Kapandı',   cls:'s-gray',   icon:'bi-door-closed-fill'        },  // 5
  { label:'Kalktı',         cls:'s-green',  icon:'bi-airplane-fill'           }, // 6
  { label:'İndi',           cls:'s-green',  icon:'bi-geo-alt-fill'            }, // 7
  { label:'Gecikmeli',      cls:'s-yellow', icon:'bi-clock-history'           }, // 8
  { label:'İptal Edildi',   cls:'s-red',    icon:'bi-x-circle-fill'           }, // 9
];

const DEP_STATUSES  = [0,1,2,3,4,5,6,8,9,2]; // indices into STATUSES for departures
const ARR_STATUSES  = [7,7,8,9,6,2,7,8,3,7]; // indices for arrivals

function pad(n){ return String(n).padStart(2,'0'); }

function makeTime(offsetMin){
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMin);
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

const OFFSETS_DEP = [-45,-30,-15,5,20,35,50,65,80,95];
const OFFSETS_ARR = [-60,-40,-20,-5,10,30,45,60,75,90];

function buildFlights(isArrival){
  const offsets = isArrival ? OFFSETS_ARR : OFFSETS_DEP;
  const statusIdx = isArrival ? ARR_STATUSES : DEP_STATUSES;
  const origin = { iata:'IST', city:'İstanbul' };

  return AIRLINES.map((al, i) => {
    const remote = AIRPORTS[i + (isArrival ? 0 : 1)];
    const from   = isArrival ? remote : origin;
    const to     = isArrival ? origin : remote;
    const fnum   = al.code + String(100 + i * 37).padStart(3,'0');
    const time   = makeTime(offsets[i]);
    const gate   = ['A','B','C','D'][i % 4] + (10 + i * 3);
    const term   = 'T' + ((i % 3) + 1);
    const status = STATUSES[statusIdx[i]];
    return { al, fnum, from, to, time, gate, term, status };
  });
}

function renderRow(f){
  return `
  <div class="fsd-flight-row">
    <div class="fsd-cell">
      <div class="fsd-airline">
        <div class="fsd-airline-icon" style="background:${f.al.bg};color:${f.al.color};">
          ${f.al.code}
        </div>
        <div>
          <div class="fsd-airline-name">${f.al.name}</div>
        </div>
      </div>
    </div>
    <div class="fsd-cell">
      <span class="fsd-fnum">${f.fnum}</span>
    </div>
    <div class="fsd-cell">
      <div class="fsd-route">
        <div>
          <div class="fsd-iata">${f.from.iata}</div>
          <div class="fsd-city">${f.from.city}</div>
        </div>
      </div>
    </div>
    <div class="fsd-cell">
      <div class="fsd-route">
        <i class="bi bi-arrow-right fsd-route-arrow"></i>
        <div>
          <div class="fsd-iata">${f.to.iata}</div>
          <div class="fsd-city">${f.to.city}</div>
        </div>
      </div>
    </div>
    <div class="fsd-cell">
      <span class="fsd-time">${f.time}</span>
    </div>
    <div class="fsd-cell">
      <span class="fsd-gate-num">${f.gate}</span>
    </div>
    <div class="fsd-cell">
      <span class="fsd-gate">${f.term}</span>
    </div>
    <div class="fsd-cell">
      <span class="fsd-status ${f.status.cls}">
        <i class="bi ${f.status.icon}"></i>
        ${f.status.label}
      </span>
    </div>
  </div>`;
}

function buildStats(flights){
  const total     = flights.length;
  const delayed   = flights.filter(f => f.status.label === 'Gecikmeli').length;
  const cancelled = flights.filter(f => f.status.label === 'İptal Edildi').length;
  const onTime    = total - delayed - cancelled;

  return `
    <div class="fsd-stat"><span class="fsd-stat-dot" style="background:var(--s-blue)"></span>${total} Planlanan Uçuş</div>
    <div class="fsd-stat"><span class="fsd-stat-dot" style="background:var(--s-green)"></span>${onTime} Zamanında</div>
    <div class="fsd-stat"><span class="fsd-stat-dot" style="background:var(--s-yellow)"></span>${delayed} Gecikmeli</div>
    <div class="fsd-stat"><span class="fsd-stat-dot" style="background:var(--s-red)"></span>${cancelled} İptal Edildi</div>
  `;
}

function buildTicker(deps, arrs){
  const items = [
    ...deps.filter(f=>f.status.label==='Biniş / Boarding').map(f=>`<span class="fsd-ticker-item">🛫 <span>${f.fnum}</span> ${f.to.iata} uçuşu — Şu An Binişte Kapı ${f.gate}</span>`),
    ...arrs.filter(f=>f.status.label==='İndi').map(f=>`<span class="fsd-ticker-item">🛬 <span>${f.fnum}</span> ${f.from.iata} uçuşu — İndi</span>`),
    ...deps.filter(f=>f.status.label==='Son Çağrı').map(f=>`<span class="fsd-ticker-item">🚨 Son Çağrı: <span>${f.fnum}</span> ${f.to.iata} uçuşu — Kapı ${f.gate}</span>`),
    ...deps.filter(f=>f.status.label==='Gecikmeli').map(f=>`<span class="fsd-ticker-item">⚠️ <span>${f.fnum}</span> ${f.to.iata} uçuşu — Gecikmeli</span>`),
    ...arrs.filter(f=>f.status.label==='Gecikmeli').map(f=>`<span class="fsd-ticker-item">⚠️ <span>${f.fnum}</span> ${f.from.iata} uçuşu — Gecikmeli</span>`),
  ];
  // duplicate for seamless loop
  const all = [...items, ...items];
  return all.join('');
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  const deps = buildFlights(false);
  const arrs = buildFlights(true);

  document.getElementById('departures-list').innerHTML = deps.map(renderRow).join('');
  document.getElementById('arrivals-list').innerHTML   = arrs.map(renderRow).join('');
  document.getElementById('fsd-stats-bar').innerHTML   = buildStats(deps);
  document.getElementById('fsd-ticker').innerHTML      = buildTicker(deps, arrs);

  /* Tab switching */
  document.querySelectorAll('.fsd-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fsd-tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected','false');
      });
      document.querySelectorAll('.fsd-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');

      const target = btn.dataset.tab;
      document.getElementById('pane-' + target).classList.add('active');

      /* Update stats for the active tab */
      const flights = target === 'departures' ? deps : arrs;
      document.getElementById('fsd-stats-bar').innerHTML = buildStats(flights);
    });
  });
});
