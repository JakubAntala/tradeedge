const router = require('express').Router();
const c = require('../controllers/waitlist.controller');

router.post('/',      c.join);
router.get('/count',  c.count);

module.exports = router;
