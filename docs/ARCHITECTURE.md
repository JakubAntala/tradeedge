# Architektúra TradeEdge Academy

## Vysoká úroveň

```
┌──────────────┐     HTTPS     ┌──────────────┐     SQL     ┌────────────┐
│  Frontend    │ ────────────► │   Backend    │ ──────────► │ PostgreSQL │
│ (HTML/JS app)│ ◄──────────── │  Express API │ ◄────────── │            │
└──────┬───────┘   JSON / JWT  └──────┬───────┘             └────────────┘
       │                              │
       │ signed URL                   │ Stripe API
       ▼                              ▼
┌──────────────┐                ┌────────────┐
│ Video provider│               │   Stripe   │
│ (Mux/Bunny)  │                │            │
└──────────────┘                └────────────┘
```

## Auth tok

1. Užívateľ sa zaregistruje → `POST /api/auth/register` → uložíme `password_hash` (bcrypt) → JWT
2. Login → `POST /api/auth/login` → JWT v `Authorization: Bearer <token>` header
3. Každý paywallovaný request prejde cez `requireAuth` + `requireSubscription('pro')`

## Paywall tok

1. Užívateľ klikne *Pro / Mentoring* na pricing
2. FE volá `POST /api/payments/checkout` → backend vytvorí Stripe Checkout Session → vráti URL
3. Po platbe Stripe pošle webhook `checkout.session.completed` → upsert do `subscriptions`
4. Užívateľov `tier` sa nastaví na `pro` / `mentoring`
5. Pri každom premium endpointe paywall middleware kontroluje aktívnu subscription

## Video tok

1. FE žiada `GET /api/videos/:id/playback`
2. Backend overí auth + subscription
3. Backend získa od providera **short-lived signed URL** (5-15 min)
4. FE prehráva cez HLS player (hls.js / native Safari)
5. Periodicky `POST /api/videos/:id/progress` na uloženie `seconds_watched`

## Prečo nie self-hosted video

- Bandwidth = drahý
- Nemáme DRM ani signed URLs zadarmo
- Mux/Bunny/Cloudflare Stream poskytujú HLS, signed playback, transkódovanie a CDN

## Deployment (plán)

- **FE**: Vercel / Netlify / Cloudflare Pages (statika)
- **BE**: Railway / Render / Fly.io (Node)
- **DB**: Neon / Supabase / Railway Postgres
- **Video**: Mux (najjednoduchší DX) alebo Bunny Stream (lacnejší)
- **Email**: Resend
