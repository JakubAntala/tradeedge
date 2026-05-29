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

Three **Major Pairs** sub-lessons exist in the same voice, deeper format (~10-14 min reads each): `forex-eurusd.html` (02.1 - DXY relationship as secret indicator, London Open Sweep & NY AM Continuation setups), `forex-gbpusd.html` (02.2 - the "Cable" name origin, signature double-sweep pattern, BoE Decision Day Fade setup, head-to-head sizing comparison vs EUR/USD), `forex-usdjpy.html` (02.3 - safe-haven mechanics, BoJ-Fed yield gap and the carry trade, US 10Y yield as external indicator, 2-decimal pip recap, intervention risk above 150/155/160). The USD/JPY lesson also carries the **Correlations System outro** which ties all three majors together: full correlation matrix, the "accidentally tripling your risk" trap with √-formula math, five practical rules, session matching table, and DXY as the universal lens for direction-then-pair-selection workflow. The Forex hub (`pages/forex.html`) now has a `#majors` lesson-preview block mirroring the existing `#basics` block, with bullets to the three sub-pages. The last Basics lesson (`forex-spread.html`) Next CTA was rewired to link directly to `forex-eurusd.html` so 01.1 → 01.4 → 02.1 → 02.3 reads as one continuous chain. Major Pairs lessons live under `body.asset-forex` like Basics, with Own Notes (final "Write your own notes if needed" shape, no foot div) and `notes.js` script wired in.

Backend scaffolded but not deployed: Express server, Notion service that maps trades and explicitly omits Emotions/Learn, routes for `/api/trades` and `/api/trades/featured`, waitlist route stub, Postgres migrations folder. No auth, no Stripe yet.

Admin bypass: `js/admin.js` reads `localStorage['bet.admin']`. If `'true'`, it adds `body.is-admin` and injects an "ADMIN MODE" badge into the sidebar footer. `window.bet.setAdmin(true|false)` toggles it from devtools.

Own Notes notepad: `js/notes.js` is in place. It looks for `#own-notes-area`, loads localStorage value scoped by URL filename (`bet.notes.<filename>`), debounces save 600ms, also saves on blur and beforeunload, supports a Clear button with confirm. CSS for `.own-notes`, `.own-notes-head`, `.own-notes-title`, `.own-notes-area`, `.own-notes-clear`, `.own-notes-status`, `.own-notes-foot` already lives in `style.css`.

The Own Notes block has been added to all 4 Forex Basics lessons (pip value, lot sizing, leverage, spread), positioned after the lesson body text and before the `<a class="next-lesson">` CTA, with `<script src="../js/notes.js"></script>` wired in after `main.js`. The heading text was tweaked to **"Write your own notes if needed"** (not "Own notes") and the `.own-notes-foot` "Saved locally..." footer line was removed - so when adding the block to new lessons, use that final shape (heading text + no footer div).

**Dev-mode unlock (paywall bypass for everyone, temporary):** `frontend/public/js/admin.js` was rewritten so it unconditionally sets `body.is-admin` on every page load, and `window.bet.isAdmin()` always returns true. This activates all the existing CSS overrides in `style.css` (the `body.is-admin ...` block around lines 1052-1110), which: hide sidebar lock icons, fully reveal `.lesson-row.locked` rows, hide `.locked-overlay`, restyle `.paywall-card`, and add a " · UNLOCKED" suffix to `Pro` tags. The "ADMIN MODE · exit" badge in the sidebar foot is no longer injected. The `setAdmin()` API surface is preserved so `pages/admin.html` keeps working (it just always shows the "active" view). All `.locked` class names in HTML and all `body.is-admin` CSS rules are untouched - when the real backend paywall (JWT + Stripe) is ready, reverting `js/admin.js` from git is a one-step re-lock.

Site is fully English. README is English, MIT, no emojis. GitHub repo set up with topics. Em-dashes replaced with hyphens site-wide.

**Pricing page** (`pages/pricing.html`) was added - a standalone page with 3 plan cards in prop-firm style: Starter (€0), Pro (€5/mo, featured/highlighted), Mentoring (€99/mo). Each card has a CTA button (outline / solid / ghost variant), a divider, and a feature list using ✓ checkmarks for included items and ✗ (`.no` class, greyed strikethrough) for excluded items. Below the cards: a 30-day guarantee block and a 6-item FAQ section. The page uses `.pricing-hero` for the header, `.pricing-grid` for the cards, `.pricing-guarantee` and `.pricing-faq` for the lower sections. **Pricing** was added to the sidebar (`js/sidebar.js`) as the second item in the Main group, right after Home, using a tag SVG icon (`ICON.tag`). CSS additions in `style.css` for this page: `.plan-features li.no`, `.plan-divider`, `.plan-btn` (with `.outline`, `.solid`, `.ghost` variants), `.pricing-hero`, `.pricing-faq`, `.pfaq-item`, `.pfaq-q`, `.pfaq-a`, `.pricing-guarantee`. The cards section uses `style="max-width:none;width:auto"` on the `.section` wrapper so the grid can center freely with `max-width:960px;margin:0 auto` regardless of sidebar state.

