# Folio — Architecture & Design Specification

> This document is the single source of truth for the Folio codebase.
> Read this first. It contains everything needed to understand the project without reading individual source files.

---

## 1. Project Overview
Folio is a premium, minimalist platform for personal character analysis and long-form reading. It emphasizes intellectual depth, typography-first design, and cinematic editorial layouts. No images are used on the home page — visual hierarchy comes purely from font size, weight, and spacing.

### Tech Stack
- **Framework**: Astro (latest)
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4 (Utility-first) + custom CSS in `global.css`
- **Content**: MDX (Astro Content Collections)
- **Typography**: Fontsource (Self-hosted) — Playfair Display, Merriweather, Inter
- **Icons**: None (Icon-free by design)
- **JS Policy**: Zero client JS except home page filters, character page progress bar, and back-to-top button

---

## 2. Project Structure

```text
.
├── astro.config.mjs
├── package.json
├── public/
│   ├── logo.png                # Brand logo (used in navbar + favicon)
│   └── characters/             # Hero images (optional, unused currently)
├── src/
│   ├── components/
│   │   ├── NavBar.astro        # Sticky blur navbar — logo.png + "Folio" wordmark
│   │   ├── PrevNext.astro      # Two-column prev/next footer with divider
│   │   ├── RatingBadge.astro   # Minimal numeric rating display
│   │   └── TagPill.astro       # Metadata tag styling
│   ├── content/
│   │   ├── characters/         # MDX analysis files (10 currently)
│   │   └── config.ts           # Zod schema definitions
│   ├── layouts/
│   │   ├── BaseLayout.astro    # HTML shell (Fonts, Favicon, ViewTransitions)
│   │   └── CharacterLayout.astro # Article wrapper + progress bar + back-to-top
│   ├── pages/
│   │   ├── index.astro         # "Table of Contents" home page
│   │   └── characters/
│   │       └── [slug].astro    # Dynamic character routing
│   ├── styles/
│   │   └── global.css          # Design tokens, ToC styles, prose, PrevNext, progress bar
│   └── utils/
│       ├── characters.ts       # Name/slug/description extraction from MDX
│       └── composition.ts      # LEGACY — old grid composition engine (unused, kept for reference)
└── tsconfig.json
```

---

## 3. Design System

### Color Palette (`global.css :root`)
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0d0d0d` | Deep black background |
| `--bg-surface` | `#141414` | Card/elevated surface |
| `--bg-elevated` | `#1c1c1c` | Hover states, back-to-top button |
| `--border` | `#242424` | Borders |
| `--divider` | `#1a1a1a` | Section dividers |
| `--text-primary` | `#e8e8e2` | Main text (off-white) |
| `--text-muted` | `#8b8b84` | Secondary text |
| `--text-subtle` | `#5e5e58` | Tertiary text (index numbers) |
| `--accent` | `#c9a84c` | Muted gold — underlines, progress bar, hover states |
| `--accent-dim` | `#8a6f2e` | Dimmed gold for borders |

### Typography Stack
1. **Playfair Display** (`--font-display`): Hero titles, character names, blockquotes, prev/next names.
2. **Merriweather** (`--font-body`): Long-form prose reading.
3. **Inter** (`--font-ui`): UI elements, metadata, navigation, filters, labels.

### Motion
- **Primary easing**: `cubic-bezier(0.16, 1, 0.3, 1)` — cinematic ease-out
- **Hover physics**: Subtle `translateX(12px)` shifts, opacity fades, gold underline animations
- **Page entry**: Staggered `toc-reveal` keyframe on home page (per-entry delay via `--entry-index`)

### Texture
- `body::before` applies a fixed grunge texture overlay at 2.6% opacity using `mix-blend-mode: soft-light`

---

## 4. Home Page — Table of Contents (`index.astro`)

The home page is a **vertical stack of full-width typographic rows**. No cards, no grid, no images.

### Data Flow
1. `getCollection("characters")` fetches all 10 MDX entries
2. **Fisher-Yates shuffle** using `Math.random()` — order changes every page render (dev) or build (production)
3. **Tier assignment by shuffled position** (not by character identity):
   - Index 0–1 → `hero` tier
   - Index 2–4 → `emphasis` tier
   - Index 5+ → `subdued` tier
4. Each entry gets a zero-padded index number (`01`–`10`)

### Visual Hierarchy (tier → font size)
| Tier | Desktop Size | Mobile Size |
|------|-------------|-------------|
| `hero` | `clamp(2.4rem, 4.5vw, 4.5rem)` | `clamp(2rem, 8vw, 2.8rem)` |
| `emphasis` | `clamp(1.6rem, 3vw, 3rem)` | `clamp(1.4rem, 6vw, 2rem)` |
| `subdued` | `clamp(1.2rem, 2.2vw, 2.2rem)` | `clamp(1.1rem, 4.5vw, 1.5rem)` |

### Entry Anatomy
```
[index]  [name]                    ← Playfair Display, tier-sized
         [series · rating/10]     ← Inter uppercase, hidden until hover
─────────────────────────────────  ← 1px gold underline, animates L→R on hover
```

### Hover Behavior
- Name shifts right `12px`
- Subtext (series/rating) fades in with `translateY` animation
- Gold underline grows from `width: 0` to `width: 100%`
- Index number turns gold, opacity 0.5 → 1
- Subdued names lift from `--text-muted` to `--text-primary`
- Hero names get a subtle gold `text-shadow` glow

