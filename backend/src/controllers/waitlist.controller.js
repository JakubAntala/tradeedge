/**
 * Waitlist signup used by the landing page hero + footer CTA.
 */
const db = require('../config/database');

exports.join = async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  // TODO: INSERT INTO waitlist (email, source, ip, ua, created_at) ON CONFLICT DO NOTHING
  // For now just echo:
  res.json({ ok: true, email });
};

exports.count = async (_req, res) => {
  // TODO: SELECT count(*) FROM waitlist
  res.json({ count: 47 });
};