**Pro plan price changed** from €29/mo to **€5/mo** in three places: `index.html` (pricing grid), `pages/forex.html` (CTA under Basics lessons), `pages/forex.html` (CTA under Major Pairs lessons).

---

## 6. Pending work

**Remaining Forex track lessons** (same pattern as Basics + Majors - sub-lessons where it makes sense, informal/playful voice, ~10+ min reads, Own Notes block, asset-forex theming, `notes.js` wired in, chained next-lesson CTAs, and a matching `#anchor` lesson-preview block added to `pages/forex.html`):

- **03 XAU/USD (Gold) Playbook** - why gold behaves nothing like a currency pair, the DXY relationship, NY open behaviour, risk-off windows, $/move math reminder (1 standard lot = $100/pip)
- **04 London + NY Killzones (Forex-specific)** - how forex pairs react in London Open (02:00-05:00 NY) and NY AM (08:30-11:00), the liquidity sweep playbook, when NOT to enter
- **05 Forex Prop Firms - FTMO and friends** - FTMO, MyForexFunds, FundedNext, The5ers comparison of rules, max DD, daily loss, profit targets, scaling, payouts
- **06 News Trading - NFP, CPI, ECB, BoE** - high-impact news handling, when direction holds vs reverses, why prop firms ban it

Final Own Notes block shape to reuse (agreed final version - heading text changed, no foot div):

```html
<div class="own-notes">
  <div class="own-notes-head">
    <h3 class="own-notes-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
      Write your own notes if needed
    </h3>
    <div class="own-notes-meta">
      <span class="own-notes-status" id="own-notes-status"></span>
      <button class="own-notes-clear" id="own-notes-clear" title="Clear notes">Clear</button>
    </div>
  </div>
  <textarea class="own-notes-area" id="own-notes-area" placeholder="Write down concepts, feelings, and key takeaways from this lesson..."></textarea>
</div>
```

Also remember `<script src="../js/notes.js"></script>` after `main.js`.

**Futures and Crypto sections** (in `pages/futures.html`, `pages/crypto.html`) - same level of content build-out is still to come.

**From the original BET.txt task list, still open:**
- Free intro lesson + risk disclaimer page.
- Social media links + Discord invite section.
- Real backend deploy: hook up Notion API, Postgres, JWT auth, Stripe paywall - at which point revert `js/admin.js` to its localStorage-gated form so the paywall actually paywalls again.
- Replace the snapshot-based featured trades with the live `/api/trades/featured` once backend runs.

---

## 7. Known landmines

- **Bash on Windows mount can corrupt files.** `sed -i` and similar in-place edits previously appended null bytes to JS files (causing `SyntaxError`) and truncated HTML files (lost testimonials, CTA, footer, scripts from `index.html`; truncated `pages/forex.html`). Use the `Edit` / `Write` tools. If you absolutely must use bash, write to a temp file and `mv` - never `-i`.
- **Null bytes resurfaced in lesson HTMLs.** When we added Own Notes, three of the four forex lesson files (`forex-pip-value.html`, `forex-lot-sizing.html`, `forex-leverage.html`) had hundreds of null bytes scattered through them - leftover from older `sed -i` runs. ripgrep (and therefore the Grep tool) silently skipped matching them, which made it look like the files didn't contain the pattern. Fix: `tr -d '\0' < file > file.clean && mv file.clean file`. Always check `file <path>` - clean HTML reports as "HTML document, Unicode text, UTF-8 text"; corrupted reports as just "data".
- **After any bash modification of a file, the `Edit` tool will refuse with "File has been modified since read".** Re-`Read` the file before trying to `Edit` again.
- **`<nav class="sb-body">` breaks the sidebar.** Global CSS `nav { position:fixed; top:0; left:0; right:0; display:flex }` hijacks any `<nav>`. Keep the sidebar body as `<div role="navigation">`.
- **Custom calendar didn't render right.** We reverted to TradingView Events widget per user's request "vrat mi to na povodne". Don't rebuild a custom one unless the user asks again.
- **Dev-mode unlock lives in one file.** `js/admin.js` unconditionally adds `body.is-admin`. Do NOT add a second "always unlock" mechanism elsewhere - one source of truth. When real auth is wired, revert that file and the paywall returns intact.

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

When you (Claude) are ready to resume, the next concrete actions are the remaining Forex lesson builds described in section 6 (lessons 03-06).

---

## 9. Where to find more detail if needed

The full prior chat transcript on Jakub's main PC lives at:
`C:\Users\jakub\AppData\Roaming\Claude\local-agent-mode-sessions\ce6b5315-4461-49f6-a5bc-1557edbad937\ed78a70d-5385-4827-8bf2-9bc1d07dbec4\local_de085cc1-314e-4874-8a97-09a6345a7244\.claude\projects\C--Users-jakub-AppData-Roaming-Claude-local-agent-mode-sessions-ce6b5315-4461-49f6-a5bc-1557edbad937-ed78a70d-5385-4827-8bf2-9bc1d07dbec4-local-de085cc1-314e-4874-8a97-09a6345a7244-outputs\88f0649a-77a8-4a17-b55b-a461367df008.jsonl`

It will not exist on the new PC. Use this handoff file as the source of truth.
