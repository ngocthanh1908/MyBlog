# Feature Comparison: ehkoo.com vs MyBlog (revised)

Source: https://ehkoo.com/ (Astro; HTML + CSS read directly, no source repo). Mode: compare.
Correction: first pass (text-only fetch) wrongly said "no sidebar" and "add topic grouping". Raw HTML/CSS shows otherwise.

## Head-to-Head

| Aspect | ehkoo.com | MyBlog | Verdict |
| --- | --- | --- | --- |
| Palette | gray-0 #f8f9fa bg, gray-8 #343a40 text, indigo-6 #4c6ef5 | Same values in `globals.css` | Already matched |
| Fonts | Work Sans (variable), Inconsolata mono | Same | Already matched |
| Topic grouping | `section.topic` + `h2.topic-title` tab, featured card, "Bài cùng chủ đề" | `topic-section.tsx` + `group-posts-by-topic.ts` (tab on border, 2px border, 5px radius, expand/collapse), used in `blog-index.tsx` | Already ported, plus collapse and tests |
| Layout | Grid `20ch 1fr`; header spans both columns; sticky left aside (`top:1rem`, desktop >= 60rem); mobile menu is `<details>` with hamburger/close icon; max-width 90rem | `.site-container`, check header/nav in `components/layout` | Differs: ehkoo uses left sticky sidebar |
| Home page | Topic list is the home | Home (`app/page.tsx`) is About; topic grid lives at `/blog` | Differs |
| Code/prose style | `.content` max 75ch, blockquote with 8px left border, zebra tables | Not checked | Compare only if wanted |
| Dark mode | Not present in CSS | Present | Ours ahead |
| Search/comments/admin | None | Present | Ours ahead |

## Real gaps (only these)

1. Home = topic grid (ehkoo) vs About (ours). Taste call.
2. Left sticky sidebar layout (20ch + content) vs ours.
3. RSS feed + link (not seen in `src/app`).

## Unresolved questions

- Which gap do you want: topic grid on home, sidebar layout, RSS?
- Keep About as home, or move topic grid to `/` and About to `/about`?
