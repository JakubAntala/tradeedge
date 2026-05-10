/**
 * TradeEdge Academy — Backend entrypoint
 * Express server with auth, courses, videos, payments, waitlist.
 *
 * NOTE: This is the initial scaffold. Routes/controllers/models are stubs
 * and will be implemented step by step.
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4000;

/* ---------- Security & middleware ---------- */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Stripe webhook needs raw body — register BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '1mb' }));

// Basic global rate limit
app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 120 }));

/* ---------- Static frontend (dev convenience) ---------- */
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'public')));

/* ---------- API routes ---------- */
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/users',    require('./routes/users.routes'));
app.use('/api/courses',  require('./routes/courses.routes'));
app.use('/api/videos',   require('./routes/videos.routes'));
app.use('/api/payments', require('./routes/payments.routes'));
app.use('/api/waitlist', require('./routes/waitlist.routes'));
app.use('/api/trades',   require('./routes/trades.routes'));
app.use('/api/calendar', require('./routes/calendar.routes'));

/* ---------- Error handler ---------- */
app.use(require('./middleware/errorHandler'));

/* ---------- Start ---------- */
app.listen(PORT, () => {
  console.log(`▶ TradeEdge backend listening on http://localhost:${PORT}`);
});
