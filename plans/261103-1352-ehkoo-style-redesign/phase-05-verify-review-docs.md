# Phase 5 — Verify, review, docs

## Steps
1. `npm test`, `npm run lint`, `npm run build` — all must pass; do not weaken tests.
2. Visual check with the running dev server (port 3000, do not start another): home, `/blog`, `/about`, a post page, dark mode, mobile width; one post with `coverImage` (use an existing file under `public/uploads` or a local test file), one without, one with a broken path.
3. Delegate `code-reviewer` on the diff.
4. Docs: update `docs/design-guidelines.md` (topic blocks, container, cover image spec: 16:9, 1600×900 preferred / 1200×675 min, WebP/AVIF < 150 KB, subject centered with ~10% safe margin, no text in image, one consistent style, local files only, alt = post title), `docs/project-changelog.md`, and `docs/codebase-summary.md` if components list changes.

## Acceptance
All contract acceptance items in `plan.md` met; no leftover imports of deleted components.
