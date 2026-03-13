    (function () {
      // TAB SWITCHING
      document.querySelectorAll('.bk-tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          document.querySelectorAll('.bk-tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.bk-pane').forEach(p => p.classList.remove('active'));
          this.classList.add('active');
          document.getElementById('pane-' + this.dataset.tab).classList.add('active');
        });
      });

      // TRIP TYPE
      window.setTripType = function (btn, type) {
        document.querySelectorAll('.trip-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        var retField = document.getElementById('retDateField');
        if (type === 'oneway') retField.classList.add('disabled');
        else retField.classList.remove('disabled');
      };

      // SWAP
      window.swapAirports = function () {
        var from = document.getElementById('fromAirport');
        var to = document.getElementById('toAirport');
        var tmp = from.value; from.value = to.value; to.value = tmp;
      };

      // PAX
      var paxData = { adult: 1, child: 0, infant: 0, cabin: 'Ekonomi' };
      window.togglePax = function () {
        document.getElementById('paxTrigger').classList.toggle('open');
      };
      window.closePax = function () {
        document.getElementById('paxTrigger').classList.remove('open');
      };
      window.changePax = function (type, delta) {
        paxData[type] = Math.max(0, paxData[type] + delta);
        if (type === 'adult') paxData[type] = Math.max(1, paxData[type]);
        document.getElementById(type + 'Count').textContent = paxData[type];
        updatePaxSummary();
      };
      window.selectCabin = function (btn, cabin) {
        document.querySelectorAll('.cabin-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        paxData.cabin = cabin;
        updatePaxSummary();
      };
      function updatePaxSummary() {
        var total = paxData.adult + paxData.child + paxData.infant;
        var label = total + ' Yolcu — ' + paxData.cabin;
        document.getElementById('paxSummary').textContent = label;
      }
      document.addEventListener('click', function (e) {
        var trigger = document.getElementById('paxTrigger');
        if (trigger && !trigger.contains(e.target)) trigger.classList.remove('open');
      });

      // PROMO
      window.togglePromo = function (link) {
        var wrap = document.getElementById('promoInputWrap');
        wrap.classList.toggle('open');
        if (wrap.classList.contains('open')) {
          wrap.querySelector('input').focus();
          link.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg> Kodu Kaldır';
        } else {
          link.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Promosyon Kodu Kullan';
        }
      };

      // QUERY METHOD (trips / checkin)
      window.setQueryMethod = function (prefix, method, btn) {
        var row = btn.closest('.query-method-row');
        row.querySelectorAll('.query-method-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('[id^="' + prefix + '-"]').forEach(el => el.classList.remove('active'));
        var target = document.getElementById(prefix + '-' + method);
        if (target) target.classList.add('active');
      };

      // FLIGHT STATUS METHOD
      window.setFsMethod = function (method, btn) {
        document.querySelectorAll('.fs-method-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('[id^="fs-"]').forEach(el => el.classList.remove('active'));
        document.getElementById('fs-' + method).classList.add('active');
      };
    })();
