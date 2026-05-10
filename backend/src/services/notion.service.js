/**
 * Notion → TradeEdge sync service.
 *
 * Reads the Trading Journal data source, transforms records into our
 * trade_recaps shape, and STRIPS private fields (Emotions + "What did you
 * learn today?") at the source so they never reach our DB or API.
 *
 * Setup:
 *   1) Create an internal integration at https://www.notion.so/my-integrations
 *   2) Share the "Trading Journal" database with that integration
 *   3) Put the secret in NOTION_TOKEN
 *   4) Set NOTION_TRADES_DB_ID to the database id (UUID with dashes)
 *
 * Run periodically via backend/src/jobs/syncTrades.js (cron / scheduled task).
 */

const { Client } = require('@notionhq/client');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const TRADES_DB_ID = process.env.NOTION_TRADES_DB_ID;

const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

/* ---------- Property helpers (defensive — Notion shapes are permissive) ---------- */
const getTitle    = (p) => (p?.title?.[0]?.plain_text ?? '').trim();
const getRich     = (p) => (p?.rich_text?.map(t => t.plain_text).join('') ?? '').trim();
const getSelect   = (p) => p?.select?.name ?? null;
const getMulti    = (p) => (p?.multi_select ?? []).map(o => o.name);
const getNumber   = (p) => (typeof p?.number === 'number' ? p.number : null);
const getCheckbox = (p) => Boolean(p?.checkbox);
const getDate     = (p) => p?.date?.start ?? null;

/**
 * Transform a Notion page into our trade_recaps row.
 * Returns null if the row is missing critical fields (no Date).
 */
function mapNotionPageToTrade(page) {
  const props = page.properties || {};

  const trade_date = getDate(props['Date']);
  if (!trade_date) return null;

  const win = getCheckbox(props['Win']);
  const rr = getNumber(props['RR']);
  const potential_rr = getNumber(props['Potential RR']);

  // Find a chart image from the page's first image block (filled in by syncTrades job).
  // We only fetch blocks for the first 100 pages on each sync — see syncTrades.

  return {
    notion_page_id: page.id,
    name: getTitle(props['Name']),
    trade_date,
    dow: getSelect(props['DOW']),
    pair: getSelect(props['Pair']),
    session: getSelect(props['Session']),
    direction: getSelect(props['Direction']),
    bias: getSelect(props['Bias']),
    entry_time: getNumber(props['Entry Time']),
    duration_h: getNumber(props['Duration']),
    units: getNumber(props['Units']),
    rr: rr,
    potential_rr: potential_rr,
    win,
    news: getMulti(props['News']),
    narrative: getRich(props['Narrative']),
    notion_last_edited: page.last_edited_time,

    // Auto-feature: winning trades with RR >= 2 are featured on the public landing.
    // The user can override per-row in Notion later if we add a Featured checkbox.
    featured: Boolean(win && rr != null && rr >= 2),

    // PRIVATE — explicitly NOT mapped:
    //   Emotions
    //   What did you learn today?
  };
}

/**
 * Fetch the cover/first image from a Notion page (the chart screenshot).
 * Returns the (ephemeral) S3 URL or null. The sync job is responsible for
 * downloading + re-uploading to permanent storage.
 */
async function fetchPageImage(pageId) {
  if (!notion) return null;
  try {
    const blocks = await notion.blocks.children.list({ block_id: pageId, page_size: 20 });
    for (const b of blocks.results) {
      if (b.type === 'image') {
        const img = b.image;
        return img?.file?.url || img?.external?.url || null;
      }
    }
  } catch (e) {
    console.warn('[notion] fetchPageImage failed for', pageId, e.message);
  }
  return null;
}

/**
 * Fetch ALL trades from the Trading Journal database (paginated).
 * Returns an array of mapped trade rows (private fields already stripped).
 */
async function fetchAllTrades() {
  if (!notion) throw new Error('NOTION_TOKEN not set');
  if (!TRADES_DB_ID) throw new Error('NOTION_TRADES_DB_ID not set');

  const all = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: TRADES_DB_ID,
      page_size: 100,
      start_cursor: cursor,
      sorts: [{ property: 'Date', direction: 'descending' }],
    });
    for (const page of res.results) {
      const row = mapNotionPageToTrade(page);
      if (row) all.push(row);
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  return all;
}

module.exports = {
  fetchAllTrades,
  fetchPageImage,
  mapNotionPageToTrade,
  isConfigured: () => Boolean(notion && TRADES_DB_ID),
};
