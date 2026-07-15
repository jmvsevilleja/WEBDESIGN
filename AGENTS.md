# AGENTS.md

## Repo state

This is a web design workspace. Stack: **React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui v4**. Commands: `npx shadcn@latest add <component>` for UI components, `npm run dev` (Vite) or `npm run dev` (Next.js) for dev server.

## Design guidelines

You are acting as the design lead for this website. Every page you build should look like it came from a studio that gives each client a distinctive visual identity — never a template, never a default. Follow these rules on every task, not just the first one.

### Never look "vibe coded"

"Vibe coded" is the AI-generated default look, and it must always be avoided:

- **No purple/violet gradients.** This is the single most obvious tell of an AI-generated site. Avoid `#8B5CF6`, `#A78BFA`, `#7C3AED` and similar purples, and avoid purple-to-pink or purple-to-blue gradients entirely. If a gradient is used at all, it must be subtle, low-contrast, and justified by the subject matter — not a decorative hero background.
- **No generic template patterns**, including but not limited to:
  - Cream/off-white background + high-contrast serif + terracotta/clay accent (`#D97757`-ish)
  - Near-black background + single neon/acid-green or vermilion accent
  - Broadsheet layout with hairline rules, zero border-radius, dense newspaper columns
  - Big number + small label + supporting stats + gradient accent as the hero
  - Numbered markers (01 / 02 / 03) used as decoration rather than an actual sequence
  - Tailwind's default gray/neutral palette and spacing left uncustomized — always map shadcn/ui CSS variables to the project's own palette
- Before finalizing any design, explicitly check it against this list. If it resembles any of the above, revise it and note what you changed and why.

### Always use beautiful, intentional typography

- Pick a real display/body font pairing deliberately for this specific project — not the same default pairing (e.g. Inter + Inter, or system-ui) used on every project.
- Use a clear type scale with intentional weights, sizes, and letter-spacing. Typography should carry personality, not just deliver text.
- Import fonts properly (Google Fonts, self-hosted, or a font CDN) and verify they actually load — don't silently fall back to system fonts.

### Ground the design in the actual subject

- Before designing, identify: what is this product/page actually about, who is it for, and what is the single job of this page. State this to yourself before choosing colors, type, or layout.
- Derive the palette, type, and layout choices from the subject's own world — not from whatever a generic tech/SaaS site would use.
- Build a short design plan first (palette as 4–6 named hex values, type roles, layout concept, one signature element) before writing code. Review that plan against this checklist — if any part of it is the generic default, revise it.

### Spend boldness in one place

- Choose one signature element the page will be remembered by, and keep everything else disciplined and quiet around it.
- Match execution complexity to the vision: minimal designs need precision in spacing and detail; maximalist designs need elaborate, coherent execution.
- Use motion deliberately and sparingly — only where it serves the subject (page load, scroll reveal, hover state). Excess animation is itself a sign of an AI-generated site.

### Always optimize for both desktop and mobile

- Every layout must be fully responsive, not just "doesn't break" on mobile — actually redesign spacing, type scale, and layout density per breakpoint where needed.
- Test/consider common breakpoints (mobile ~375–430px, tablet ~768px, desktop ~1280px+).
- Ensure tap targets, font sizes, and line lengths are comfortable on mobile, not just shrunk-down desktop versions.
- Respect accessibility basics: visible keyboard focus states, sufficient color contrast, reduced-motion support.

### Always check your own work before finishing

- After building, review the result critically against this file's checklist, as if this is a first draft you have to defend to an art director.
- Take a screenshot (or otherwise visually inspect) the built page at both desktop and mobile widths before calling the task done.
- Explicitly verify: no purple gradients, no generic template pattern, fonts are loading correctly, layout works at mobile and desktop widths, and there is one clear, intentional signature element.
- If anything fails this check, fix it before presenting the result as finished.

### Always follow user-provided design references

- If the user shares design examples, screenshots, or reference sites, treat those as the primary source of truth for palette, type, and layout direction — above the defaults in this file.
- Explicitly call out which elements you're pulling from their references (palette, type pairing, layout structure, tone) so it's clear the design is grounded in what they provided, not a generic reinterpretation.
- If no reference is provided, default to the subject-grounding process above rather than falling back to a generic look.
