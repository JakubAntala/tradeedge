# Notion → TradeEdge live sync

Tvoj Notion `Trading Journal` je single source of truth. Backend ho periodicky číta, mapuje do našej DB a zverejňuje cez API. **Emotions** a **"What did you learn today?"** sa do nášho systému nikdy nedostanú — sú stripnuté priamo v `notion.service.js`.

## Architektúra

```
Notion DB (Trading Journal)
     │
     │  Notion API (read-only)
     ▼
backend/src/services/notion.service.js
     │  (mapuje + filtruje súkromné polia)
     ▼
backend/src/services/tradeSync.service.js
     │  ├── upsert do trade_recaps (Postgres)
     │  └── prepíše frontend/public/data/trades-snapshot.json
     ▼
/api/trades/featured  ←──  index.html (live preview na landingu)
/api/trades           ←──  pages/trades.html (paywallovaný feed)
```

## Prvé spustenie

### 1) Vytvor Notion integráciu

1. Choď na <https://www.notion.so/my-integrations>
2. **+ New integration** — pomenuj napr. "TradeEdge Sync"
3. **Capabilities**: stačí *Read content* (nepotrebujeme write)
4. Skopíruj **Internal Integration Token** (začína `secret_…` alebo `ntn_…`)

### 2) Pripoj integráciu k databáze

1. Otvor v Notione `Trading Journal` databázu
2. Vpravo hore `…` → **Connections** → vyhľadaj svoju integráciu → **Confirm**

### 3) Backend

```bash
cd backend
cp .env.example .env
# Vyplň DATABASE_URL, NOTION_TOKEN, NOTION_TRADES_DB_ID
npm install

# Spusti migrácie:
psql $DATABASE_URL < ../database/migrations/001_init.sql
psql $DATABASE_URL < ../database/migrations/002_trades_and_courses.sql

# Manuálny one-shot sync:
npm run sync:trades
```

Po sync skripte:
- `trade_recaps` v Postgrese sa naplní (~66 riadkov)
- `frontend/public/data/trades-snapshot.json` sa prepíše čerstvými dátami
- Landing page automaticky zobrazí top 6 najlepších winov

### 4) Naplánuj automatický sync

**Možnosť A — cron (lokálne / VPS):**
```cron
*/10 * * * * cd /path/to/TradersEdge/backend && /usr/bin/npm run sync:trades >> /var/log/tradeedge-sync.log 2>&1
```

**Možnosť B — Railway / Render / Fly.io cron job:**
nastav job ktorý spúšťa `npm run sync:trades` každých 5–10 min.

**Možnosť C — GitHub Actions:**
```yaml
# .github/workflows/sync-trades.yml
on:
  schedule: [{ cron: '*/10 * * * *' }]
  workflow_dispatch:
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd backend && npm ci && npm run sync:trades
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_TRADES_DB_ID: ${{ secrets.NOTION_TRADES_DB_ID }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      - name: Commit refreshed snapshot
        run: |
          git config user.name "tradeedge-bot"
          git config user.email "bot@tradeedge.sk"
          git add frontend/public/data/trades-snapshot.json
          git diff --cached --quiet || git commit -m "chore: refresh trades snapshot"
          git push
```

**Možnosť D — true real-time (neskôr):** Notion webhook → `POST /api/trades/sync` (admin only).

## Čo sa synchronizuje

| Notion property            | Náš stĺpec               | Public? |
|----------------------------|--------------------------|---------|
| Name                       | `name`                   | ✓       |
| Date                       | `trade_date`             | ✓       |
| DOW                        | `dow`                    | ✓       |
| Pair                       | `pair`                   | ✓       |
| Session                    | `session`                | ✓       |
| Direction                  | `direction`              | ✓       |
| Bias                       | `bias`                   | ✓       |
| Entry Time                 | `entry_time`             | ✓       |
| Duration                   | `duration_h`             | ✓       |
| Units                      | `units`                  | ✓       |
| RR                         | `rr`                     | ✓       |
| Potential RR               | `potential_rr`           | ✓       |
| Win                        | `win`                    | ✓       |
| News                       | `news` (jsonb)           | ✓       |
| Narrative                  | `narrative`              | ✓       |
| Page cover image           | `chart_image_url`        | ✓ (paywall) |
| **Emotions**               | **NEMAPUJEM**            | ✗ private |
| **What did you learn?**    | **NEMAPUJEM**            | ✗ private |

Podmienka pre "featured" (zobrazené verejne na landingu):
```js
featured = win === true && rr >= 2
```
Toto sa nastavuje pri sync-u. Neskôr môžeš pridať do Notion novú property `Featured` (checkbox) a override.

## Chart screenshoty

Notion vracia signed S3 URL ktoré expirujú za ~1 hodinu. Pre produkciu treba:
1. v sync-u stiahnuť obrázok z `notion_image_url`
2. nahrať na vlastné CDN (S3 / R2 / Bunny)
3. uložiť permanent URL do `chart_image_url`

To je TODO v `services/notion.service.js → fetchPageImage`. Zatiaľ landing preview zobrazuje len text + RR + narrative bez obrázku.

## Troubleshooting

- **`NOTION_TOKEN not set`** — chýba env var
- **`object_not_found`** — integrácia nemá zdielanú DB (krok 2)
- **`Could not find database`** — zlý `NOTION_TRADES_DB_ID` (musí byť UUID s pomlčkami)
- **DB upsert zlyhal** — migrácia 002 nebola pustená alebo `DATABASE_URL` nie je správny

## Bezpečnosť

- `NOTION_TOKEN` má **read-only** capability
- Frontend nikdy nevolá Notion API priamo
- Súkromné Notion polia (Emotions/Learn) sa do nášho systému nedostanú nikdy — `notion.service.js` ich z mapovania úplne vynecháva, takže ani neexistujú v `req`/`res`/DB
