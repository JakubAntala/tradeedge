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
      assets/images/
        silverbullet-57.png           (Silver Bullet trade screenshot, used in 04.3)
        silverbullet-58.png
      downloads/
        forex-basics-notes.pdf        (auto-generated course notes - 4 Basics lessons, 16pp)
        forex-major-pairs-notes.pdf   (auto-generated course notes - EUR/USD, GBP/USD, USD/JPY, 23pp)
        forex-gold-notes.pdf          (auto-generated course notes - Gold 03.1-03.4, 8pp)
        forex-killzones-notes.pdf     (auto-generated course notes - Killzones 04.1-04.4, 9pp)
        forex-news-notes.pdf          (auto-generated course notes - News 05.1-05.4, 8pp)
      pages/
        pricing.html              (standalone 3-plan pricing page)
        courses.html              (3 asset cards: Forex, Futures, Crypto)
        forex.html                (Forex hub - basics + majors previews, each with a Download PDF button)
        forex-pip-value.html      (lesson 1)
        forex-lot-sizing.html     (lesson 2)
        forex-leverage.html       (lesson 3)
        forex-spread.html         (lesson 4)
        forex-eurusd.html         (Majors 02.1)
        forex-gbpusd.html         (Majors 02.2)
        forex-usdjpy.html         (Majors 02.3 + Correlations outro)
        forex-gold-pips.html      (Gold 03.1 - pip/$ mechanics)
        forex-gold-dxy.html       (Gold 03.2 - DXY + real yields)
        forex-gold-sessions.html  (Gold 03.3 - sessions & NY open)
        forex-gold-risk.html      (Gold 03.4 - risk & cheatsheet)
        forex-kz-time.html        (Killzones 04.1 - time & map)
        forex-kz-sweeps.html      (Killzones 04.2 - sweep then go)
        forex-kz-silver-bullet.html (Killzones 04.3 - Silver Bullet & Judas; has 2 screenshots)
        forex-kz-sessions.html    (Killzones 04.4 - sessions & discipline)
        forex-news-releases.html  (News 05.1 - releases & calendar)
        forex-news-behaviour.html (News 05.2 - how price behaves)
        forex-news-playbook.html  (News 05.3 - trading the reaction)
        forex-news-discipline.html (News 05.4 - discipline & prop-firm reality)
        forex-xauusd.html         (REDIRECT stub -> forex-gold-pips.html)
        forex-killzones.html      (REDIRECT stub -> forex-kz-time.html)
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

**Pricing page card centering (May 2026).** On `pages/pricing.html` the plan cards used to shift 260px right when the sidebar opened (global `body.sb-open .section{margin-left:260px}`) while the centered `.pricing-hero` stayed put, so the Pro card no longer lined up under the "Pricing" heading. Fix: added `class="pricing-page"` to the `<body>` and a scoped override `body.pricing-page.sb-open .section{margin-left:0}` (inside the existing `@media (min-width:901px)` block in `style.css`). Now the cards stay centered on the full page in both sidebar states; the sidebar slides over them like it already did for the hero.

**CSS lint cleanup (May 2026).** Fixed the 3 warnings VS Code's built-in validator reported in `style.css`: added the standard `line-clamp` next to `-webkit-line-clamp` (`.trade-narr`), added the standard `mask` next to `-webkit-mask` (`.course-card::before`), and removed the empty ruleset `body.is-admin .trade-chip{}`. File now lints clean. NOTE: while doing this, successive `Edit`-tool calls truncated the large CRLF `style.css` at the end - recovered from `git show HEAD:...`, reapplied fixes in a temp file, and copied back as CRLF. After any multi-edit on a big mounted file, verify brace balance and that `file` still reports "with CRLF line terminators".

**Download PDF feature (May 2026).** Both Forex hub preview cards now offer a downloadable PDF of the lesson notes. On `pages/forex.html`, each card's CTA was wrapped in a `.lesson-cta-row` (flex, space-between) with the existing `.cta-inline` on the left and a new `.download-pdf-btn` (solid-blue button + download icon, `download` attribute) on the right: `#basics` -> `../downloads/forex-basics-notes.pdf`, `#majors` -> `../downloads/forex-major-pairs-notes.pdf`. CSS for `.lesson-cta-row` and `.download-pdf-btn` lives in `style.css` right after `.cta-inline`. The PDFs are pre-generated (not built at request time) from the actual lesson HTML by a Python script using `reportlab` + `beautifulsoup4`, with DejaVuSans/DejaVuSansMono fonts for Unicode (arrows, ×, €). The generator parses each lesson's `<article>` and renders tldr / h2 / h3 / p / formula (dark code box) / callout / example / ul / ol / hr / recap-table into a branded layout (navy cover, "what's inside" contents, per-lesson header); it skips the Own Notes block and the next-lesson CTA. Lesson titles are pulled with `re.sub(r'\s+',' ', el.get_text())` so "EUR/USD" doesn't become "EUR /USD". To regenerate after editing lessons, re-run the script against the lesson files and copy the output into `frontend/public/downloads/`.

