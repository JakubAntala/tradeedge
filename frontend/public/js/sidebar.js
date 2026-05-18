/**
 * B.E.T.Trade - left sidebar navigation (Notion-style)
 *
 * Usage on any page:
 *   <div id="sidebar-mount"></div>
 *   <script src="js/sidebar.js"></script>     (landing)
 *   <script src="../js/sidebar.js"></script>  (subpages in /pages/)
 */

(function () {
  'use strict';

  var SIDEBAR_OPEN_KEY = 'bet.sidebar.open';
  var path = window.location.pathname.toLowerCase();
  var isSubpage = path.indexOf('/pages/') !== -1;
  var prefix = isSubpage ? '' : 'pages/';
  var homePrefix = isSubpage ? '../' : '';

  /* Inline SVG icons (24x24 viewBox, currentColor) */
  var ICON = {
    home:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M9 21v-6h6v6"/></svg>',
    book:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z"/><path d="M4 17a3 3 0 0 1 3-3h11"/></svg>',
    list:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>',
    chart:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 9 11l4 4 7-8"/><path d="M14 7h6v6"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>',
    chat:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 1 1-3.5-6.6"/><path d="M21 4v5h-5"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>',
    mic:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
    spark:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6 8.5 8.5"/><path d="M15.5 15.5l2.9 2.9"/><path d="M5.6 18.4 8.5 15.5"/><path d="M15.5 8.5l2.9-2.9"/></svg>',
    lock:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    globe:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    bars:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V9"/><path d="M12 21V4"/><path d="M19 21v-8"/><path d="M3 21h18"/></svg>',
    coin:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 8h5a3 3 0 0 1 0 5H9V8z"/><path d="M9 13h6a3 3 0 0 1 0 5H9v-5z"/></svg>',
  };

  var GROUPS = [
    {
      title: 'Hlavné',
      items: [
        { href: homePrefix + 'index.html',     label: 'Domov',         icon: ICON.home,     match: ['index.html', '/'] },
        { href: prefix + 'courses.html',       label: 'Kurzy',         icon: ICON.book,     match: ['courses.html'] },
        { href: prefix + 'trading-plan.html',  label: 'Trading Plan',  icon: ICON.list,     match: ['trading-plan.html'], indent: true },
        { href: prefix + 'forex.html',         label: 'Forex',         icon: ICON.globe,    match: ['forex.html'],        indent: true },
        { href: prefix + 'futures.html',       label: 'Futures',       icon: ICON.bars,     match: ['futures.html'],      indent: true },
        { href: prefix + 'crypto.html',        label: 'Crypto',        icon: ICON.coin,     match: ['crypto.html'],       indent: true },
        { href: prefix + 'trades.html',        label: 'Trade Recaps',  icon: ICON.chart,    match: ['trades.html'] },
        { href: prefix + 'calendar.html',      label: 'Kalendár',      icon: ICON.calendar, match: ['calendar.html'] },
      ],
    },
    {
      title: 'Komunita',
      items: [
        { href: '#', label: 'Discord',  icon: ICON.chat, locked: true },
        { href: '#', label: 'Live Q&amp;A', icon: ICON.mic, locked: true },
      ],
    },
    {
      title: 'Účet',
      items: [
        { href: '#', label: 'Pridaj sa', icon: ICON.spark, accent: true, action: 'cta' },
      ],
    },
  ];

  function isActive(item) {
    var m = item.match || [];
    for (var i = 0; i < m.length; i++) {
      var x = m[i];
      if (x === '/') {
        if (path === '/' || path.slice(-11) === '/index.html') return true;
      } else {
        if (path.slice(-x.length) === x) return true;
      }
    }
    return false;
  }

  function renderItem(item) {
    var classes = 'sb-item';
    if (isActive(item))   classes += ' active';
    if (item.indent)      classes += ' indent';
    if (item.locked)      classes += ' locked';
    if (item.accent)      classes += ' accent';
    var attrAction = item.action ? ' data-action="' + item.action + '"' : '';
    var lockHTML = item.locked ? '<span class="sb-lock">' + ICON.lock + '</span>' : '';
    return '<a class="' + classes + '" href="' + item.href + '"' + attrAction + '>' +
             '<span class="sb-icon">' + item.icon + '</span>' +
             '<span class="sb-label">' + item.label + '</span>' +
             lockHTML +
           '</a>';
  }

  function renderGroups() {
    var out = '';
    for (var i = 0; i < GROUPS.length; i++) {
      var g = GROUPS[i];
      var inner = '';
      for (var j = 0; j < g.items.length; j++) inner += renderItem(g.items[j]);
      out += '<div class="sb-group"><div class="sb-group-title">' + g.title + '</div>' + inner + '</div>';
    }
    return out;
  }

  function buildHTML() {
    var year = new Date().getFullYear();
    return [
      '<aside class="sidebar" id="sidebar">',
        '<div class="sb-head">',
          '<a class="sb-logo" href="' + homePrefix + 'index.html">',
            '<span class="sb-logo-dot"></span>',
            'B.E.T.<span>Trade</span>',
          '</a>',
          '<button class="sb-close" aria-label="Zavrieť" id="sb-close">',
            '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
          '</button>',
        '</div>',
        '<div class="sb-body" role="navigation">' + renderGroups() + '</div>',
        '<div class="sb-foot">',
          '<div class="sb-stat"><span class="sb-dot"></span><span><span id="sb-online-num">47</span> ľudí v rade</span></div>',
          '<div class="sb-version">v0.1 · ' + year + '</div>',
        '</div>',
      '</aside>',
      '<div class="sb-overlay" id="sb-overlay"></div>',
    ].join('');
  }

  function mount() {
    var slot = document.getElementById('sidebar-mount');
    if (!slot) {
      console.warn('[sidebar] No #sidebar-mount element found on page.');
      return;
    }

    try {
      slot.innerHTML = buildHTML();
    } catch (e) {
      console.error('[sidebar] Failed to render:', e);
      return;
    }

    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sb-overlay');
    var closeBtn = document.getElementById('sb-close');

    function isMobile() { return window.matchMedia('(max-width: 900px)').matches; }

    var stored = localStorage.getItem(SIDEBAR_OPEN_KEY);
    var opened = stored == null ? true : (stored === 'true');
    if (isMobile()) opened = false;

    function setOpen(v) {
      opened = v;
      document.body.classList.toggle('sb-open', v);
      sidebar.classList.toggle('open', v);
      overlay.classList.toggle('show', v && isMobile());
      if (!isMobile()) localStorage.setItem(SIDEBAR_OPEN_KEY, String(v));
    }

    setOpen(opened);

    var toggles = document.querySelectorAll('#sb-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function () { setOpen(!opened); });
    }
    closeBtn.addEventListener('click', function () { setOpen(false); });
    overlay.addEventListener('click', function () { setOpen(false); });

    sidebar.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('.sb-item');
      if (!link) return;
      if (link.dataset.action === 'cta') {
        e.preventDefault();
        var target = document.getElementById('cta-email') || document.getElementById('hero-email');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.focus();
        } else {
          window.location.href = homePrefix + 'index.html#cta-email';
        }
      }
      if (isMobile()) setOpen(false);
    });

    var lastMobile = isMobile();
    window.addEventListener('resize', function () {
      var nowMobile = isMobile();
      if (nowMobile !== lastMobile) {
        lastMobile = nowMobile;
        var s = localStorage.getItem(SIDEBAR_OPEN_KEY);
        var stillOpen = s == null ? true : (s === 'true');
        setOpen(nowMobile ? false : stillOpen);
      }
    });

    console.log('[sidebar] mounted (' + GROUPS.reduce(function (n, g) { return n + g.items.length; }, 0) + ' items)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
