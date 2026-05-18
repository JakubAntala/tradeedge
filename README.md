# B.E.T.Trade - Trading Academy

> An online platform for trading courses and videos by a certified funded trader. Includes a complete Trading Plan, live trade recaps from real accounts, an economic calendar, and paywalled courses for Forex, Futures, and Crypto.

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

## Work in Progress

This project is under active development. The landing page, navigation, course structure, live Notion sync, and economic calendar are functional. Authentication, Stripe paywall, and the video player are coming in upcoming iterations.

## About

**B.E.T.Trade** is a membership platform for traders where users can:

- Purchase access to structured trading courses (ICT/SMC methodology, Trading Plan, prop firm guide)
- Browse **live trade recaps** from real accounts, synchronized from a private Notion journal
- Track an **economic calendar** with high-impact news (CPI, FOMC, NFP, ECB)
- Join a private Discord community

Courses are organized by asset class - **Forex** (EUR/USD, GBP/USD, XAU), **Futures** (MNQH, ES, NQ), **Crypto** (BTC, ETH) - plus universal foundational courses (Trading Plan, Killzones, Risk Management).

## Features

### Done

- **Landing page** - dark theme (black / deeper blue / white accent), animated hero, custom cursor, particle effects, scroll reveal
- **Sidebar navigation** (Notion-style) - collapsible, persistent state, mobile overlay, SVG icons, active-state highlight
- **Featured trades** - best trade preview on the landing (live from Notion or cached snapshot)
- **Trade Recaps page** - public preview with paywall card, aggregate stats (win rate, avg RR, most-traded pair)
- **Trading Plan course** - six lessons structured as Bias → Confirmation → Execution → Killzones → Macros → News
- **Asset categories** - Forex / Futures / Crypto sections, each with their own course list
- **Economic calendar** - TradingView Events widget with importance and range filters, plus macro time slots reference
- **Notion to DB live sync** - `trade_recaps` table, sync service, scheduled job (cron / GitHub Actions ready)
- **Privacy by design** - `Emotions` and `What did you learn today?` fields from Notion never reach the system (stripped at sync time)
- **Backend scaffolding** - Express server, paywall middleware (`requireSubscription('pro')`), API routes for auth, courses, trades, payments, waitlist

### Planned

- Auth - register/login/JWT, password hashing
- Stripe checkout, customer portal, webhook handling
- Video player with signed URLs (Mux / Bunny / Cloudflare Stream)
- Per-strategy sub-pages for the Trading Plan (currently a single anchor-link page)
- Discord OAuth invite gating after Pro subscribe
- Free introductory lesson plus risk disclaimer
- Email notifications via Resend
- Image upload of Notion screenshots to permanent CDN (Notion S3 URLs expire)
- Custom calendar with precise date filtering (alternative to TradingView)

## Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| Frontend     | Vanilla HTML / CSS / JS (no framework)                  |
| Backend      | Node.js 18+ · Express 4 · Helmet · CORS · rate-limit    |
| Database     | PostgreSQL 16                                           |
| Auth         | JWT and bcrypt (planned)                                |
| Payments     | Stripe (planned)                                        |
| Content sync | Notion API (`@notionhq/client`)                         |
| Calendar     | TradingView Events widget · Forex Factory JSON feed     |
| Video        | Mux / Bunny / Cloudflare Stream (planned)               |
| Email        | Resend (planned)                                        |
| Hosting      | Vercel/Netlify (FE) · Railway/Render (BE) · Neon (DB)   |

Intentionally **without React or Next.js** - the project is small, vanilla stack keeps the bundle under 50 KB, and there is no build step.

## Quick Start

### Frontend only (static)

```bash
cd frontend/public
npx http-server -p 5500
```

Open `http://localhost:5500`.

### Full stack (backend serves frontend on a single port)

```bash
cd backend
cp .env.example .env       # fill in DATABASE_URL, NOTION_TOKEN, ...
npm install
npm run dev                # http://localhost:4000
```

The backend serves the frontend, so everything runs at `localhost:4000`.

### Notion sync

For live sync of trade recaps from the Notion journal, see **[`docs/NOTION_SYNC.md`](docs/NOTION_SYNC.md)**.

In short:

```bash
# 1) Create an integration at https://www.notion.so/my-integrations
# 2) Share the Trading Journal database with the integration
# 3) Add NOTION_TOKEN and NOTION_TRADES_DB_ID to backend/.env
npm run sync:trades
```

## Project Structure

```
TradersEdge/
├── frontend/
│   ├── public/
│   │   ├── index.html              # Landing page
│   │   ├── css/style.css           # Styles (dark theme, animations)
│   │   ├── js/
│   │   │   ├── main.js             # Hero animations, featured trades, signup
│   │   │   └── sidebar.js          # Notion-style left sidebar
│   │   ├── pages/
│   │   │   ├── courses.html        # Course library and three asset categories
│   │   │   ├── trading-plan.html   # Main course (six lessons)
│   │   │   ├── trades.html         # Live trade recaps feed (paywalled)
│   │   │   ├── calendar.html       # Economic calendar
│   │   │   ├── forex.html          # Forex category
│   │   │   ├── futures.html        # Futures category
│   │   │   └── crypto.html         # Crypto category
│   │   └── data/
│   │       └── trades-snapshot.json  # Cached trade data (sanitized from Notion)
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
│       └── 002_trades_and_courses.sql  # trade_recaps and course seed
│
├── content/                        # Source material (gitignored - videos, PDFs)
│   ├── courses/                    # Markdown lessons
│   ├── videos/
│   └── pdfs/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── NOTION_SYNC.md
│
├── _archive/                       # Old gold palette (gitignored)
├── LICENSE
└── README.md
```

## Color Palette

Dark theme inspired by BlueEyes Trader:

| Token        | Hex       | Usage                       |
|--------------|-----------|-----------------------------|
| `--blue`     | `#0284C7` | primary brand blue          |
| `--blue-l`   | `#0EA5E9` | hover and accents           |
| `--blue-d`   | `#0369A1` | deep blue                   |
| `--ink`      | `#F1F5F9` | primary text (off-white)    |
| `--bg`       | `#000000` | dominant black              |
| `--bg-soft`  | `#06080C` | sections and cards          |
| `--green`    | `#10B981` | success and live indicator  |

## Roadmap

- [x] Landing page redesign (dark theme)
- [x] Sidebar navigation (Notion-style)
- [x] Trade recaps live sync from Notion
- [x] Economic calendar (TradingView)
- [x] Asset class categories (Forex / Futures / Crypto)
- [ ] Free introductory lesson and risk disclaimer
- [ ] Auth (register / login / JWT)
- [ ] Stripe checkout and paywall
- [ ] Discord OAuth invite after Pro subscribe
- [ ] Social media (IG / X / YouTube)
- [ ] Video player with signed URLs
- [ ] Email notifications (Resend)
- [ ] Production deploy

## License

[MIT](./LICENSE) - free to use, attribution welcome.

## Author

**Jakub Antala** - Certified Funded Trader, Slovakia

[![GitHub](https://img.shields.io/badge/GitHub-JakubAntala-181717?logo=github)](https://github.com/JakubAntala)

---

> If the project caught your eye or you want to be notified at launch, join the waitlist directly in the app. A star on the repo is appreciated.
