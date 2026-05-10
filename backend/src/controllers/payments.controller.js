/**
 * Stripe checkout + customer portal + webhook.
 */
exports.createCheckoutSession = async (_req, res) => res.status(501).json({ error: 'TODO: checkout' });
exports.createCustomerPortal  = async (_req, res) => res.status(501).json({ error: 'TODO: portal' });

exports.handleWebhook = async (_req, res) => {
  // TODO: verify signature, switch on event.type:
  // - checkout.session.completed → upsert subscription (tier=pro/mentoring, active=true)
  // - customer.subscription.updated / .deleted → flip active flag
  res.json({ received: true });
};
