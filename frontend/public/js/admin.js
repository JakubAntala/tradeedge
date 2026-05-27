/**
 * B.E.T.Trade - Admin mode
 *
 * DEV MODE (current): the site is pre-launch, so everything is free and
 * visible to everyone. This script unconditionally sets body.is-admin on
 * load, which activates all the "unlock" CSS overrides (sidebar locks,
 * lesson rows, locked-overlay, paywall-card on trades.html, etc.).
 *
 * When the backend paywall is wired (JWT + Stripe), restore the original
 * localStorage-gated behaviour and remove the unconditional unlock below.
 * The window.bet API is preserved for compatibility with pages/admin.html.
 */

(function () {
  'use strict';

  var KEY = 'bet.admin';

  // In dev mode, isAdmin() always reports true so admin.html shows the
  // "active" view instead of the passphrase prompt.
  function isAdmin() { return true; }

  function setAdmin(v) {
    try {
      if (v) localStorage.setItem(KEY, 'true');
      else   localStorage.removeItem(KEY);
    } catch (_) {}
    // No visual toggle - body keeps is-admin while dev mode is on.
  }

  // Always unlock the entire site for now.
  if (document.body) {
    document.body.classList.add('is-admin');
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('is-admin');
    });
  }

  // Expose the same API surface the rest of the site expects.
  window.bet = window.bet || {};
  window.bet.isAdmin = isAdmin;
  window.bet.setAdmin = setAdmin;
})();
