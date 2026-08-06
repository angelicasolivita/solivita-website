# Solivita Website

Static HTML/CSS/JS site for Solivita Assisted Living, adapted from a Press & Palm (Showit "Aurea" template) mirror. Deployed via Vercel as a static site — no build step required.

## Status: work in progress — placeholder content still in use

**Before this ships to production, replace:**
- All photography in `images/` — currently the original Press & Palm reference site's photos (tulip bouquets, the "aurea" branding, the "jane smith" contact card mockup). None of this is licensed for Solivita and must be swapped for real Solivita photography.
- **The entire footer is untouched Press & Palm content** — their script-logo image, "Press & Palm is a soul-led brand design studio led by Andrea" bio copy, `andrea@pressandpalm.com`, and nav links to their own Portfolio/Blog pages. This needs a full rewrite pass: Solivita contact info, real footer nav (or remove links that don't apply), Solivita logo lockup, appropriate copy. Not started yet.
- Any remaining "Aurea" / Press & Palm copy not yet caught in a pass — search `index.html` for stray references.

All Press & Palm CDN dependencies have been resolved — every image, font, and stylesheet is
downloaded and served locally from this repo (verified 2026-08-06: 0 external requests on page
load + full scroll). The footer's remaining Press & Palm *content* (copy/links/logo) still needs
the rewrite described above — that's a content problem, not an asset-loading one.

## Structure

```
solivita-website/
├── index.html              the site (single page for now)
├── mirror.js                custom JS: nav menu toggle, hero parallax
├── css/                     stylesheet (Showit engine CSS, includes design tokens)
├── fonts/                   webfonts (KT Quantum Light, Mattone, DM Mono, DM Sans)
├── images/                  photos + logo/ subfolder for the site's active logo files
│   └── logo/                the two logo files actually referenced by index.html
├── brand-assets/            full brand kit — NOT loaded by the site, reference only
│   ├── logos/
│   │   ├── primary/          "SOLIVITA / ASSISTED LIVING" wordmark, all 9 brand colors
│   │   ├── secondary/        stacked "SOLI / VITA" wordmark, all 9 brand colors
│   │   └── submark/          "SV" monogram, all 9 brand colors
│   └── guidelines/
│       ├── Solivita Brand Guidelines (3).pdf
│       └── Solivita_ Website Copy v1.md
└── scripts/                  (empty) — build/capture tooling lived here during the
                               original clone process, not needed for the live site
```

## Brand colors (from brand-assets/guidelines)

| Name | Hex |
|---|---|
| Horizon | `#3D6B8E` |
| Shoreline | `#7A9BB5` |
| Mist | `#B0C4D8` |
| Driftwood | `#5F5143` |
| Sand | `#C8B89A` |
| Linen | `#EDE7DC` |
| Sunlight | `#FFFCF6` |

## Fonts

- **KT Quantum Light** — display/headline serif (logo wordmark, hero headline, section headings)
- **Mattone** — secondary display face
- **DM Mono** — button/label text (uppercase, letter-spaced)
- **DM Sans** — body copy

## Logo usage in the live site

`index.html` currently references two files from `images/logo/`:
- `solivita-primary-black.svg` — hero headline (replaces the "SOLIVITA" text)
- `solivita-submark-black.svg` — nav header (replaces "PRESS & PALM")

Both are the **Black** color variant. To swap to a different brand color, copy the matching
file from `brand-assets/logos/primary/` or `brand-assets/logos/submark/` into `images/logo/`
and update the color name in the filename + the `<img src>` reference in `index.html`.

## Local development

No build step. Serve the folder with any static file server:

```bash
npx serve . -p 5174
open http://localhost:5174
```

## Deploying to Vercel

This is a static site — Vercel will auto-detect it with no framework preset needed.
1. Push this repo to GitHub
2. Import the repo in Vercel
3. Framework Preset: **Other** (or "No Framework")
4. Build Command: (leave blank)
5. Output Directory: `.` (root)

## Origin note

This site began as a local mirror of pressandpalm.com/aurea (a Showit template demo page),
built with Anthropic's website-clone workflow, then restyled with Solivita's brand assets,
copy, and layout adjustments. See `brand-assets/guidelines/` for the source brand guidelines
this restyle is based on.
