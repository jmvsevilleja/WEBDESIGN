---
name: frontend
description: Use when building or editing React components, shadcn/ui, Tailwind CSS, layouts, responsive design, forms, animations, accessibility, or any front-end code. Covers file conventions, shadcn/ui theming, CVA component patterns, and React/TypeScript conventions.
---

# Frontend (shadcn/ui + React + Tailwind v4)

## Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first config, `@theme` directives)
- **Components**: shadcn/ui v4 (copied into `components/ui/`, not an npm package)
- **Icons**: lucide-react
- **Primitives**: Radix UI (accessible, unstyled base components)
- **Build**: Vite or Next.js (project-dependent)

## File organization

```
src/
  components/
    ui/          # shadcn/ui components (button, card, dialog, etc.)
    layout/      # layout components (header, footer, sidebar)
    features/    # page-specific or domain components
  lib/
    utils.ts     # cn() utility (clsx + tailwind-merge)
  app/ or pages/ # routes (Next.js) or src/ (Vite)
  styles/
    globals.css  # Tailwind imports, @theme, CSS variables, @layer base
```

Component files: kebab-case filenames, PascalCase component names.

## shadcn/ui theming

### The CSS variable system

shadcn/ui uses CSS custom properties (in `oklch` or `hsl`) mapped to Tailwind utilities via `@theme inline`. Theme colors are semantic tokens, not literal color names. This is the single source of truth for the design.

**globals.css structure:**

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### How to theme a project

1. The design plan's palette maps to semantic tokens:
   - Brand color → `--primary` and `--primary-foreground`
   - Surface/background → `--background`, `--card`, `--popover`
   - Text → `--foreground`, `--muted-foreground`
   - Subtle surfaces → `--secondary`, `--muted`, `--accent`
   - Borders → `--border`
   - Focus ring → `--ring`
   - All "foreground" variants must have sufficient contrast against their base (4.5:1 minimum)

2. Convert design colors to `oklch()` values. Use `oklch()` not `hsl()` — it's perceptually uniform and maps better to human vision.

3. Define custom semantic tokens for project-specific needs (e.g., `--brand-accent`, `--success`, `--warning`) in both `:root` and `.dark`, then map them in `@theme inline`.

4. Never hardcode hex values in component className strings. Always reference semantic tokens: `bg-primary`, `text-muted-foreground`, `border-border`.

### Adding custom colors

```css
/* globals.css */
:root {
  --brand: oklch(0.55 0.18 250);
  --brand-foreground: oklch(0.98 0 0);
}

@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
}
```

Then use: `bg-brand text-brand-foreground`

## Component patterns

### cn() utility

Every project must have `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Always use `cn()` when merging or conditionally applying classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("flex items-center", isActive && "bg-primary text-primary-foreground")}>
```

Never use template literals for className logic.

### CVA for component variants

shadcn/ui components use `class-variance-authority` for typed variant systems:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Custom non-shadcn components

For bespoke components that don't come from shadcn/ui:

- Use the same CVA + cn() pattern for consistency
- Import Radix primitives for interactive elements (Dialog, DropdownMenu, Tooltip) for built-in accessibility
- Use `data-slot` attributes for targeted styling: `data-slot="card"`, `data-slot="section-header"`
- Compose with shadcn/ui primitives: wrap a Card, use Button for actions, use Badge for status

### shadcn/ui commands

```bash
npx shadcn@latest init     # first-time setup
npx shadcn@latest add button card dialog dropdown-menu
```

Components land in `src/components/ui/`. Never install UI components from npm — always copy via the CLI so they become part of your codebase and fully customizable.

## React conventions

### Component structure

```tsx
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  variant?: "default" | "featured"
  className?: string
}

export function FeatureCard({ title, description, variant = "default", className }: FeatureCardProps) {
  return (
    <div className={cn("rounded-xl border p-6", variant === "featured" && "ring-2 ring-primary", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
```

### Rules

- **Props typing**: Always use `interface` for props. Every component accepts `className?: string`.
- **Exports**: Named exports only. No default exports for components.
- **State**: `useState` for local state. Avoid useEffect unless dealing with external systems (subscriptions, DOM measurements, timers). Most side effects can be handled in event handlers.
- **File structure**: One component per file. Group related utilities in the same directory.
- **No prop drilling**: Use React Context or composition. Avoid premature abstraction.
- **TypeScript strict**: No `any`. No implicit `return undefined`. Every function has an explicit return type when non-trivial.

### Icons

Import from lucide-react:

```tsx
import { Search, Menu, X, ChevronRight } from "lucide-react"

<Search className="size-4" />
```

Always set explicit `size-*` on icons. shadcn/ui expects `[&_svg]:size-4` as default; override with `[&_svg]:size-5` for larger icons.

## HTML semantics

Even in React/JSX, semantics still matter:

- Use `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`. Never `<div>` when a semantic element fits.
- Every page gets a single `<h1>`. Heading levels never skip.
- All images get meaningful `alt` text. Decorative: `alt=""`.
- Forms: every input has a `<label>` associated via `htmlFor`.
- Include a skip-to-content link as the first focusable element.
- Interactive elements are `<button>` or `<a>`, never `<div onClick>`.

## Tailwind usage

### Responsive

Use Tailwind breakpoint prefixes mobile-first:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
```

Default breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`, `2xl:1536px`.

For fluid spacing beyond breakpoints, use arbitrary values with `clamp()`:

```tsx
<section className="px-[clamp(1rem,5vw,4rem)] py-[clamp(2rem,6vw,6rem)]">
```

### Layout

- Use `max-w-*` for containers, never fixed `w-*`: `max-w-7xl` for full-width sections, `max-w-3xl` for prose.
- Grid `auto-fit` handles most card layouts without media queries:

```tsx
<div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-6">
```

### Focus and motion

- Focus: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`. Never `outline-none` without a ring replacement.
- Reduced motion: wrap transitions in `motion-safe:` when possible.
- Screen readers: use `sr-only` for visually hidden but accessible text.

## Performance

- Lazy-load below-fold images: `loading="lazy"`
- Fonts: `font-display: swap` in `@font-face` declarations
- No unused CSS: Tailwind purge handles this in build
- Batch DOM reads/writes in effects
- Use React Server Components where available (Next.js App Router)

## Accessibility

- WCAG AA contrast: 4.5:1 body, 3:1 large text (18px+ bold, 24px+ regular)
- Page has exactly one `<main>` landmark
- Form inputs have visible, persistent labels
- Keyboard: all interactive elements reachable via Tab, logical tab order
- Radix UI primitives provide accessible base behavior out of the box — don't disable it
- `aria-label` or `sr-only` text on icon-only buttons

## Design alignment

Before writing any front-end code, read `AGENTS.md` at the project root. The design plan (palette, type pairing, layout concept, signature element) is the source of truth for all visual decisions. Map the design palette to shadcn/ui's semantic CSS variable tokens.
