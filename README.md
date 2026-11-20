# Waffle Truck — 3 demo websites

Vite + GSAP (ScrollTrigger) + Lenis. French. Local only, not deployed.

| Page | Style |
|---|---|
| `/` | Chooser with the 3 demos |
| `/01-cosmic-ovni/` | Night sky, neon, UFO burger landing, pinned bubble-waffle planet, horizontal drinks |
| `/02-golden-crunch/` | Cream & caramel, chocolate drip, live bubble-waffle builder, horizontal menu panels |
| `/03-street-truck-pop/` | Stickers, marquees, stacking menu cards, bubble-tea builder, open/closed badge, thumb bar |

## Run
```bash
npm install
npm run dev        # http://localhost:4184
npm run build      # -> dist/
npm run preview    # http://localhost:4185 (built version)
```
Or from the Claude app: launch config `waffle-demos` (dev) / `waffle-demos-dist`.

## Files
- `shared/menu.js` — **all prices** (one place for the 3 demos). Source: `../menu-waffle-truck.md`.
- `shared/info.js` — address, phone, hours, Maps link, review paraphrases. Source: `../business-info.md`.
- `shared/motion.js`, `shared/render.js` — smooth scroll, text split, reveals, counters, info filling.
- `public/img/` — images built by `tools/build_assets.py` from the owner's photos (run with `py` from `sites/waffle Truck`).
- `_qa/` — screenshots (desktop 1440, phone 390, reduced motion).

Every animation has a `prefers-reduced-motion` fallback (no pin, no scrub).
