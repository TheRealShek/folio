# Folio

**Folio** is a premium, minimalist platform for personal character analysis and long-form reading. It emphasizes intellectual depth, typography-first design, and cinematic editorial layouts.

The project is designed to be a "Table of Contents" for mental models and decision systems, analyzing historical and fictional figures through a rigorous, systems-thinking lens.

## 🏛 Architecture & Philosophy

- **Typography First**: Visual hierarchy is driven by font size, weight, and spacing. No images are used on the home page.
- **Zero-JS Default**: Client-side JavaScript is strictly limited to essential UI interactions (filters, progress bars).
- **MDX-Powered**: Content is authored in MDX, allowing for structured data and custom ASCII diagrams.
- **Cinematic Motion**: Subtle, high-quality transitions and hover effects using GPU-accelerated transforms.

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build/) (v5+)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Design Tokens
- **Content**: MDX via Astro Content Collections
- **Typography**: Self-hosted via Fontsource (Playfair Display, Merriweather, Inter)

## 📂 Project Structure

- `src/content/characters/`: MDX analysis files for each character.
- `src/layouts/`: Base and Character-specific page shells.
- `src/components/`: Minimalist, reusable UI components.
- `src/styles/global.css`: Core design system, tokens, and prose styling.
- `Docs/`: Detailed architecture and content authoring specifications.

## 🚀 Getting Started

Ensure you have [Bun](https://bun.sh/) installed.

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

---

*Designed for those who value signal over noise.*
