/**
 * Auth controller - register, login, logout, me.
 * TODO: implement against User model + JWT.
 */
exports.register = async (_req, res) => res.status(501).json({ error: 'TODO: register' });
exports.login    = async (_req, res) => res.status(501).json({ error: 'TODO: login' });
exports.logout   = async (_req, res) => res.json({ ok: true });
exports.me       = async (_req, res) => res.status(501).json({ error: 'TODO: me' });
