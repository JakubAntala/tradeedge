# API – plánované endpointy

Base URL: `/api`

## Auth
| Method | Path                | Auth | Popis                       |
|--------|---------------------|------|-----------------------------|
| POST   | `/auth/register`    | –    | nový účet (email + heslo)   |
| POST   | `/auth/login`       | –    | login → JWT                 |
| POST   | `/auth/logout`      | –    | klient maže token           |
| GET    | `/auth/me`          | ✓    | aktuálny užívateľ           |

## Users
| Method | Path                  | Auth | Popis                    |
|--------|-----------------------|------|--------------------------|
| GET    | `/users/me`           | ✓    | profil                   |
| PATCH  | `/users/me`           | ✓    | update profilu           |
| GET    | `/users/progress`     | ✓    | progres všetkých lekcií  |

## Courses
| Method | Path                                | Auth | Paywall | Popis                            |
|--------|-------------------------------------|------|---------|----------------------------------|
| GET    | `/courses`                          | opt  | –       | verejný katalóg                  |
| GET    | `/courses/:slug`                    | opt  | –       | detail (lekcie s `locked` flagom)|
| GET    | `/courses/:slug/lessons`            | ✓    | pro     | zoznam lekcií                    |
| GET    | `/courses/:slug/lessons/:lessonId`  | ✓    | pro     | obsah lekcie                     |

## Videos
| Method | Path                            | Auth | Paywall | Popis                          |
|--------|---------------------------------|------|---------|--------------------------------|
| GET    | `/videos/:id/playback`          | ✓    | pro     | signed playback URL            |
| POST   | `/videos/:id/progress`          | ✓    | pro     | uloženie progresu              |

## Payments
| Method | Path                       | Auth | Popis                         |
|--------|----------------------------|------|-------------------------------|
| POST   | `/payments/checkout`       | ✓    | Stripe Checkout Session       |
| POST   | `/payments/portal`         | ✓    | Stripe Customer Portal        |
| POST   | `/payments/webhook`        | –    | Stripe webhook (raw body)     |

## Waitlist
| Method | Path                | Auth | Popis                             |
|--------|---------------------|------|-----------------------------------|
| POST   | `/waitlist`         | –    | pridanie e-mailu z landing page   |
| GET    | `/waitlist/count`   | –    | počet ľudí (pre live counter)     |
