# Solivita Website

Static HTML/CSS/JS site for Solivita Assisted Living. Deployed via Vercel as a static site — no build step required.

## Status: work in progress — placeholder content still in use

**Before this ships to production, replace:**
- Team photos in `images/about/` — the About page's Team section is a placeholder note until founder/caregiver photos and bios are available.
- The homepage's second parallax band uses a Solivita photo (`images/hero/hero-greenroom.jpg`); confirm it's the final choice before launch.

Room names, dimensions, and bathroom details in the "Our Rooms" carousel are
sourced from the facility's licensing spec sheet (Google Sheet, not in this repo)
and the floor plan sketch submitted with the facility license application. If
either changes, update the room cards in `index.html` to match — the source of
truth is the spec sheet, not this file.

## Structure

```
solivita-website/
├── index.html               homepage
├── about.html                mission, story, values, team
├── care-services.html        services & amenities detail
├── css/
│   └── styles.css            shared stylesheet — all 3 pages
├── js/
│   └── main.js                shared behaviors: nav glass-on-scroll,
│                               About/Care sticky-pin hero, parallax bands
├── images/
│   ├── hero/                  hero section photos, per page
│   ├── rooms/                 room carousel photos — Coronado, Del Mar,
│   │                           The Cove, La Jolla, Torrey Pines
│   ├── services/              Care & Services category photos
│   ├── about/                 founder/team photos (sparse, none yet)
│   ├── brand/                 logo (primary + submark SVGs)
│   └── ui/                    decorative graphics: wave/texture patterns,
│                               abstract coastline background
├── fonts/                     KT Quantum Light, Mattone, DM Sans (2 subsets)
├── brand-assets/               full brand kit — NOT loaded by the site,
│                                reference only (all color variants + guidelines PDF)
└── scripts/                   (empty) — build/capture tooling lived here
                                 during the original clone process, not
                                 needed for the live site
```

All three pages share `css/styles.css` and `js/main.js` — edit once, applies everywhere. No page has inline styles or scripts beyond that.

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
- **DM Sans** — body copy, nav, buttons (ships as 2 subset files per Google Fonts convention — `dm-sans-latin.woff2` + `dm-sans-latin-ext.woff2`, both declared under the same `font-family: 'DM Sans'`)

## Logo usage

Every page references `images/brand/`:
- `solivita-primary-black.svg` — full wordmark (homepage hero)
- `solivita-submark-black.svg` — nav + footer monogram

Both are the **Black** color variant. To swap to a different brand color, copy the matching file from `brand-assets/logos/primary/` or `brand-assets/logos/submark/` into `images/brand/` and update the `<img src>` references.

## Interactive behavior (js/main.js)

- **Nav glass-on-scroll** — transparent over the hero, blurred translucent card once scrolled past it. Runs on every page.
- **Sticky-pin hero "lift"** — About and Care & Services pages only. The hero switches to `position: fixed` once you scroll past it and never releases; the next section scrolls up over it. The homepage hero does NOT use this — it scrolls away normally, matching the original site's behavior.
- **Parallax image bands** — background photo drifts at roughly half the page's scroll speed. Used on the homepage (2 bands) via `.cs-parallax-band`.
- **FAQ accordion** — native `<details>`/`<summary>`, no JS needed.

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

This site began as a local mirror of pressandpalm.com/aurea (a Showit template demo page), built with Anthropic's website-clone workflow, then restyled with Solivita's brand assets, copy, and layout adjustments. In a later pass, all three pages were rebuilt from that Showit-generated markup into clean semantic HTML5 with a shared external stylesheet/script — see `brand-assets/guidelines/` for the source brand guidelines this restyle is based on.
