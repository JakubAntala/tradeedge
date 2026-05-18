/**
 * Forex Factory economic calendar - server-side fetch + cache.
 *
 * Public endpoints (free, no auth):
 *   https://nfs.faireconomy.media/ff_calendar_thisweek.json
 *   https://nfs.faireconomy.media/ff_calendar_nextweek.json
 *
 * Each item shape (from FF):
 *   {
 *     "title": "Federal Funds Rate",
 *     "country": "USD",
 *     "date": "2026-05-08T14:00:00-04:00",  // ISO with ET offset
 *     "impact": "High" | "Medium" | "Low" | "Holiday",
 *     "forecast": "5.50%",
 *     "previous": "5.50%"
 *   }
 *
 * We cache the raw JSON for ~30 minutes; the controller filters by date and impact.
 */

const CACHE_TTL_MS = 30 * 60 * 1000;
const URLS = {
  thisweek: 'https://nfs.faireconomy.media/ff_calendar_thisweek.json',
  nextweek: 'https://nfs.faireconomy.media/ff_calendar_nextweek.json',
};

let cache = { data: null, fetchedAt: 0 };

async function fetchOne(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'B.E.T.Trade/0.1 (calendar-sync)' },
  });
  if (!r.ok) throw new Error(`FF ${url} → ${r.status}`);
  return r.json();
}

async function fetchAllRaw() {
  const [thisweek, nextweek] = await Promise.allSettled([
    fetchOne(URLS.thisweek),
    fetchOne(URLS.nextweek),
  ]);
  const events = [];
  if (thisweek.status === 'fulfilled' && Array.isArray(thisweek.value)) events.push(...thisweek.value);
  if (nextweek.status === 'fulfilled' && Array.isArray(nextweek.value)) events.push(...nextweek.value);
  return events;
}

function normalize(e) {
  // Some weeks the impact comes lowercase, some come "Holiday" - flatten:
  const impact = String(e.impact || '').toLowerCase();
  const impactRank = impact === 'high' ? 3
                  : impact === 'medium' ? 2
                  : impact === 'low' ? 1
                  : 0; // holiday / unknown
  const iso = e.date || e.datetime || null;
  return {
    title: e.title || e.event || '-',
    country: e.country || '',
    impact,
    impactRank,
    iso,                 // ISO 8601 with timezone offset
    forecast: e.forecast || '',
    previous: e.previous || '',
    actual: e.actual || '',
  };
}

async function getEvents() {
  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { events: cache.data, cached: true, fetchedAt: cache.fetchedAt };
  }
  const raw = await fetchAllRaw();
  const events = raw.map(normalize).filter(e => e.iso);
  cache = { data: events, fetchedAt: now };
  return { events, cached: false, fetchedAt: now };
}

function clearCache() { cache = { data: null, fetchedAt: 0 }; }

module.exports = { getEvents, clearCache };