**Gold (Lesson 03) + Killzones (Lesson 04), then SPLIT 4 ways each (May 2026).** Both chapters were first written as single deep pages, then split into 4 sub-lessons to match the Basics/Majors structure. **Gold 03** (asset-forex, informal voice): `forex-gold-pips.html` (03.1 - gold is not a currency, the dollars-per-move pip math = 1 standard lot is $100 per $1 move on a 100oz contract, how gold differs from a currency pair), `forex-gold-dxy.html` (03.2 - the three drivers real yields / DXY / fear, DXY as the first filter, the decoupling trap), `forex-gold-sessions.html` (03.3 - sessions table, NY-open sweep-then-go, the two-stage risk-off trap), `forex-gold-risk.html` (03.4 - the $/move sizing math with a 0.125-lot worked example, the 7-rule playbook, a cheatsheet table). **Killzones 04** was BUILT FROM JAKUB'S NOTION (his Trading plan + ICT 2024 Mentorship Notes + Trading Journal entries + the free-form JOURNAL page): `forex-kz-time.html` (04.1 - TIME is the edge, the NY-time clock, the killzone map table, important times, the macros table), `forex-kz-sweeps.html` (04.2 - the sweep-then-go core play, pre-market/opening range 3-shots, how a pool gets primed and swept), `forex-kz-silver-bullet.html` (04.3 - the 10:00 Silver Bullet, the Judas Swing, the 9:30 1st PFVG; THIS page holds Jakub's two real Silver Bullet chart screenshots as `<figure class="lesson-figure">` pointing at `../assets/images/silverbullet-57.png` and `-58.png`), `forex-kz-sessions.html` (04.4 - London Open + NY AM killzones, NY Lunch/PM when-not-to-enter, the discipline list, a cheatsheet). Exact killzone/macro times come straight from Jakub's Trading plan (London 02:00-05:00, NY AM 08:30-11:00; macros 02:33-03:00 / 04:03-04:30 / 08:50-09:10 / 09:50-10:10 / 10:50-11:10). **PRIVACY honored: NO Emotions, 'What did you learn today?', or personal diary/mood lines appear on any page or in any PDF - only the technical Narrative was used** (verified by grep). The `#gold` and `#killzones` preview cards on `forex.html` each list their 4 sub-pages and carry ONE Download PDF button (`forex-gold-notes.pdf` 8pp, `forex-killzones-notes.pdf` 9pp, regenerated from the 4 sub-pages each; the PDF generator skips `<figure>`, so screenshots are web-only). Lesson chain is continuous: usdjpy 02.3 -> 03.1 -> 03.4 -> 04.1 -> 04.4 -> forex hub. The original single pages `forex-xauusd.html` and `forex-killzones.html` are now REDIRECT STUBS (meta-refresh + JS) to 03.1 / 04.1, because the sandbox bash cannot `rm` files on the Windows mount (delete = 'Operation not permitted'; `cp` overwrite works) - they can be `git rm`-ed from a machine with delete perms. **New CSS** in `style.css` (right after `.download-pdf-btn`): `.lesson-figure`, `.lesson-figure img`, `.lesson-figure figcaption` for in-lesson chart screenshots. **Future lessons should keep drawing from Jakub's Notion** (his explicit ask): ICT 2024 Mentorship Notes (`1073b2c9-24cb-805f-ae4a-d3c7daf94614`), JOURNAL (`f4667442-656d-4b86-91fb-d4ea4b277a6c`), Trading plan (`0bfac1c3-b55f-498e-80d9-048a4c0c76b8`), Trading Journal data source (`collection://9397fa00-854d-45ab-8088-728f7cf1535c`) - always excluding the private fields.

**News Trading (Lesson 05) - built from Jakub's Notion, split into 4 (May 2026).** Added as section 05; Jakub moved Prop Firms to be the final section 06. Grounded in the ICT 2024 Mentorship Notes + the Trading Journal / JOURNAL. Core stance: the release itself (FOMC, CPI, NFP, PPI) is **manual intervention - very often untradeable / gambling**, so you sit on your hands through the print and trade the **reaction** (sweep -> MSS -> FVG, same skeleton as a killzone; no MSS = no trade). The 4 sub-pages: `forex-news-releases.html` (05.1 - the releases that matter NFP/CPI/FOMC/PPI/ECB/BoE, the calendar, NY times, the 'manual intervention' model), `forex-news-behaviour.html` (05.2 - news as a liquidity event, the pre-news Judas, the whipsaw + spread blow-out, Powell 'high-resistance' chop), `forex-news-playbook.html` (05.3 - never trade the spike, the 5-step reaction sequence, 'no MSS no trade' with the journal example of trade 60 that lost -1R after entering a News BSL + SIBI with no MSS, plus the 10:00 Silver Bullet fallback), `forex-news-discipline.html` (05.4 - the best news trade is no trade, 'lots of news = no clean setups', don't hold naked through the print, why prop firms restrict news, cheatsheet). `#news` preview card on `forex.html` (4 bullets) + Download PDF -> `forex-news-notes.pdf` (8pp). Chain extended: killzones 04.4 -> news 05.1 -> 05.4 -> forex hub. PRIVACY honored (only the technical Narrative; no Emotions / diary lines). Same token-replace builder + reportlab generator as Gold/Killzones.

---

## 6. Pending work

**Remaining Forex track lessons** (same pattern as Basics + Majors - sub-lessons where it makes sense, informal/playful voice, ~10+ min reads, Own Notes block, asset-forex theming, `notes.js` wired in, chained next-lesson CTAs, and a matching `#anchor` lesson-preview block added to `pages/forex.html`):

- (03 Gold and 04 Killzones are DONE - see section 5; each split into 4 sub-pages, both chained, with Download PDFs.)
- (05 News Trading is DONE - see section 5; 4 sub-pages forex-news-releases/behaviour/playbook/discipline, chained, Download PDF.)
- **06 Forex Prop Firms - FTMO and friends (now the FINAL Forex chapter)** - FTMO, MyForexFunds, FundedNext, The5ers comparison of rules, max DD, daily loss, profit targets, scaling, payouts. Jakub moved this AFTER News, so it is now lesson 06 / the last Forex section.

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
