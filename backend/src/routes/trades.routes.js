const router = require('express').Router();
const c = require('../controllers/trades.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { requireSubscription } = require('../middleware/paywall');

// Public — featured trades for landing page (top winners only).
router.get('/featured', optionalAuth, c.listFeatured);

// Public — aggregate stats (total trades, win rate, avg RR, most-traded pair).
router.get('/stats', optionalAuth, c.getStats);

// PAYWALLED — full feed with filters (pair, session, win, date range).
router.get('/', requireAuth, requireSubscription('pro'), c.listAll);
router.get('/:id', requireAuth, requireSubscription('pro'), c.getOne);

// Admin — manual trigger of the Notion sync (protect with admin role later).
router.post('/sync', requireAuth, c.triggerSync);

module.exports = router;
