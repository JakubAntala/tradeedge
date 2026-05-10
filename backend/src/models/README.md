# Models

Data access layer. Each file wraps queries against one table.

Planned modules:

- `User.js` — accounts, password hash, role, tier, stripe_customer_id
- `Course.js` — slug, title, description, thumbnail, required tier, order
- `Lesson.js` — belongs to a course; title, body (markdown), video_id, duration, order
- `Video.js` — provider asset id, duration, thumbnail
- `Subscription.js` — user_id, stripe_subscription_id, tier, status, current_period_end
- `WaitlistEntry.js` — email, source, ip, user_agent
- `LessonProgress.js` — user_id, lesson_id, completed_at, seconds_watched
