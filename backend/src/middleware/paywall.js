/**
 * Paywall middleware.
 * Blocks access to premium content unless the user has an active subscription
 * with a sufficient tier.
 *
 * Usage:
 *   router.get('/lesson/:id', requireAuth, requireSubscription('pro'), handler)
 */
const TIER_RANK = { free: 0, pro: 1, mentoring: 2 };

function requireSubscription(minTier = 'pro') {
  return async function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Auth required' });

    // TODO: load user's active subscription from DB
    // const sub = await Subscription.findActiveByUserId(req.user.id);
    const userTier = req.user.tier || 'free';

    if ((TIER_RANK[userTier] ?? 0) < (TIER_RANK[minTier] ?? 99)) {
      return res.status(402).json({
        error: 'Subscription required',
        required: minTier,
        current: userTier,
      });
    }
    next();
  };
}

module.exports = { requireSubscription };
