# B.E.T.Trade — Trading Academy 🇸🇰

> **Online platforma pre kurzy a videá o tradingu** od certified funded tradera. Kompletný Trading Plan, live trade recapy zo živých účtov, ekonomický kalendár a paywallované kurzy pre Forex / Futures / Crypto.

![Status](https://img.shields.io/badge/status-work_in_progress-orange?style=for-the-badge)
![Stage](https://img.shields.io/badge/stage-pre--launch-blue?style=for-the-badge)
![Made in](https://img.shields.io/badge/made_in-Slovakia-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![Postgres](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Notion API](https://img.shields.io/badge/Notion-API-000000?logo=notion&logoColor=white)](https://developers.notion.com)
[![Stripe](https://img.shields.io/badge/Stripe-planned-635BFF?logo=stripe&logoColor=white)](https://stripe.com)

---

## 🚧 Work in Progress

Tento projekt je aktívne vo vývoji. Landing page, navigácia, kurz štruktúra, live sync z Notion-u a ekonomický kalendár fungujú. Auth, Stripe paywall a video player prídu v ďalších iteráciách.

## ✨ Čo to je

**B.E.T.Trade** je členská platforma pre traderov, kde:

- Si kupia prístup k mojim kurzom (ICT/SMC metodika, Trading Plan, prop firm guide)
- Vidia **live trade recapy** zo živých účtov — synchronizované z môjho Notion denníka
- Sledujú **ekonomický kalendár** s high-impact news (CPI, FOMC, NFP)
- Majú prístup do uzavretej Discord komunity

Kurzy sú rozdelené podľa asset class — **Forex** (EUR/USD, GBP/USD, XAU), **Futures** (MNQH, ES, NQ), **Crypto** (BTC, ETH) — plus univerzálne foundational kurzy (Trading Plan, Killzones, Risk Management).

## 🎯 Features

### Hotové
- ✅ **Landing page** — dark theme (čierna / deeper blue / biela accent), animovaný hero, custom cursor, particle effects, scroll reveal
- ✅ **Sidebar navigation** (Notion-style) — collapsible, persistent state, mobile overlay, SVG ikony, active state highlight
- ✅ **Najlepšie obchody** — featured trades preview na landingu (live z Notion alebo cached snapshot)
- ✅ **Trade Recaps page** — public ukážka + paywall card, štatistiky (win rate, avg RR, najobchodovanejší pár)
- ✅ **Trading Plan kurz** — 6 lekcií so štruktúrou Bias → Confirmation → Execution → Killzones → Macros → News
- ✅ **Asset categories** — Forex / Futures / Crypto sekcie, každá s vlastnými kurzami
- ✅ **Ekonomický kalendár** — TradingView Events widget s importance + range filtrami, macro time slots reference
- ✅ **Notion → DB live sync** — `trade_recaps` tabuľka, sync služba, scheduled job (cron / GitHub Actions ready)
- ✅ **Privacy by design** — `Emotions` a `What did you learn today?` polia z Notion-u sa do nášho systému nikdy nedostanú (stripnuté pri sync-u)
- ✅ **Backend scaffolding** — Express server, paywall middleware (`requireSubscription('pro')`), API routes pre auth, courses, trades, payments, waitlist

### V pláne
- ⏳ Auth — register/login/JWT, password hashing
- ⏳ Stripe checkout + customer portal + webhook handling
- ⏳ Video player s signed URLs (Mux / Bunny / Cloudflare Stream)
- ⏳ Per-strategy sub-pages pre Trading Plan (zatiaľ jeden anchor-link page)
- ⏳ Discord OAuth invite gating po Pro subscribe
- ⏳ Free úvodná lekcia + risk disclaimer
- ⏳ Email notifikácie cez Resend
- ⏳ Image upload Notion screenshotov do trvalého CDN (Notion S3 URLs expirujú)
- ⏳ Custom kalendár s presným date filtrovaním (alternatíva k TradingView)

## 🛠 Tech Stack

| Vrstva       | Technológia                                            |
|--------------|--------------------------------------------------------|
| Frontend     | Vanilla HTML / CSS / JS (žiadny framework)             |
| Backend      | Node.js 18+ · Express 4 · Helmet · CORS · rate-limit   |
| Database     | PostgreSQL 16                                          |
| Auth         | JWT + bcrypt (planned)                                 |
| Payments     | Stripe (planned)                                       |
| Content sync | Notion API (`@notionhq/client`)                        |
| Calendar     | TradingView Events widget · Forex Factory JSON feed    |
| Video        | Mux / Bunny / Cloudflare Stream (planned)              |
| Email        | Resend (planned)                                       |
| Hosting      | Vercel/Netlify (FE) · Railway/Render (BE) · Neon (DB)  |

Zámerne **bez React-u / Next-u** — projekt je zatiaľ malý, vanilla stack drží bundle pod 50 KB a build step je nulový.

## 🚀 Quick Start

### Frontend only (statika)

```bash
cd frontend/public
npx http-server -p 5500
```
Otvor `http://localhost:5500`.

### Full stack (backend + frontend z jedného portu)

```bash
cd backend
cp .env.example .env       # vyplň DATABASE_URL, NOTION_TOKEN, ...
npm install
npm run dev                # http://localhost:4000
```

Backend servíruje aj frontend, takže všetko beží na `localhost:4000`.

### Notion sync

Pre live sync trade recapov z Notion denníka pozri **[`docs/NOTION_SYNC.md`](docs/NOTION_SYNC.md)**.

Stručne:
```bash
# 1) Vytvor integráciu na https://www.notion.so/my-integrations
# 2) Zdielaj Trading Journal DB s integráciou
# 3) Doplň NOTION_TOKEN a NOTION_TRADES_DB_ID do backend/.env
npm run sync:trades
```

## 📁 Štruktúra projektu

```
TradersEdge/
├── frontend/
│   ├── public/
│   │   ├── index.html              # Landing page
│   │   ├── css/style.css           # Štýly (dark theme, animácie)
│   │   ├── js/
│   │   │   ├── main.js             # Hero animácie, featured trades, signup
│   │   │   └── sidebar.js          # Notion-style left sidebar
│   │   ├── pages/
│   │   │   ├── courses.html        # Knižnica kurzov + 3 asset categories
│   │   │   ├── trading-plan.html   # Hlavný kurz (6 lekcií)
│   │   │   ├── trades.html         # Live trade recaps feed (paywall)
│   │   │   ├── calendar.html       # Ekonomický kalendár
│   │   │   ├── forex.html          # Forex kategória
│   │   │   ├── futures.html        # Futures kategória
│   │   │   └── crypto.html         # Crypto kategória
│   │   └── data/
│   │       └── trades-snapshot.json  # Cached trade data (sanitized z Notion)
│   └── components/                 # (planned) reusable UI
│
├── backend/
│   ├── src/
│   │   ├── server.js               # Express entrypoint
│   │   ├── config/database.js      # Postgres pool
│   │   ├── routes/                 # auth, users, courses, videos, payments, trades, calendar, waitlist
│   │   ├── controllers/
│   │   ├── middleware/             # auth, paywall, errorHandler
│   │   ├── services/
│   │   │   ├── notion.service.js   # Notion API client (private fields stripped)
│   │   │   ├── tradeSync.service.js
│   │   │   └── forexCalendar.service.js
│   │   └── jobs/
│   │       └── syncTrades.js       # Scheduled task entrypoint
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── migrations/
│       ├── 001_init.sql            # users, courses, lessons, videos, subs, waitlist
│       └── 002_trades_and_courses.sql  # trade_recaps + course seed
│
├── content/                        # Source materiál (gitignored — videá, PDFs)
│   ├── courses/                    # Markdown lekcie
│   ├── videos/
│   └── pdfs/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── NOTION_SYNC.md
│
├── _archive/                       # Stará gold paleta (gitignored)
├── LICENSE
└── README.md
```

## 🎨 Color Palette

Dark theme inspirovaný BlueEyes Trader:

| Token        | Hex       | Použitie                  |
|--------------|-----------|---------------------------|
| `--blue`     | `#0284C7` | primárny brand modrý      |
| `--blue-l`   | `#0EA5E9` | hover / accent            |
| `--blue-d`   | `#0369A1` | hĺbkový modrý             |
| `--ink`      | `#F1F5F9` | hlavný text (off-white)   |
| `--bg`       | `#000000` | dominantná čierna         |
| `--bg-soft`  | `#06080C` | sekcie / cards            |
| `--green`    | `#10B981` | success / live indikátor  |

## 🗺 Roadmap

- [x] Landing page redesign (dark theme)
- [x] Sidebar navigation (Notion-style)
- [x] Trade recaps live sync z Notion
- [x] Ekonomický kalendár (TradingView)
- [x] Asset class categories (Forex / Futures / Crypto)
- [ ] Free úvodná lekcia + risk disclaimer
- [ ] Auth (register / login / JWT)
- [ ] Stripe checkout + paywall
- [ ] Discord OAuth invite po Pro subscribe
- [ ] Sociálne siete (IG / X / YouTube)
- [ ] Video player s signed URLs
- [ ] Email notifikácie (Resend)
- [ ] Production deploy

## 📜 License

[MIT](./LICENSE) — voľne použiteľné, atribúcia vítaná.

## 👤 Author

**Jakub Antala** — Certified Funded Trader · Slovakia 🇸🇰

[![GitHub](https://img.shields.io/badge/GitHub-JakubAntala-181717?logo=github)](https://github.com/JakubAntala)

---

> Ak ťa projekt zaujal alebo by si chcel byť informovaný o launchi, pridaj sa na waitlist priamo v aplikácii. ⭐ na repo poteší.
