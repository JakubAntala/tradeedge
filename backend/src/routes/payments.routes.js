const router = require('express').Router();
const c = require('../controllers/payments.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/checkout',  requireAuth, c.createCheckoutSession);
router.post('/portal',    requireAuth, c.createCustomerPortal);
router.post('/webhook',   c.handleWebhook); // raw body - see server.js

module.exports = router;
