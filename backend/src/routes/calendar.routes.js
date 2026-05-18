const router = require('express').Router();
const c = require('../controllers/calendar.controller');

// Public - used by /pages/calendar.html
// GET /api/calendar/events?range=today|tomorrow|week|next-week|month&impact=high|medium-high|all&tz=America/New_York
router.get('/events', c.listEvents);

module.exports = router;
