# Folio — Architecture & Design Specification

> This document is the single source of truth for the Folio codebase.
> It defines the technical structure, design philosophy, and compositional logic.

---

## 1. Project Overview
Folio is a premium, minimalist platform for personal character analysis and long-form reading. It emphasizes intellectual depth, typography-first design, and cinematic editorial layouts.

### Tech Stack
- **Framework**: Astro (latest)
- **Runtime**: Bun
- **Styling**: Tailwind CSS (Utility-first)
- **Content**: MDX (Astro Content Collections)
- **Typography**: Fontsource (Self-hosted)
- **Icons**: None (Icon-free by design)

---

## 2. Project Structure

```text
.
├── astro.config.mjs
├── package.json
├── public/
│   └── characters/           # Hero images (optional)
├── src/
│   ├── components/
│   │   ├── NavBar.astro      # Sticky blur navigation
│   │   ├── PrevNext.astro    # Footer navigation for character pages
│   │   ├── RatingBadge.astro # Minimal numeric rating
│   │   └── TagPill.astro     # metadata styling
│   ├── content/
│   │   ├── characters/       # MDX analysis files
│   │   └── config.ts         # Zod schema definitions
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Main shell (HTML, Fonts, ViewTransitions)
│   │   └── CharacterLayout.astro # Typography-focused analysis wrapper
│   ├── pages/
│   │   ├── index.astro       # The "Typographic Wall" (Home Page)
│   │   └── characters/
│   │       └── [slug].astro  # Dynamic character routing
│   ├── styles/
│   │   └── global.css        # Design tokens and Prose definitions
│   └── utils/
│       └── characters.ts     # Content helper logic
└── tsconfig.json
```

---

## 3. The Design System

### Color Palette (global.css)
- `--bg-base`: `#0d0d0d` (Deep black)
- `--text-primary`: `#e8e8e2` (Off-white, high contrast)
- `--text-muted`: `#8b8b84` (Mid-tone grey for secondary info)
- `--accent`: `#c9a84c` (Muted gold, used sparingly for authority)

### Typography Stack
1. **Playfair Display**: Hero titles, character names.
2. **Merriweather**: Long-form prose reading (Optimized for dark-mode legibility).
3. **Inter**: UI elements, metadata, navigation, filters.

---

## 4. The Typographic Wall (Index Page)

The home page has evolved from a grid of cards to a **Cinematic Typographic Wall**.

### Compositional Logic
- **Grid**: A 12-column system using `col-start` and `col-span` for precise but asymmetrical placement.
- **Rhythmic Flow**: The layout follows a diagonal "Visual Path" that guides the eye from top-left to bottom-right.
- **Hierarchy Tiers**:
  1. **Tier 1 (Hero)**: 1–2 dominant names. Massive scale, thin weight, serif. Anchors the page.
  2. **Tier 2 (Emphasis)**: 2–3 medium-scale names. Bridges the "Hero" zones.
  3. **Tier 3 (Subdued)**: Background grain. Small, low opacity, provides texture.
- **Negative Space**: "Voids" are intentionally injected into the grid to prevent clutter.

### Motion Design
- **Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (Cinematic ease-out).
- **Hover Physics**:
  - Tiny `translateY(-2px)` shift.
  - Subtle `letter-spacing` expansion/contraction.
  - Soft, restrained glow (`filter: drop-shadow`).
  - No aggressive scaling or bounce effects.

---

## 5. Content Authoring (MDX)

Characters are authored as MDX files with frontmatter.

### MDX Features
- **Diagrams/Models**: ASCII diagrams must be wrapped in a `<pre>` tag with transparent styling to avoid the "dark terminal box" look.
  ```html
  <pre style="background: transparent; border: none; overflow-x: auto; font-family: monospace; color: var(--text-muted); font-size: 0.85em;">
  ... [ASCII] ...
  </pre>
  ```
- **Prose Style**: Handled via a `.prose` utility in `global.css` targeting Merriweather at 17px with 1.75 line-height.

---

## 6. Guidelines for AI Maintenance

1. **Maintain Zero-JS**: Prefer Astro components. Client-side JS is only for the home page filters.
2. **Respect Negative Space**: Never attempt to "fill" the typographic wall. If it feels empty, it is likely intentional.
3. **Typography First**: If a design problem arises, solve it with font size, weight, or spacing before adding a box, border, or icon.
4. **Conditional Rendering**: Every optional field in the frontmatter must be checked. Never render an empty placeholder.
5. **View Transitions**: All page navigations should use the Astro `<ClientRouter />` for seamless cross-fades.
