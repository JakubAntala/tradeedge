/**
 * B.E.T.Trade - Admin mode (client-side, temporary)
 *
 * Sets a localStorage flag that unlocks all paywalled visuals on every page.
 * Enter via /pages/admin.html with the passphrase. Exit by clicking the
 * "ADMIN MODE" badge in the sidebar foot.
 *
 * This is purely a frontend convenience. Real auth comes later via the
 * backend (JWT + paywall middleware). When that's wired, this file goes.
 */

(function () {
  'use strict';

  var KEY = 'bet.admin';

  function isAdmin() {
    try { return localStorage.getItem(KEY) === 'true'; } catch (_) { return false; }
  }

  function setAdmin(v) {
    try {
      if (v) localStorage.setItem(KEY, 'true');
      else localStorage.removeItem(KEY);
    } catch (_) {}
    document.body.classList.toggle('is-admin', !!v);
  }

  // Apply immediately on script load (body element already exists by then)
  if (isAdmin()) document.body.classList.add('is-admin');

  // Expose simple API on window.bet
  window.bet = window.bet || {};
  window.bet.isAdmin = isAdmin;
  window.bet.setAdmin = setAdmin;

  // Inject the admin badge into the sidebar foot once the sidebar mounts.
  function injectBadge() {
    if (!isAdmin()) return;
    var foot = document.querySelector('.sb-foot');
    if (!foot) return false;
    if (foot.querySelector('.sb-admin-badge')) return true;

    var badge = document.createElement('div');
    badge.className = 'sb-admin-badge';
    badge.innerHTML =
      '<span class="sb-admin-dot"></span>' +
      '<span class="sb-admin-label">ADMIN MODE</span>' +
      '<a href="#" id="sb-admin-exit" title="Exit admin mode">exit</a>';
    foot.insertBefore(badge, foot.firstChild);

    var exitBtn = document.getElementById('sb-admin-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Exit admin mode? You will see the site as a regular visitor.')) {
          setAdmin(false);
          window.location.reload();
        }
      });
    }
    return true;
  }

  // Sidebar mounts on DOMContentLoaded; try a few times to be safe.
  function tryInject(retries) {
    if (injectBadge()) return;
    if (retries > 0) setTimeout(function () { tryInject(retries - 1); }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tryInject(8); });
  } else {
    tryInject(8);
  }
})();
