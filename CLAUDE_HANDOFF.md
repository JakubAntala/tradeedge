# B.E.T.Trade - Claude Handoff Context

> Paste this whole file into a new chat on another PC to continue the project exactly where we left off.
> The project root folder is `tradeedge` (B.E.T.Trade), originally called "TradeEdge Academy".

---

## How to use this file (instructions to Claude)

When the user pastes this file into a new chat:

1. Read this entire document - it contains the full project state, conventions, and pending tasks.
2. Confirm the working folder. Default working folder for ALL file edits is the local clone of this repo. On Jakub's main PC it lives at `C:\Users\jakub\Documents\GitHub\tradeedge`. On a new PC, ask Jakub for the new absolute path the first time, then use it for the rest of the session.
3. Do NOT use bash `sed -i` on Windows-mounted files - it has corrupted JS files (null bytes appended) and truncated HTML files in this project before. Use the `Edit` / `Write` tools instead.
4. Respect the privacy rule: the Notion fields **"Emotions"** and **"What did you learn today?"** must NEVER be exposed in any frontend, API response, JSON snapshot, or log. They are mapped out at the service layer.
5. Use regular hyphens `-` instead of em-dashes `—` everywhere (Jakub asked us to replace them site-wide).
6. Brand name is always written `B.E.T.Trade` (dots, capitals, no space).
7. Site language is English. Brand terms (`B.E.T.Trade`) and trading jargon (pip, lot, RR, SL, BSL, SSL, MSS, etc.) stay as-is.

---

## 1. Project: B.E.T.Trade

A paywalled trading academy platform built by Jakub Antala.

- GitHub: https://github.com/JakubAntala/tradeedge
- Local clone: `C:\Users\jakub\Documents\GitHub\tradeedge`
- Status: Work in Progress (frontend mostly built, backend scaffolded, no auth/Stripe yet)
- Stack: vanilla HTML/CSS/JS frontend, Node.js 18+/Express 4 backend, Postgres, Notion API sync, Stripe planned
- Theme: dark (black dominant, deep blue accents, white sparingly)
- Style reference: BlueEyes Trader visual language, Notion-style left sidebar

---

## 2. Folder structure

```
tradeedge/
  README.md                       (English, MIT, no emojis)
  CLAUDE_HANDOFF.md               (this file)
  frontend/
    public/
      index.html                  (landing - hero, courses, featured trades, mentoring, CTA)
      css/style.css               (single global stylesheet, dark theme, asset accents)
      js/
        main.js                   (bg canvas, hero chart, particles, nav scroll, reveal, counters, featured trades fetch, waitlist)
        sidebar.js                (Notion-style left sidebar - mounts into #sidebar-mount)
        admin.js                  (localStorage 'bet.admin' flag, body.is-admin class, window.bet.setAdmin())
        notes.js                  (per-lesson Own Notes notepad, localStorage scoped by filename)
      data/
        trades-snapshot.json      (8 trades, English narratives, Emotions/Learn fields ABSENT)
      pages/
        courses.html              (3 asset cards: Forex, Futures, Crypto)
        forex.html                (Forex hub - links to 4 basics lessons)
        forex-pip-value.html      (lesson 1)
        forex-lot-sizing.html     (lesson 2)
        forex-leverage.html       (lesson 3)
        forex-spread.html         (lesson 4)
        futures.html
        crypto.html
        trading-plan.html
        trades.html               (full paywalled trades feed)
        calendar.html             (TradingView Events widget)
  backend/
    src/
      server.js
      services/
        notion.service.js         (maps Notion pages, EXCLUDES Emotions & Learn fields by design)
      routes/
        trades.js                 (/api/trades, /api/trades/featured)
        waitlist.js
      db/
        migrations/*.sql
    package.json                  (express, helmet, cors, express-rate-limit, @notionhq/client, pg)
    .env.example                  (NOTION_TOKEN, NOTION_TRADES_DB_ID, DATABASE_URL, etc.)
```

---

## 3. Critical privacy rules (DO NOT VIOLATE)

The Notion Trading Journal has two private fields that must never leave Jakub's machine:

- `Emotions`
- `What did you learn today?`

These are mapped OUT at the Notion service layer (`backend/src/services/notion.service.js`), not just filtered at the API edge. The static fallback `frontend/public/data/trades-snapshot.json` must also never contain them. If you ever regenerate the snapshot, double-check those keys are absent.

---

## 4. Conventions

- **Brand**: `B.E.T.Trade` (always, exactly).
- **Language**: English. Comments in JS can stay English. Trading jargon stays untranslated (pip, lot, RR, SL, BSL, SSL, SIBI, BISI, MSS, NWOG, ORG, PFVG, +IFVG, -IFVG, +OB).
- **Tone for lessons**: informal, playful, motivating - not academic. The 4 Forex lessons (pip value, lot sizing, leverage, spread) are written in that voice; match it for new lessons.
- **Dashes**: regular `-` only. Em-dashes `—` are banned site-wide.
- **Cursor**: default system cursor only. No custom cursor styles.
- **Emojis**: none in README. Sparing use elsewhere only if Jakub explicitly asks.
- **CSS theming**: per-page asset accent colors via `body.asset-forex / asset-futures / asset-crypto` and `--page-a`, `--page-rgb` custom properties. Use those in lesson page CSS rather than hardcoding colors.
- **Sidebar**: rendered by `js/sidebar.js`, mounts into `<div id="sidebar-mount"></div>`. Must be `<div role="navigation">` inside, NOT `<nav>` - global `nav { position:fixed }` hijacks it.
- **Featured trades**: `main.js` tries `/api/trades/featured` first, falls back to `data/trades-snapshot.json`.

---

## 5. What's been done so far

