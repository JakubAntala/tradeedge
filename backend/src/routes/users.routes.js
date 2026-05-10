const router = require('express').Router();
const c = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/me',        requireAuth, c.getMe);
router.patch('/me',      requireAuth, c.updateMe);
router.get('/progress',  requireAuth, c.getProgress);

module.exports = router;
