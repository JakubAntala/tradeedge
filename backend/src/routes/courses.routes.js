const router = require('express').Router();
const c = require('../controllers/courses.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { requireSubscription } = require('../middleware/paywall');

// Public catalog (titles, descriptions, lock state)
router.get('/',          optionalAuth, c.listCourses);
router.get('/:slug',     optionalAuth, c.getCourse);

// Premium content
router.get('/:slug/lessons',
  requireAuth, requireSubscription('pro'), c.listLessons);

router.get('/:slug/lessons/:lessonId',
  requireAuth, requireSubscription('pro'), c.getLesson);

module.exports = router;
