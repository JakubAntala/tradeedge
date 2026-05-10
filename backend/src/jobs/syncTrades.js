/**
 * Scheduled task — runs the Notion → DB + snapshot sync.
 *
 * Two ways to run:
 *   1) One-shot from CLI:  `node backend/src/jobs/syncTrades.js`
 *   2) Cron:               schedule this via your host (Railway/Render/Fly cron, GitHub Actions, etc.)
 *
 * Recommended cadence: every 5–10 minutes. Notion API is quick and the DB upsert is idempotent.
 *
 * For true real-time you can later add a Notion webhook → calls /api/admin/sync.
 */

require('dotenv').config();
const { runSync } = require('../services/tradeSync.service');

(async () => {
  const start = Date.now();
  try {
    const r = await runSync({ writeSnapshot: true, useDb: true });
    console.log(`[sync] done in ${Date.now() - start}ms — count=${r.count}`);
    process.exit(0);
  } catch (e) {
    console.error('[sync] FAILED:', e);
    process.exit(1);
  }
})();
