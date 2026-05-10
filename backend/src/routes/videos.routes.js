const router = require('express').Router();
const c = require('../controllers/videos.controller');
const { requireAuth } = require('../middleware/auth');
const { requireSubscription } = require('../middleware/paywall');

// Returns a short-lived signed playback URL (Mux/Bunny/Cloudflare Stream).
// The actual video file is NEVER served from the same origin as the page.
router.get('/:videoId/playback',
  requireAuth, requireSubscription('pro'), c.getPlaybackUrl);

router.post('/:videoId/progress',
  requireAuth, requireSubscription('pro'), c.saveProgress);

module.exports = router;
