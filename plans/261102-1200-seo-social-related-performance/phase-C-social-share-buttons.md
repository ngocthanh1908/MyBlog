# Phase C: Social Share Buttons

**Priority:** MEDIUM | **Status:** done | **Depends on:** Phase B (shares `blog/[slug]/page.tsx`)

## Overview
Add share-to-social buttons (Facebook, X/Twitter, LinkedIn, copy-link) on the
blog detail page. Pure client-side links/clipboard — no account, API key, or
SDK required for any of the four.

## Key Insights
- `lucide-react` is already a dependency (`package.json`) and already used for
  icons elsewhere (`src/app/blog/[slug]/page.tsx:8` imports `ArrowLeft`) — use
  it for Facebook/Twitter/Linkedin/Link icons instead of adding a new icon
  package (DRY, no new dependency).
  **Correction found during implementation:** this installed `lucide-react`
  version ships no `Facebook`/`Twitter`/`Linkedin` brand-logo exports (checked
  `node_modules/lucide-react/dist/lucide-react.d.ts`); only generic icons like
  `Copy`/`Check`/`Link2`/`Share2` exist. Implemented with text labels
  ("Facebook", "X", "LinkedIn") plus the generic `Copy`/`Check` icons for the
  copy-link button — still zero new dependencies, just no brand-logo glyphs.
- Share-intent URLs (`https://www.facebook.com/sharer/sharer.php?u=...`,
  `https://twitter.com/intent/tweet?url=...&text=...`,
  `https://www.linkedin.com/sharing/share-offsite/?url=...`) need no API key —
  confirmed these are plain GET-parameter deep links, not SDK/widget embeds.
- `next.config.ts`'s CSP (`connect-src 'self'`, `frame-src 'self' https://giscus.app`)
  only restricts fetch/XHR/websocket and iframe origins — plain `<a href>`
  outbound navigation (`target="_blank"`) is not restricted by CSP, so **no
  CSP change is needed**. Verified by inspecting every directive in
  `next.config.ts:16-23`; none is `navigate-to` or `form-action`.
- `site-config.ts` (`src/lib/site-config.ts:12-17`) has `siteUrl` to build the
  absolute post URL for sharing; no new config needed.
- Copy-link uses `navigator.clipboard.writeText` — works in the browser
  without any account; needs a `"use client"` component (same pattern as
  `FontSizer`, `src/components/blog/font-sizer.tsx:1`).

## Requirements
### Functional
- New `ShareButtons` component, props `{ url: string; title: string }`.
- Renders 4 buttons/links: Facebook, X (Twitter), LinkedIn (all
  `target="_blank" rel="noopener noreferrer"`, opening the share-intent URL),
  and "Copy link" (writes `url` to clipboard, shows a brief "Copied" state via
  local `useState`, no toast library — reuse the simple inline-feedback
  pattern, not a new dependency).
- Rendered in `blog/[slug]/page.tsx` inside the reader-controls row (next to
  `<FontSizer />`, same line, `src/app/blog/[slug]/page.tsx:116-133` region) —
  this is a **different region** from Phase B's related-articles insertion
  point, so no line overlap with Phase B's edit even though both touch this
  file.
- Absolute URL passed in is `${siteConfig.siteUrl}/blog/${post.slug}`.

### Non-functional
- No new npm dependency.
- Keyboard accessible (real `<a>`/`<button>` elements, visible focus state
  consistent with existing buttons in the file, e.g. `FontSizer`'s button
  classes).
- Component file stays under 200 lines.

## Architecture
```
blog/[slug]/page.tsx (server component)
  -> <ShareButtons url={...} title={post.title} />  [client component]
       -> <a> share-intent links (Facebook/X/LinkedIn)
       -> <button> clipboard copy
```

## Related Code Files
### Modify
- `src/app/blog/[slug]/page.tsx` — add `ShareButtons` next to `FontSizer` in
  the reader-controls row (lines 116-133 region only — **do not touch** the
  JSON-LD scripts (Phase A's region) or the related-articles region (Phase B's
  region) in this file).

### Create
- `src/components/blog/share-buttons.tsx` — new client component.
- `src/__tests__/components/share-buttons.test.tsx` — new, mocking
  `navigator.clipboard.writeText` the way `search-box.test.tsx` mocks
  `pagefind.js` (`vi.fn()` + assert it was called with the right URL).

## Implementation Steps
1. Write the test first: renders 4 controls with correct `href`s
   (URL-encoded post URL/title in each share-intent link), and the copy-link
   button calls `navigator.clipboard.writeText(url)` and flips to a "Copied"
   label.
2. Implement `ShareButtons` component.
3. Insert `<ShareButtons url={...} title={post.title} />` next to
   `<FontSizer />` in `blog/[slug]/page.tsx`.
4. Run `npm run test` and `npm run lint`.
5. Manual check: click each share link opens the correct prefilled share
   dialog in a new tab; copy-link populates the clipboard.

## Todo
- [x] `ShareButtons` component implemented + tested
- [x] Share-intent URLs correct (Facebook/X/LinkedIn) and URL-encoded
- [x] Copy-link clipboard behavior tested
- [x] Wired into `blog/[slug]/page.tsx` reader-controls row
- [x] `npm run test` and `npm run lint` pass

## Success Criteria
- Each of the 4 controls is keyboard-focusable and operable.
- Facebook/X/LinkedIn links open the correct platform's share dialog with the
  post URL and title prefilled.
- Copy-link puts the exact absolute post URL on the clipboard and gives
  visible feedback.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `navigator.clipboard` unavailable (non-HTTPS/old browser) | Low (site is HTTPS via Cloudflare) | Low | Wrap in try/catch, fall back to no-op + show the raw URL in a disabled input (simple, no new dependency) |
| Edit collision with Phase B on the same file | High (by design) | Medium | Different, non-adjacent region of `blog/[slug]/page.tsx`; sequential execution still required since both phases diff the same file |
| CSP blocking the outbound share links | Low | Medium (feature silently fails) | Verified CSP has no `navigate-to`/`form-action` restriction (`next.config.ts:16-23`); no config change needed, but re-verify in manual check (step 5) since CSP bugs fail silently |

## Rollback
Revert `blog/[slug]/page.tsx` to drop the `ShareButtons` insertion; delete
`share-buttons.tsx` and its test. No stored data involved.
