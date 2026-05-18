/**
 * Calendar controller - serves filtered economic events.
 * Filtering is timezone-aware: ranges are computed in the requested timezone
 * (defaults to America/New_York since that's the trader's base TZ per Trading Plan).
 */

const { getEvents } = require('../services/forexCalendar.service');

function startOfDay(d, tz) {
  // Format date in target tz, then re-parse as midnight in that tz.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const ymd = fmt.format(d); // "2026-05-08"
  return new Date(ymd + 'T00:00:00');  // local interpretation; we only use ymd string for compare
}

function ymd(d, tz) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
}

function inRange(eventISO, range, tz, now = new Date()) {
  const eventDate = new Date(eventISO);
  if (Number.isNaN(eventDate.getTime())) return false;

  const todayYMD = ymd(now, tz);
  const eventYMD = ymd(eventDate, tz);

  // Day-based comparison (lex sort on YYYY-MM-DD works)
  function addDays(yy, n) {
    const d = new Date(yy + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  switch (range) {
    case 'today':     return eventYMD === todayYMD;
    case 'tomorrow':  return eventYMD === addDays(todayYMD, 1);
    case 'week':      return eventYMD >= todayYMD && eventYMD <= addDays(todayYMD, 6);
    case 'next-week': return eventYMD >= addDays(todayYMD, 7) && eventYMD <= addDays(todayYMD, 13);
    case 'month':     return eventYMD >= todayYMD && eventYMD <= addDays(todayYMD, 30);
    case 'all':
    default:          return true;
  }
}

exports.listEvents = async (req, res) => {
  const range  = String(req.query.range  || 'today');
  const impact = String(req.query.impact || '');     // "" | "high" | "medium-high" | "all"
  const tz     = String(req.query.tz     || 'America/New_York');

  try {
    const { events, cached, fetchedAt } = await getEvents();

    let filtered = events.filter(e => inRange(e.iso, range, tz));

    if (impact === 'high')         filtered = filtered.filter(e => e.impact === 'high');
    else if (impact === 'medium-high') filtered = filtered.filter(e => e.impact === 'high' || e.impact === 'medium');
    // 'all' or '' = no impact filter

    // Sort by event time ascending
    filtered.sort((a, b) => new Date(a.iso) - new Date(b.iso));

    res.json({
      range,
      impact: impact || 'all',
      tz,
      count: filtered.length,
      cached,
      fetchedAt,
      events: filtered,
    });
  } catch (e) {
    console.error('[calendar] listEvents failed:', e);
    res.status(502).json({ error: 'Calendar provider unavailable', message: e.message });
  }
};
