# Folio — Architecture & Design Specification

> This document is the single source of truth for building Folio.
> Read it fully before writing a single line of code.
> **If any task involves UI or visual output — stop and show a written description or ASCII layout of what you plan to render. Wait for approval before coding it.**

---

## What Is Folio

A personal character analysis website. The owner writes opinions and breakdowns of fictional characters — anime, manga, comics, games, anything. Each character gets one Markdown file and one page. No backend. No database. No user accounts. Pure reading experience.

---

## Stack — Non-Negotiable

```
Framework:   Astro (latest)
Styling:     Tailwind CSS
Content:     MDX
Fonts:       Fontsource (self-hosted, NOT Google CDN)
Deployment:  Vercel
```

Do not introduce any other framework, library, or tool without explicit approval.
Do not use React components unless Astro components cannot achieve the same result.

---

## Project Structure — Follow Exactly

```
/src
  /content
    /characters
      *.mdx               ← one file per character, flat, no subfolders
  /layouts
    BaseLayout.astro      ← html shell, fonts, meta
    CharacterLayout.astro ← wraps individual character pages
  /pages
    index.astro           ← character index grid
    /characters
      [slug].astro        ← dynamic route, reads MDX frontmatter
  /components
    CharacterCard.astro
    TagPill.astro
    RatingBadge.astro
    NavBar.astro
    PrevNext.astro
  /styles
    global.css            ← CSS custom properties only, no component styles here

/public
  /characters             ← cover images, named same as slug (e.g. zoro.jpg)
```

---

## Content Schema

Only `name` is required. Every other field is optional.
Components must render conditionally — if a field is absent, render nothing. No placeholders, no "Unknown", no empty boxes.

```yaml
---
name: "Roronoa Zoro" # required — string
series: "One Piece" # optional — string
type: anime # optional — anime | manga | comics | game
rating: 9.2 # optional — float 0–10
tags: [swordsman, loyalty] # optional — array of strings
cover: /characters/zoro.jpg # optional — path string
spoilers: true # optional — boolean, shows warning banner if true
---
```

---

## Design System

### Colors

Define all colors as CSS custom properties in `global.css`. Never hardcode hex values in components — always reference variables.

```css
:root {
  --bg-base: #0d0d0d;
  --bg-surface: #141414;
  --bg-elevated: #1c1c1c;
  --border: #242424;
  --divider: #1a1a1a;

  --text-primary: #e8e8e2;
  --text-muted: #5a5a5a;
  --text-subtle: #3a3a3a;

  --accent: #c9a84c;
  --accent-dim: #8a6f2e;
}
```

**Accent color rules — enforced strictly:**

- Use accent ONLY on: ratings, active filter tab underline, inline text links, card hover border
- Do not use accent as a background fill anywhere
- Do not use accent on more than one element per visual "zone"
- No gradients anywhere on the page except the cover image overlay on character pages

### Typography

Install via Fontsource. Import in `BaseLayout.astro`.

```
@fontsource/playfair-display   → headings, character names, hero text
@fontsource/merriweather       → all body prose, long-form reading
@fontsource/inter              → UI only: nav, tags, meta, labels, buttons
```

**Font role rules — strict:**

- Playfair Display: `h1` only, character name display, site name in nav. Nowhere else.
- Merriweather: all `p`, `h2`, `h3` inside prose body. Nowhere else.
- Inter: everything outside prose — nav links, tag pills, rating, meta text, back button, filter tabs.

**Readability settings — apply globally to prose:**

```css
.prose {
  font-family: var(--font-body); /* Merriweather */
  font-size: 17px; /* desktop */
  font-weight: 500; /* bump one level — text thins on dark bg */
  line-height: 1.75;
  letter-spacing: 0.015em;
  max-width: 680px;
  margin-inline: auto;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .prose {
    font-size: 15px;
  }
}
```

**Heading styles inside prose:**

- `h2` → Playfair Display, used for major section breaks in analysis
- `h3` → Inter, `var(--text-muted)`, used for sub-sections

**Blockquote style:**

- Left border: 2px solid `var(--accent)`
- Left padding: 1rem
- Italic Merriweather
- No background fill, no box behind it

---

## Layout Specifications

### Nav Bar

- Sticky, top-fixed
- Background: `var(--bg-base)` at 80% opacity + `backdrop-filter: blur(12px)`
- Left: site name "Folio" in Playfair Display
- Right: nav links in Inter (e.g. About — add only if page exists)
- No border on nav. Separation comes from scroll context alone.
- Mobile: collapse links into hamburger → full-screen overlay, dark bg, large touch targets (min 44px)

### Index Page

Character grid with responsive columns:

```
Desktop (≥1024px): 3 columns
Tablet  (≥640px):  2 columns
Mobile  (<640px):  1 column
```

**Card design:**

- Background: `var(--bg-surface)`
- Border: 1px solid `var(--border)`
- No border-radius, or max 4px — do not round aggressively
- No drop shadows by default
- Hover state: border color → `var(--accent-dim)`, translateY(-3px), bg → `var(--bg-elevated)`
- Transition: 200ms ease

**Card content — two variants:**

If `cover` is present:

```
[ cover image — 3:4 ratio, object-fit: cover ]
[ name — Playfair Display ]
[ series — Inter, muted ] [ rating — accent color ]
```

If `cover` is absent (text-only card):

```
[ large name — Playfair Display, very large, left-aligned ]
[ series — Inter, muted ]
[ rating — if present ]
```