### Filters
- Type-based tabs appear when characters have more than one `type` value
- Uses `data-character-type` attributes and `.filter-tab.active` class toggling
- Client-side JS (`is:inline` script), re-initializes on `astro:page-load`

---

## 5. Character Detail Page (`CharacterLayout.astro` + `[slug].astro`)

### Header
- **With cover image**: Full-bleed hero image (50–60vh) with gradient fade to `--bg-base`, name overlaid at bottom
- **Without cover image** (current default): Name as massive Playfair Display heading, optional series label below, "← Back" link (desktop only)

### Content Section
- Divider + optional tags/rating bar + divider
- Optional spoiler warning
- `<article class="prose">` wrapping the rendered MDX `<Content />`

### Prose Styling (`.prose` in `global.css`)
- Max-width `680px`, Merriweather at 17px, line-height 1.75
- `h2`: Playfair Display, `clamp(1.8rem, 3vw, 2.4rem)`
- `h3`: Inter uppercase, 0.95rem, muted color, 0.12em tracking
- `blockquote`: **Pull quote style** — Playfair Display italic, 1.15em, 3px gold left border, generous vertical margin
- `pre` blocks: Transparent background, monospace, `--text-muted` color (for ASCII diagrams)
- `hr`: 1px `--divider` color

### Reading Progress Bar
- Fixed 2px bar at absolute top of viewport (`z-index: 100`)
- Gold gradient fill, driven by `scaleX()` transform (GPU-accelerated)
- Updated via passive `scroll` event listener
- Character pages only (lives in `CharacterLayout.astro`)

### Back-to-Top Button
- Fixed bottom-right, 40px circle with `↑` arrow
- Hidden by default (`opacity: 0`, `pointer-events: none`)
- Appears (`.visible` class) after scrolling past first viewport height
- Smooth-scrolls to top on click
- Hover: gold accent color + border

### Prev/Next Footer (`PrevNext.astro`)
- Three-column grid: `[prev] [divider] [next]`
- Each column has a muted "Previous"/"Next" label (Inter uppercase, 0.7rem) above the character name (Playfair, 1.2rem)
- Center divider is a 1px vertical `--divider` line
- Mobile: stacks vertically, divider becomes horizontal

---

## 6. Content Authoring (MDX)

### Schema (`content.config.ts`)
```typescript
{
  name: z.string().optional(),        // Display name override
  series: z.string().optional(),      // Source material label
  type: z.enum(["anime", "manga", "comics", "game"]).optional(),
  rating: z.number().min(0).max(10).optional(),
  tags: z.array(z.string()).optional(),
  cover: z.string().optional(),       // Hero image path
  spoilers: z.boolean().optional()    // Triggers spoiler warning
}
```

### Name Resolution (`characters.ts`)
Names are extracted in priority order:
1. `data.name` from frontmatter (if set)
2. First `# Heading` in the MDX body (text before any `—`, `–`, `-`, or `:` delimiter)
3. Filename with hyphens replaced by spaces (fallback)

### MDX Conventions
- **No frontmatter required** — files can start directly with `# Name`
- **ASCII diagrams** must use `<pre>` with transparent styling and `{` backtick `}` template literals:
  ```html
  <pre style="background: transparent; border: none; overflow-x: auto; font-family: monospace; color: var(--text-muted); font-size: 0.85em;">
  {`DIAGRAM CONTENT HERE`}
  </pre>
  ```
  The `{` backtick `}` wrapper is **critical** — bare text inside `<pre>` in MDX will have newlines stripped.

---

## 7. Component Reference

### NavBar (`NavBar.astro`)
- Sticky header with backdrop blur (`blur(12px)`) and semi-transparent `--bg-base`
- Logo (`/logo.png`, height `h-11` = 44px) + "Folio" wordmark in Playfair Display
- Logo opacity fades to 80% on hover

### BaseLayout (`BaseLayout.astro`)
- HTML shell with meta tags, font imports (6 weights across 3 families), favicon (`/logo.png`), and `<ClientRouter />` for ViewTransitions
- Wraps `<NavBar />` + `<main><slot /></main>`

### RatingBadge / TagPill
- Minimal presentation components. RatingBadge shows a numeric value. TagPill shows an uppercase metadata label.

---

## 8. Guidelines for AI Maintenance

1. **Read this document first** before exploring source files. It covers all architectural decisions.
2. **Maintain Zero-JS default**: Astro components only. Client-side JS is limited to: home page filters, character page progress bar, and back-to-top button. All use `is:inline` scripts.
3. **Typography first**: If a design problem arises, solve it with font size, weight, spacing, or opacity before adding boxes, borders, or icons.
4. **Respect negative space**: The home page intentionally uses generous padding between entries. Don't compress it.
5. **Tier assignment is positional**: Home page tiers come from shuffled index position, NOT from character identity. No character "owns" a tier.
6. **Conditional rendering**: Every optional frontmatter field must be null-checked. Never render an empty placeholder.
7. **ViewTransitions**: All scripts must re-initialize on `astro:page-load` event for Astro's `<ClientRouter />` to work across page navigations.
8. **`composition.ts` is legacy**: The old grid composition engine is kept for reference but is not imported anywhere. Don't use it.
9. **Fonts are self-hosted** via `@fontsource/*` packages imported in `BaseLayout.astro`. No Google Fonts CDN calls.
10. **Logo**: `public/logo.png` is used in both the navbar and as the favicon. Reference it as `/logo.png` in markup.
