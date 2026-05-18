/**
 * Upserts Notion trades into our trade_recaps table.
 * Also writes a JSON snapshot to frontend/public/data so the static landing
 * page works even before the API is deployed.
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const notion = require('./notion.service');

const SNAPSHOT_PATH = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'data', 'trades-snapshot.json');

async function syncToDb(rows) {
  let inserted = 0, updated = 0;
  for (const r of rows) {
    const result = await db.query(
      `INSERT INTO trade_recaps (
         notion_page_id, name, trade_date, dow, pair, session,
         direction, bias, entry_time, duration_h, units,
         rr, potential_rr, win, news, narrative,
         featured, notion_last_edited
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,$17,$18)
       ON CONFLICT (notion_page_id) DO UPDATE SET
         name=EXCLUDED.name, trade_date=EXCLUDED.trade_date, dow=EXCLUDED.dow,
         pair=EXCLUDED.pair, session=EXCLUDED.session, direction=EXCLUDED.direction,
         bias=EXCLUDED.bias, entry_time=EXCLUDED.entry_time, duration_h=EXCLUDED.duration_h,
         units=EXCLUDED.units, rr=EXCLUDED.rr, potential_rr=EXCLUDED.potential_rr,
         win=EXCLUDED.win, news=EXCLUDED.news, narrative=EXCLUDED.narrative,
         featured=EXCLUDED.featured, notion_last_edited=EXCLUDED.notion_last_edited,
         synced_at=now()
       RETURNING (xmax = 0) AS inserted`,
      [
        r.notion_page_id, r.name, r.trade_date, r.dow, r.pair, r.session,
        r.direction, r.bias, r.entry_time, r.duration_h, r.units,
        r.rr, r.potential_rr, r.win, JSON.stringify(r.news || []), r.narrative,
        r.featured, r.notion_last_edited,
      ]
    );
    if (result.rows[0]?.inserted) inserted++; else updated++;
  }
  return { inserted, updated };
}

function writeStaticSnapshot(rows) {
  const wins = rows.filter(t => t.win);
  const losses = rows.filter(t => !t.win);
  const winnerRRs = wins.map(t => t.rr).filter(n => typeof n === 'number');
  const avgRR = winnerRRs.length
    ? Number((winnerRRs.reduce((a, b) => a + b, 0) / winnerRRs.length).toFixed(2))
    : null;

  // Pair counts
  const pairCounts = {};
  for (const t of rows) {
    if (t.pair) pairCounts[t.pair] = (pairCounts[t.pair] || 0) + 1;
  }
  const mostTradedPair = Object.entries(pairCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const featured = rows
    .filter(t => t.featured)
    .sort((a, b) => (b.rr ?? 0) - (a.rr ?? 0))
    .slice(0, 6);

  const snapshot = {
    _meta: {
      source: 'notion',
      synced_at: new Date().toISOString(),
      private_fields_stripped: ['Emotions', 'What did you learn today?'],
    },
    stats: {
      total_trades: rows.length,
      wins: wins.length,
      losses: losses.length,
      win_rate: rows.length ? Number((wins.length / rows.length).toFixed(3)) : 0,
      avg_rr_winners: avgRR,
      best_rr: winnerRRs.length ? Math.max(...winnerRRs) : null,
      most_traded_pair: mostTradedPair,
    },
    trades: featured,    // public preview only - full list lives behind API + paywall
  };

  fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
}

async function runSync({ writeSnapshot = true, useDb = true } = {}) {
  if (!notion.isConfigured()) {
    throw new Error('Notion not configured (NOTION_TOKEN / NOTION_TRADES_DB_ID missing)');
  }

  console.log('[sync] fetching from Notion…');
  const rows = await notion.fetchAllTrades();
  console.log(`[sync] got ${rows.length} trades`);

  let dbResult = null;
  if (useDb) {
    try {
      dbResult = await syncToDb(rows);
      console.log(`[sync] DB upsert - inserted=${dbResult.inserted}, updated=${dbResult.updated}`);
    } catch (e) {
      console.warn('[sync] DB upsert skipped:', e.message);
    }
  }

  if (writeSnapshot) {
    writeStaticSnapshot(rows);
    console.log(`[sync] snapshot written → ${SNAPSHOT_PATH}`);
  }

  return { count: rows.length, db: dbResult };
}

module.exports = { runSync };