Text-only cards are not a fallback — they are a first-class design variant. Style them to look intentional, not empty. The name carries the visual weight.

**Filter bar** (render only if more than one `type` exists across all characters):

- Horizontal scroll on mobile
- Tab style: underline only on active — no filled pill, no box around tabs
- Font: Inter, small, muted when inactive

### Character Page

```
[ Full-width cover image — height: 60vh desktop / 50vh mobile ]
[ Gradient overlay: transparent → var(--bg-base), bottom 40% of image ]
[ Character name — Playfair Display, large, overlaid on gradient zone ]
[ Series — Inter, muted, below name ]

─── thin divider ──────────────────────────────────────

[ Tag pills — if present ]            [ Rating badge — if present ]

─── thin divider ──────────────────────────────────────

[ Prose body — max-width 680px, centered, Merriweather ]

─── thin divider ──────────────────────────────────────

[ ← Previous Character ]          [ Next Character → ]
```

If `cover` is absent: skip the image zone entirely. Start page directly with name + series as a text header, then prose. Do not render an empty image container.

If `spoilers: true`: render one line of warning text above prose. Inter, `var(--text-muted)`. No colored box, no icon, no border around it.

---

## Strict Design Rules

These are non-negotiable. Violating any of these requires a redesign, not a patch.

### Anti-Patterns — Never Do These

1. **No box-in-box layouts.** Do not nest a card inside a card, a panel inside a panel, or a decorative container inside another container. If you find yourself adding a wrapper div solely to create visual depth — stop. Use whitespace, typography scale, or color contrast instead.

2. **No decorative containers around prose.** The character analysis text lives in open space on the page background. No background box behind it. No bordered "article" wrapper. No "paper" effect.

3. **No badge clusters.** Do not group rating + series + type + tags all into a uniform row of identical filled pills. Each piece of metadata has its own place and its own distinct style.

4. **No gradient backgrounds on the page.** Gradients exist only on the cover image overlay. Nowhere else. Not on hero sections, not on the nav, not on cards.

5. **No colored section backgrounds.** Do not alternate section backgrounds between `--bg-base` and `--bg-surface` for visual rhythm. Use `--divider` lines and whitespace instead.

6. **No icon-first design.** Do not add icons to nav items, tags, or metadata labels. If an icon appears, it carries functional meaning — not decoration.

7. **No AI default animations.** No bounce, pulse, spin, float, or slide-in effects. Permitted animations only: `opacity 0→1` + `translateY(8px→0)` on page load via Astro view transitions. Cards get `translateY(-3px)` on hover only.

8. **No filler states.** If a field is missing, render nothing. No "No series listed". No empty star rows. No grey placeholder image rectangle.

9. **Do not apply prose styles via Tailwind utilities inline.** All prose styling lives in `.prose` in `global.css`. Tailwind is for layout, spacing, and responsive breakpoints only.

10. **No multi-column footer.** If a footer exists, it is one line: "Folio · [year]". Nothing else.

---

## Responsive Rules

- Minimum tap target: 44×44px on all interactive elements
- Font size: never below 14px on mobile for any readable text
- Filter bar on mobile: `overflow-x: auto`, scrollbar hidden visually with CSS
- Cover image: `height: 50vh` mobile, `60vh` desktop
- Prose padding: `px-6` mobile, `px-0` desktop (max-width handles centering)
- Nav links hidden on mobile, behind hamburger — never horizontally squeezed

---

## Astro-Specific Instructions

- Use Astro content collections for `/characters` — do not use `import.meta.glob` manually
- Use `getCollection('characters')` on index page to build the grid
- Use `getStaticPaths` + `getEntry` on `[slug].astro` for character pages
- Enable `<ViewTransitions />` in `BaseLayout.astro` for page-load fade animation
- Use Astro's `<Image />` component for cover images — not plain `<img>`
- Do not ship client-side JS unless absolutely required. Prefer zero-JS Astro components.

---

## Pre-Coding Checklist

Before writing any component, answer all of these:

- [ ] Does this component touch the UI? → Write an ASCII layout or written description first. Wait for approval.
- [ ] Does this component render optional fields? → Every optional field must have an explicit absent-case that renders nothing.
- [ ] Am I adding a wrapper div for visual decoration? → Remove it.
- [ ] Am I hardcoding a color value? → Replace with the correct CSS variable.
- [ ] Am I adding a new dependency? → Stop. Ask first.
- [ ] Does this work at 375px viewport width? → Verify before writing.

---

## Build Order

Build in this sequence. Do not skip ahead or build components speculatively.

1. `BaseLayout.astro` — font imports, CSS variable injection, meta shell
2. `global.css` — all CSS custom properties, prose styles, divider styles
3. `CharacterCard.astro` — both variants (cover present + text-only)
4. `index.astro` — grid layout, collection query, filter bar
5. `CharacterLayout.astro` — character page shell
6. `[slug].astro` — dynamic route, wired to MDX content
7. `NavBar.astro` — sticky nav, mobile hamburger
8. `PrevNext.astro` — prev/next character navigation
9. Astro view transitions — added last, after all layouts are confirmed

---

## Definition of Done

- Mobile (375px): no horizontal overflow, text readable, all tap targets reachable
- Desktop: prose centered at 680px, generous whitespace on both sides
- Removing the accent color entirely leaves a fully functional, readable site
- No element looks like it was added to fill space
- Each character page reads like a personal essay — not a data card, not a wiki infobox
