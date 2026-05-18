/* ============================================
   TradeEdge Academy - main.js
   ============================================ */

/* ---------- CUSTOM CURSOR ---------- */
(function () {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('button,input,a,.mod-card,.plan,.testi,.stat-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '22px';
      cursor.style.height = '22px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
    });
  });
})();

/* ---------- ANIMATED CANVAS BACKGROUND ---------- */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const dots = [];
  const COUNT = 90;
  for (let i = 0; i < COUNT; i++) {
    dots.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: Math.random() * 1.6 + .4,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      o: Math.random() * .5 + .25,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Moving dots (light blue)
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(14,165,233,${d.o})`;
      ctx.fill();
    });

    // Connections between close dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(14,165,233,${.18 * (1 - dist / 130)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- HERO CHART LINE ---------- */
(function () {
  const line = document.getElementById('chart-line');
  const area = document.getElementById('chart-area');
  if (!line) return;
  let t = 0;
  function tick() {
    t += .009;
    const pts = [];
    for (let i = 0; i <= 1440; i += 18) {
      const y = 100 + Math.sin(i * .003 + t) * 36
                    + Math.sin(i * .008 + t * 1.3) * 22
                    + Math.sin(i * .02 + t * .5) * 10;
      pts.push(i + ',' + y);
    }
    line.setAttribute('points', pts.join(' '));
    if (area) {
      area.setAttribute('points', '0,180 ' + pts.join(' ') + ' 1440,180');
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- FLOATING PARTICLES ---------- */
(function () {
  const cont = document.getElementById('particles');
  if (!cont) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const left = Math.random() * 100;
    const dur = Math.random() * 16 + 12;
    const delay = Math.random() * 16;
    const drift = (Math.random() - 0.5) * 220;
    p.style.cssText = `left:${left}%;--drift:${drift}px;animation-duration:${dur}s;animation-delay:${delay}s`;
    cont.appendChild(p);
  }
})();

/* ---------- NAV SCROLL ---------- */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
})();

/* ---------- SCROLL REVEAL ---------- */
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ---------- COUNTER ANIMATION ---------- */
(function () {
  const counters = document.querySelectorAll('[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(interval); }
        el.textContent = Math.round(cur) + suffix;
      }, 22);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => obs.observe(c));
})();

/* ---------- FEATURED TRADES (live from Notion sync) ---------- */
(async function () {
  const grid = document.getElementById('featured-trades');
  if (!grid) return;

  // Try API first (works once backend is deployed), fallback to static snapshot.
  async function loadTrades() {
    try {
      const r = await fetch('/api/trades/featured');
      if (r.ok) {
        const j = await r.json();
        if (j.trades?.length) return j.trades;
      }
    } catch (_) {}
    try {
      const r = await fetch('data/trades-snapshot.json');
      if (r.ok) {
        const j = await r.json();
        return (j.trades || []).filter(t => t.featured).slice(0, 6);
      }
    } catch (_) {}
    return [];
  }

  function fmtDate(d) {
    try {
      return new Date(d).toLocaleDateString('sk-SK', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (_) { return d || ''; }
  }
  function fmtTime(t) {
    if (typeof t !== 'number') return '';
    const h = Math.floor(t);
    const m = Math.round((t - h) * 100);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  function card(t) {
    const win = t.win ? 'win' : 'loss';
    const dir = (t.direction || '').toLowerCase();
    const rr = (t.rr ?? 0);
    const rrTxt = rr > 0 ? `${rr.toFixed(2)}R` : `${rr.toFixed(2)}R`;
    const news = (t.news || []).filter(n => n && n !== 'NONE').slice(0, 2);
    return `
      <div class="trade-card ${win}">
        <div class="trade-head">
          <div class="trade-pair">${t.pair || '-'}</div>
          <div class="trade-result ${win}">${t.win ? '✓ Win' : '× Loss'}</div>
        </div>
        <div class="trade-meta">
          <span class="trade-chip dir-${dir}">${t.direction || ''}</span>
          <span class="trade-chip session">${t.session || ''}</span>
          ${t.dow ? `<span class="trade-chip">${t.dow}</span>` : ''}
          ${news.map(n => `<span class="trade-chip">${n}</span>`).join('')}
        </div>
        <div class="trade-rr-row">
          <span class="trade-rr ${win}">${rrTxt}</span>
          <span class="trade-rr-label">RR</span>
          ${t.potential_rr && t.potential_rr !== rr ? `<span class="trade-rr-pot">/ ${t.potential_rr}R potential</span>` : ''}
        </div>
        <div class="trade-narr">${(t.narrative || '').slice(0, 280)}</div>
        <div class="trade-foot">
          <span>${fmtDate(t.trade_date || t.date)} · ${fmtTime(t.entry_time)} NY</span>
          <span>${t.units ? t.units + ' kontraktov' : ''}</span>
        </div>
      </div>`;
  }

  const trades = await loadTrades();
  if (!trades.length) {
    grid.innerHTML = `<div class="trades-footnote" style="grid-column:1/-1">
      Zatiaľ žiadne obchody v cache. Spusti <code>npm run sync:trades</code> v backende.
    </div>`;
    return;
  }
  grid.innerHTML = trades.slice(0, 6).map(card).join('');
})();

/* ---------- WAITLIST SIGNUP ---------- */
window.waitlistCount = 47;
window.signup = function (inputId, successId) {
  const input = document.getElementById(inputId);
  const success = document.getElementById(successId);
  const email = input.value.trim();

  if (!email || !email.includes('@') || !email.includes('.')) {
    input.style.borderColor = 'rgba(239,68,68,.5)';
    input.style.background = 'rgba(239,68,68,.04)';
    input.placeholder = 'Zadaj platný email...';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.background = '';
      input.placeholder = 'tvoj@email.sk';
    }, 2000);
    return;
  }

  // TODO: Replace with real backend POST /api/waitlist
  // fetch('/api/waitlist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email}) })

  window.waitlistCount++;
  const wlNum = document.getElementById('wl-num');
  const navNum = document.getElementById('nav-num');
  if (wlNum) wlNum.textContent = window.waitlistCount;
  if (navNum) navNum.textContent = window.waitlistCount;

  input.style.display = 'none';
  if (input.nextElementSibling && input.nextElementSibling.tagName === 'BUTTON') {
    input.nextElementSibling.style.display = 'none';
  }
  success.style.display = 'block';
  success.style.animation = 'countUp .5s ease both';
};
