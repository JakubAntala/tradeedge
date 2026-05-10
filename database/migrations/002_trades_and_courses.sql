-- =============================================
-- TradeEdge Academy — Trade recaps + Courses content
-- Migration 002
-- =============================================

-- ===== TRADE RECAPS (synced from Notion) =====
CREATE TABLE IF NOT EXISTS trade_recaps (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_page_id      TEXT UNIQUE NOT NULL,        -- source of truth in Notion
  name                TEXT NOT NULL,                -- Notion title (e.g. "66")
  trade_date          DATE NOT NULL,
  dow                 TEXT,                         -- Monday..Friday
  pair                TEXT,                         -- MNQH, EUR/USD, XAUUSD, ...
  session             TEXT,                         -- Asian | London | New York
  direction           TEXT,                         -- Long | Short
  bias                TEXT,                         -- Bullish | Bearish | Cant tell
  entry_time          NUMERIC(5,2),                 -- 9.39 = 09:39
  duration_h          NUMERIC(6,2),                 -- in hours
  units               INT,
  rr                  NUMERIC(6,2),                 -- realised RR
  potential_rr        NUMERIC(6,2),                 -- best-case RR
  win                 BOOLEAN NOT NULL DEFAULT false,
  news                JSONB DEFAULT '[]'::jsonb,    -- array of news event tags
  narrative           TEXT,                         -- public — setup explanation
  chart_image_url     TEXT,                         -- our permanent CDN URL (after upload)
  notion_image_url    TEXT,                         -- ephemeral S3 URL (re-fetched on sync)
  featured            BOOLEAN NOT NULL DEFAULT false, -- shown on public landing
  notion_last_edited  TIMESTAMPTZ,
  synced_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trades_date         ON trade_recaps(trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_trades_featured_win ON trade_recaps(featured, win, rr DESC);
CREATE INDEX IF NOT EXISTS idx_trades_pair         ON trade_recaps(pair);
CREATE INDEX IF NOT EXISTS idx_trades_session      ON trade_recaps(session);

-- NOTE: Emotions and "What did you learn today?" intentionally NOT stored —
-- those are private and stripped at sync time in services/notion.service.js.

-- ===== COURSES content seed (Trading Plan course + sub-strategies) =====
-- Adds initial paywalled course based on Jakub's existing Notion Trading Plan.
-- (courses + lessons tables already exist from migration 001)

INSERT INTO courses (slug, title, description, required_tier, sort_order, published)
VALUES
  ('trading-plan', 'Kompletný Trading Plan', 'ICT/SMC stratégia: Bias na W/D/4H, confirmation na 4H/1H/15M, execution v killzones a macro oknách.', 'pro', 10, true),
  ('killzones-macros', 'Killzones & Macros', 'Presné časové okná pre Forex aj Futures — London, NY AM, NY PM, Power Hour, Asia Range a 9 macro intervals.', 'pro', 20, true),
  ('risk-management', 'Risk & Money Management', 'Pozičné sizing, RR-driven execution, ako prežiť drawdown a kedy nevstupovať.', 'pro', 30, false),
  ('prop-firm-guide', 'Prop Firm Challenge Guide', 'Krok za krokom ako prejsť funded trader challenge.', 'pro', 40, false),
  ('live-trade-recaps', 'Live Trade Recaps', 'Reálne obchody rozobraté na súčiastky — narrative, entry, exit, lessons.', 'pro', 50, true),
  ('trading-psychology', 'Trading Psychology', 'Disciplína, kontrola emócií, denná rutina ktorá oddeľuje profitabilných traderov.', 'pro', 60, false)
ON CONFLICT (slug) DO NOTHING;

-- Lessons of the Trading Plan course (each strategy = its own lesson page)
WITH tp AS (SELECT id FROM courses WHERE slug = 'trading-plan')
INSERT INTO lessons (course_id, slug, title, sort_order, is_preview)
SELECT tp.id, v.slug, v.title, v.sort_order, v.preview FROM tp,
(VALUES
  ('bias',          '1. Bias — W/D/4H',                10, true),
  ('confirmation',  '2. Confirmation — 4H/1H/15M',     20, false),
  ('execution',     '3. Execution — 15M/5M/3M',        30, false),
  ('killzones',     '4. Killzones (NY local time)',    40, false),
  ('macros',        '5. Macro Time Slots',             50, false),
  ('news-handling', '6. High-impact News & FOMC',      60, false)
) AS v(slug, title, sort_order, preview)
ON CONFLICT (course_id, slug) DO NOTHING;
