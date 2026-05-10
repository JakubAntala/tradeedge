# Content / Courses

Sem patrí **zdrojový materiál kurzov** — pred tým než sa nahrá do DB.

Štruktúra (návrh):

```
content/courses/
├── 01-price-action-playbook/
│   ├── course.json             # metadáta (title, slug, tier, thumbnail)
│   ├── 01-uvod.md              # lekcia 1 (markdown body)
│   ├── 02-setup-pravidla.md
│   └── ...
├── 02-risk-management/
│   ├── course.json
│   └── ...
└── ...
```

`course.json` príklad:

```json
{
  "slug": "price-action-playbook",
  "title": "Price Action Playbook",
  "description": "Kompletná stratégia — vstupy, výstupy, setup pravidlá.",
  "thumbnail": "thumbnails/price-action.jpg",
  "required_tier": "pro",
  "lessons": [
    { "slug": "uvod",          "title": "Úvod",            "video": "vid_abc123" },
    { "slug": "setup-pravidla","title": "Setup pravidlá",  "video": "vid_def456" }
  ]
}
```

Videá sa nahrávajú k providerovi (Mux/Bunny) → ID sa uloží do `videos` tabuľky → lekcia
referencuje `video_id`.
