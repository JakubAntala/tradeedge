/**
 * Course catalog + lessons.
 * Public catalog endpoints can return locked metadata without paid content.
 */
exports.listCourses = async (_req, res) => {
  // TODO: SELECT slug, title, description, thumbnail, tier FROM courses
  res.json({ courses: [] });
};

exports.getCourse = async (req, res) => {
  // TODO: load course by slug (+ lesson list with `locked` flags for non-subscribers)
  res.json({ course: null, slug: req.params.slug });
};

exports.listLessons = async (_req, res) => res.status(501).json({ error: 'TODO: listLessons' });
exports.getLesson   = async (_req, res) => res.status(501).json({ error: 'TODO: getLesson' });