Landing page redesigned to dark theme, BlueEyes-Trader-inspired. Left Notion-style sidebar with groups: Main (Home, Courses, Trading Plan, Forex, Futures, Crypto, Trade Recaps, Calendar), Community (Discord, Live Q&A - locked), Account (Join CTA). Courses section split into 3 asset cards (Forex, Futures, Crypto) and placed ABOVE the Live Trades section on the landing. Calendar page uses TradingView Events widget (we tried a custom Forex Factory grid; user wanted the original TradingView reverted). Featured trades grid on landing pulls from snapshot JSON for now.

Four Forex Basics lessons exist with full content in the informal/playful voice: pip value, lot sizing, leverage, spread. Each lesson page has a hero, article body, and a `<a class="next-lesson">` CTA to the next lesson. Each has the asset-forex body class for accent theming.

Backend scaffolded but not deployed: Express server, Notion service that maps trades and explicitly omits Emotions/Learn, routes for `/api/trades` and `/api/trades/featured`, waitlist route stub, Postgres migrations folder. No auth, no Stripe yet.

Admin bypass: `js/admin.js` reads `localStorage['bet.admin']`. If `'true'`, it adds `body.is-admin` and injects an "ADMIN MODE" badge into the sidebar footer. `window.bet.setAdmin(true|false)` toggles it from devtools.

Own Notes notepad: `js/notes.js` is in place. It looks for `#own-notes-area`, loads localStorage value scoped by URL filename (`bet.notes.<filename>`), debounces save 600ms, also saves on blur and beforeunload, supports a Clear button with confirm. CSS for `.own-notes`, `.own-notes-head`, `.own-notes-title`, `.own-notes-area`, `.own-notes-clear`, `.own-notes-status`, `.own-notes-foot` already lives in `style.css`.

Site is fully English. README is English, MIT, no emojis. GitHub repo set up with topics. Em-dashes replaced with hyphens site-wide.

---

## 6. Pending work

**Immediate next task (in progress, not finished):**
Add the Own Notes HTML block to all four Forex lesson pages, placed AFTER the lesson body text and BEFORE the `<a class="next-lesson">` CTA. Also add `<script src="../js/notes.js"></script>` after the existing `<script src="../js/main.js"></script>` in each of those four files.

Files to edit:
- `frontend/public/pages/forex-pip-value.html`
- `frontend/public/pages/forex-lot-sizing.html`
- `frontend/public/pages/forex-leverage.html`
- `frontend/public/pages/forex-spread.html`

HTML block to insert before each `<a class="next-lesson" ...>`:

```html
<div class="own-notes">
  <div class="own-notes-head">
    <h3 class="own-notes-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
      Own notes
    </h3>
    <div class="own-notes-meta">
      <span class="own-notes-status" id="own-notes-status"></span>
      <button class="own-notes-clear" id="own-notes-clear" title="Clear notes">Clear</button>
    </div>
  </div>
  <textarea class="own-notes-area" id="own-notes-area" placeholder="Write down concepts, feelings, and key takeaways from this lesson..."></textarea>
  <div class="own-notes-foot">Saved locally on your device - not synced to the server</div>
</div>
```

Use the `Edit` tool one file at a time. Do NOT use bash `sed`.

**From the original BET.txt task list, still open:**
- Free intro lesson + risk disclaimer page.
- Social media links + Discord invite section.
- Real backend deploy: hook up Notion API, Postgres, JWT auth, Stripe paywall.
- Replace the snapshot-based featured trades with the live `/api/trades/featured` once backend runs.

---

## 7. Known landmines

- **Bash on Windows mount can corrupt files.** `sed -i` and similar in-place edits previously appended null bytes to JS files (causing `SyntaxError`) and truncated HTML files (lost testimonials, CTA, footer, scripts from `index.html`; truncated `pages/forex.html`). Use the `Edit` / `Write` tools. If you absolutely must use bash, write to a temp file and `mv` - never `-i`.
- **`<nav class="sb-body">` breaks the sidebar.** Global CSS `nav { position:fixed; top:0; left:0; right:0; display:flex }` hijacks any `<nav>`. Keep the sidebar body as `<div role="navigation">`.
- **Custom calendar didn't render right.** We reverted to TradingView Events widget per user's request "vrat mi to na povodne". Don't rebuild a custom one unless the user asks again.

---

## 8. Quick-start checklist for the new PC

After cloning to the new machine:

```bash
cd <new-path>/tradeedge
git status                         # confirm clean working tree
ls frontend/public/pages           # confirm all forex-*.html files present
ls frontend/public/js              # confirm sidebar.js, main.js, admin.js, notes.js all present
```

Open `frontend/public/index.html` in a browser to sanity-check the landing. Open one of the `pages/forex-*.html` lessons to confirm the asset accent theming still works.

When you (Claude) are ready to resume, the very next concrete action is the Own Notes HTML insertion described in section 6.

---

## 9. Where to find more detail if needed

The full prior chat transcript on Jakub's main PC lives at:
`C:\Users\jakub\AppData\Roaming\Claude\local-agent-mode-sessions\ce6b5315-4461-49f6-a5bc-1557edbad937\ed78a70d-5385-4827-8bf2-9bc1d07dbec4\local_de085cc1-314e-4874-8a97-09a6345a7244\.claude\projects\C--Users-jakub-AppData-Roaming-Claude-local-agent-mode-sessions-ce6b5315-4461-49f6-a5bc-1557edbad937-ed78a70d-5385-4827-8bf2-9bc1d07dbec4-local-de085cc1-314e-4874-8a97-09a6345a7244-outputs\88f0649a-77a8-4a17-b55b-a461367df008.jsonl`

It will not exist on the new PC. Use this handoff file as the source of truth.
