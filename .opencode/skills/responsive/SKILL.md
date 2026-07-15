---
name: responsive
description: Use when building responsive layouts, breakpoints, media queries, fluid sizing, mobile-first design, responsive navigation, responsive images, or testing across viewport sizes.
---

# Responsive Design

## Philosophy

Start at the smallest screen (~375px) and add complexity as space allows. Never "shrink down" desktop — always "scale up" mobile. Every layout decision asks: does this break at 375px? At 768px? At 1280px?

## Breakpoint system

Only include breakpoints the design actually needs. Do not dump all four into every stylesheet.

```
/* Mobile-first base (no query) — 0 to 479px */

@media (min-width: 480px)  { /* small tablet */ }
@media (min-width: 768px)  { /* tablet landscape / small desktop */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1280px) { /* wide desktop, cap max-width here */ }
```

## Fluid sizing with clamp()

Prefer `clamp()` over discrete breakpoints for type and spacing. The formula:

```
clamp(min, preferred, max)
```

Where `preferred` is a `vw` value that scales between `min` and `max`. Common patterns:

```css
/* Fluid type: 18px at 375px, scales to 24px at 1280px */
font-size: clamp(1.125rem, 0.767rem + 1.53vw, 1.5rem);

/* Fluid spacing: 16px at base, 48px at wide */
padding: clamp(1rem, -0.571rem + 6.7vw, 3rem);

/* Heading that never shrinks below 2rem or grows past 4rem */
font-size: clamp(2rem, 5vw, 4rem);
```

Shortcut: when precision isn't critical, use `clamp(min, 5vw, max)` for headings and `clamp(1rem, 3vw, 2rem)` for section padding. Tune per element.

## Layout patterns

### Column grid (1 → 2 → 3 → 4)

```css
.grid {
  display: grid;
  gap: clamp(1rem, 3vw, 2rem);
  grid-template-columns: 1fr;
}
@media (min-width: 480px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px)  { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(4, 1fr); } }
```

### Auto-fit (no breakpoints needed)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

This handles responsiveness without a single media query. Preferred for card grids, galleries, and feature sections.

### Sidebar + content

```css
.layout {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
}
@media (min-width: 768px) {
  .layout {
    grid-template-columns: 280px 1fr;
  }
}
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 320px 1fr;
  }
}
```

### Centered content with max-width

```css
.container {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}
```

Always `100% - 2rem` (1rem padding per side on mobile), never a fixed width below the max.

## Navigation

### Fewer than 5 links
Inline the links, let them wrap naturally. No hamburger.

### 5+ links
Hide nav behind a `<button>` toggle at mobile widths. The button opens/closes a `<nav>` with `display: none/block` or `visibility` + `max-height` transition.

```html
<button aria-expanded="false" aria-controls="nav-list" class="nav-toggle">
  Menu
</button>
<nav id="nav-list" hidden>
  <ul><!-- links --></ul>
</nav>
```

At the desktop breakpoint, reveal nav inline and hide the toggle button via `display: none`.

### Never do
- Off-screen menus that slide from the left/right (heavy, bug-prone without JS framework)
- `overflow: hidden` on `<body>` for open menus (destroys scroll position)
- Hamburger on desktop
- Mobile nav that covers the entire viewport

## Responsive images

```html
<!-- Resolution switching -->
<img src="small.jpg"
     srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1280w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="..."
     loading="lazy">

<!-- Art direction (different crop at different sizes) -->
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <img src="tall.jpg" alt="...">
</picture>
```

Background images in CSS: serve the smallest version at mobile, swap via media query or `image-set()`.

## Typography per breakpoint

Shrink the type scale on mobile. Desktop headings often look absurd at 375px.

```css
h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); }
p  { font-size: clamp(1rem, 2vw, 1.125rem); }
```

Line height tightens slightly at wider widths (1.6 on mobile, 1.5 on desktop).

## Testing methodology

Before calling a layout done, test at each of these widths (use browser DevTools responsive mode):

| Width | Device |
|---|---|
| 375px | iPhone SE / small Android |
| 414px | iPhone 11 / medium Android |
| 768px | iPad portrait |
| 1024px | iPad landscape / small laptop |
| 1280px | Standard laptop |
| 1440px | Desktop monitor |

Also test:
- Rotate between portrait and landscape at 768px and 1024px
- 200% browser zoom — layout must not break
- Keyboard tab through all interactive elements — focus ring must be visible at every width

## Common mistakes to catch

- Horizontal scrollbar at any tested width
- Text running edge-to-edge with no padding on mobile
- Fixed-width elements wider than 375px (tables, code blocks, embeds — use `overflow-x: auto` on a wrapper)
- Sticky elements that cover content on short viewports (test at 375×667)
- `min-width` in a mobile-first stylesheet when you meant `max-width`
- Grid or flex gaps that dominate small screens — reduce gap proportionally on mobile
