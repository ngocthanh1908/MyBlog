# Phase 1: Project Setup & Configuration

## Context Links
- [System Spec](../../system.md) | [Brainstorm](../reports/brainstorm-260402-0003-nextjs-bento-grid-homepage.md)

## Overview
- **Priority:** P1 (blocker for all phases)
- **Status:** Complete
- **Effort:** 2h
- Init Next.js 15, configure Tailwind 4, Geist font, dark mode, design tokens, standalone output.

## Requirements
- Next.js 15 with App Router, TypeScript, `src/` directory
- Tailwind CSS 4 with custom design tokens from system.md
- Geist font (bundled with create-next-app)
- Dark mode via next-themes
- `output: 'standalone'` for self-hosted deploy
- ESLint config

## Related Code Files

### Create
- `src/app/layout.tsx` — Root layout with font, ThemeProvider
- `src/app/page.tsx` — Placeholder homepage
- `src/styles/globals.css` — Tailwind base + CSS custom properties (design tokens)
- `src/components/ui/theme-toggle.tsx` — Dark mode toggle button
- `src/lib/site-config.ts` — Site metadata, nav links, social links
- `next.config.ts` — Standalone output config
- `tailwind.config.ts` — (if needed, Tailwind 4 uses CSS-based config)

## Implementation Steps

1. **[RT#1]** Scaffold in temp dir first (project dir is non-empty):
   ```bash
   npx create-next-app@15 temp-scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
   Then copy `src/`, config files (`next.config.ts`, `tsconfig.json`, `postcss.config.*`, `package.json`, `.eslintrc*`, `.gitignore`) into project root. Remove `temp-scaffold/`.
2. **[RT#2]** Upgrade to Tailwind v4 after scaffolding:
   ```bash
   npm install tailwindcss@4 @tailwindcss/postcss @tailwindcss/vite
   ```
   Remove `tailwind.config.ts` (v3 artifact). Update `postcss.config.mjs` to use `@tailwindcss/postcss`.
3. Install additional deps: `npm install framer-motion next-themes next-mdx-remote gray-matter lucide-react`
   > Note: `@tailwindcss/typography` — verify v4 compatibility. Use `@plugin '@tailwindcss/typography'` in CSS or install `@tailwindcss/typography@next`.
4. Configure `next.config.ts`:
   ```ts
   const nextConfig = {
     output: 'standalone',
     // [RT#4] Include content files in standalone output
     outputFileTracingIncludes: {
       '/blog/*': ['./src/content/blog/**/*'],
     },
   }
   ```
5. Setup `src/styles/globals.css` with Tailwind 4 + design tokens:
   ```css
   @import "tailwindcss";
   @plugin '@tailwindcss/typography';

   /* [RT#2] Register custom colors with Tailwind v4 @theme */
   @theme {
     --color-background: var(--color-bg);
     --color-surface: var(--color-sf);
     --color-primary: var(--color-pr);
     --color-accent: var(--color-ac);
     --color-border: var(--color-bd);
     --color-muted: var(--color-mt);
   }

   :root {
     --color-bg: #ffffff;
     --color-sf: #f3f4f6;
     --color-pr: #000000;
     --color-ac: #312e81;
     --color-bd: #e5e7eb;
     --color-mt: #6b7280;
   }

   .dark {
     --color-bg: #0f0f0f;
     --color-sf: #1a1a2e;
     --color-pr: #f9fafb;
     --color-ac: #818cf8;
     --color-bd: #374151;
     --color-mt: #9ca3af;
   }
   ```
6. Setup `src/app/layout.tsx` with Geist font + `<ThemeProvider>` from next-themes
   - Use `suppressHydrationWarning` on `<html>` only (standard next-themes pattern)
7. Create `src/lib/site-config.ts` with site name, description, nav links, social links
   - **[RT#13][V#6]** Use `process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'` for siteUrl. Domain TBD — user will configure via env var. No hardcoded domain.
8. Create `src/components/ui/theme-toggle.tsx` with Sun/Moon icon toggle
9. **[RT#10]** Configure security headers in `next.config.ts` `headers()`:
   - `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
10. Run `npm audit` to check dependencies
11. Verify: `npm run dev` — page loads, dark mode toggles, Tailwind utilities work, no errors

## Todo List
- [x] Scaffold Next.js 15 in temp dir, copy to project root [RT#1]
- [x] Upgrade to Tailwind v4, remove v3 config [RT#2]
- [x] Install additional dependencies + run npm audit
- [x] Configure next.config.ts (standalone + outputFileTracingIncludes) [RT#4]
- [x] Setup globals.css with @theme + design tokens [RT#2]
- [x] Setup root layout with Geist font + ThemeProvider
- [x] Create site-config.ts with env-based siteUrl [RT#13]
- [x] Create theme-toggle component
- [x] Configure security headers [RT#10]
- [x] Verify dev server + Tailwind utilities work

## Success Criteria
- `npm run dev` starts without errors
- Dark/light mode toggles via button
- Geist font loads correctly
- Design token CSS vars available in both themes
- `npm run build` succeeds with standalone output

## Risk Assessment
- **Tailwind v4 CSS-first config**: `create-next-app@15` may scaffold v3. Mitigation: explicit upgrade step + remove v3 config.
- **`@tailwindcss/typography` v4 compat**: May need `@next` tag or `@plugin` directive. Mitigation: test during setup, fallback to manual prose styles.
- **next-themes hydration mismatch**: Mitigation: `suppressHydrationWarning` on `<html>` only (scoped).

## Next Steps
→ Phase 2: Layout Shell (Navbar + Footer)
