/**
 * Trades controller — featured (public), full list (paywalled), single recap, manual sync.
 *
 * Falls back to the static snapshot at /data/trades-snapshot.json when the DB
 * is empty/unavailable, so the landing page works even pre-deployment.
 */
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { runSync } = require('../services/tradeSync.service');

const SNAPSHOT_PATH = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'data', 'trades-snapshot.json');

function readSnapshot() {
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  } catch (_) {
    return null;
  }
}

exports.listFeatured = async (_req, res) => {
  try {
    const r = await db.query(
      `SELECT id, name, trade_date, dow, pair, session, direction, bias,
              entry_time, duration_h, units, rr, potential_rr, win,
              news, narrative, chart_image_url
         FROM trade_recaps
        WHERE featured = true AND win = true
        ORDER BY rr DESC NULLS LAST, trade_date DESC
        LIMIT 6`
    );
    if (r.rows.length) return res.json({ trades: r.rows, source: 'db' });
  } catch (e) {
    console.warn('[trades] DB unavailable, falling back to snapshot:', e.message);
  }
  const snap = readSnapshot();
  res.json({ trades: snap?.trades ?? [], source: 'snapshot' });
};

exports.getStats = async (_req, res) => {
  try {
    const r = await db.query(
      `SELECT
         COUNT(*)::int AS total_trades,
         COUNT(*) FILTER (WHERE win)::int AS wins,
         COUNT(*) FILTER (WHERE NOT win)::int AS losses,
         ROUND(AVG(rr) FILTER (WHERE win)::numeric, 2) AS avg_rr_winners,
         MAX(rr) FILTER (WHERE win) AS best_rr,
         (SELECT pair FROM trade_recaps GROUP BY pair ORDER BY COUNT(*) DESC LIMIT 1) AS most_traded_pair
       FROM trade_recaps`
    );
    if (r.rows[0]?.total_trades) return res.json({ stats: r.rows[0], source: 'db' });
  } catch (e) {
    console.warn('[trades] stats fallback:', e.message);
  }
  const snap = readSnapshot();
  res.json({ stats: snap?.stats ?? {}, source: 'snapshot' });
};

exports.listAll = async (req, res) => {
  const { pair, session, win, limit = 100, offset = 0 } = req.query;
  const where = [];
  const params = [];
  if (pair)    { params.push(pair);    where.push(`pair = $${params.length}`); }
  if (session) { params.push(session); where.push(`session = $${params.length}`); }
  if (win === 'true' || win === 'false') {
    params.push(win === 'true');
    where.push(`win = $${params.length}`);
  }
  const sql = `
    SELECT id, name, trade_date, dow, pair, session, direction, bias,
           entry_time, duration_h, units, rr, potential_rr, win,
           news, narrative, chart_image_url
      FROM trade_recaps
     ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY trade_date DESC, entry_time DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(Math.min(+limit, 200), +offset);

  try {
    const r = await db.query(sql, params);
    res.json({ trades: r.rows, count: r.rows.length });
  } catch (e) {
    console.error('[trades] listAll failed:', e.message);
    res.status(500).json({ error: 'DB unavailable' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const r = await db.query(
      `SELECT * FROM trade_recaps WHERE id = $1 OR notion_page_id = $1`,
      [req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    // Just to be safe — never expose private fields even if a future migration adds them.
    const trade = r.rows[0];
    delete trade.emotions;
    delete trade.learn;
    res.json({ trade });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.triggerSync = async (_req, res) => {
  // TODO: gate by req.user.role === 'admin'
  try {
    const r = await runSync({ writeSnapshot: true, useDb: true });
    res.json({ ok: true, ...r });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};
