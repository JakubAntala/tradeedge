/**
 * B.E.T.Trade - Per-lesson "Own notes" notepad.
 *
 * Looks for #own-notes-area on the page. Loads saved notes from localStorage,
 * autosaves on input (debounced), shows a status indicator, and supports
 * "Clear" reset. Each lesson gets its own scoped key based on the URL filename.
 *
 * Real cloud sync arrives later via the backend (auth + user.notes table).
 */

(function () {
  'use strict';

  var area = document.getElementById('own-notes-area');
  if (!area) return;

  var statusEl = document.getElementById('own-notes-status');
  var clearBtn = document.getElementById('own-notes-clear');

  // Derive a scoped key from the current page filename.
  var path = window.location.pathname.toLowerCase();
  var fileName = path.split('/').pop().replace('.html', '') || 'index';
  var STORAGE_KEY = 'bet.notes.' + fileName;

  // Load saved content
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) area.value = saved;
  } catch (_) {}

  var lastSaved = area.value;
  var saveTimer = null;

  function setStatus(text, color) {
    if (!statusEl) return;
    statusEl.textContent = text || '';
    statusEl.style.color = color || '';
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, area.value);
      lastSaved = area.value;
      setStatus('Saved', 'var(--green-l)');
      setTimeout(function () { setStatus(''); }, 1500);
    } catch (e) {
      setStatus('Could not save', '#FCA5A5');
    }
  }

  area.addEventListener('input', function () {
    setStatus('Typing…', 'var(--muted-2)');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 600);
  });

  // Save on blur if dirty
  area.addEventListener('blur', function () {
    if (area.value !== lastSaved) save();
  });

  // Save before tab/window closes
  window.addEventListener('beforeunload', function () {
    if (area.value !== lastSaved) {
      try { localStorage.setItem(STORAGE_KEY, area.value); } catch (_) {}
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (!area.value) return;
      if (confirm('Clear all notes for this lesson?')) {
        area.value = '';
        lastSaved = '';
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
        setStatus('Cleared', 'var(--muted-2)');
        setTimeout(function () { setStatus(''); }, 1500);
        area.focus();
      }
    });
  }
})();
