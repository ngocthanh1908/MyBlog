# Phase 5: Testing Setup

## Context Links
- Existing utils: `src/lib/mdx-utils.ts`, `src/lib/site-config.ts`, `src/lib/structured-data.ts`
- Package.json: no test runner currently installed
- MDX content: `src/content/blog/*.mdx`

## Overview
- **Priority:** P2
- **Status:** Pending
- **Description:** Set up Vitest + React Testing Library with basic test coverage for utils, data files, and key component rendering.

## Key Insights
- Vitest is fastest for Next.js projects (Vite-native, TypeScript out of box)
- `@vitejs/plugin-react` needed for JSX transform in tests
- `next-mdx-remote` uses server components — test the data layer, not MDX compilation
- Focus on high-value tests: data validation, util functions, component smoke tests

## Requirements
**Functional:**
- Test `mdx-utils.ts`: getAllPosts, getPostBySlug, getAllTags, slug validation
- Test `site-config.ts`: shape validation
- Test `structured-data.ts`: JSON-LD output structure
- Test data files: about-data, projects-data, habits-data (Zod validation)
- Component smoke tests: ProjectCard, StatCard render without errors

**Non-functional:**
- `npm run test` script in package.json
- Path aliases (`@/*`) working in Vitest
- Tests run in < 5 seconds
- CI-friendly (no browser needed for unit tests)

## Architecture
```
vitest.config.ts                      → config with path aliases, React plugin
src/__tests__/
  lib/
    mdx-utils.test.ts                → blog post parsing tests
    site-config.test.ts              → config shape test
    structured-data.test.ts          → JSON-LD output tests
  data/
    projects-data.test.ts            → Zod schema validation
    habits-data.test.ts              → data shape validation
  components/
    project-card.test.tsx            → smoke render test
    stat-card.test.tsx               → smoke render test
```

## Related Code Files
- **Create:** `vitest.config.ts`, all test files above
- **Modify:** `package.json` (add test script + devDependencies)

## Implementation Steps
1. Install dependencies:
   ```
   npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
   ```
2. Create `vitest.config.ts`:
   - Plugin: `@vitejs/plugin-react`
   - Resolve alias: `@/` -> `./src/`
   - Environment: `jsdom` for component tests
   - Include: `src/__tests__/**/*.test.{ts,tsx}`
3. Add to `package.json` scripts: `"test": "vitest run", "test:watch": "vitest"`
4. Create `src/__tests__/lib/mdx-utils.test.ts`:
   - Test `getAllPosts()` returns array, sorted by date desc
   - Test `getPostBySlug("hello-world")` returns valid post with content
   - Test `getPostBySlug("../../etc/passwd")` throws (path traversal)
   - Test `getAllTags()` returns sorted unique tags
5. Create `src/__tests__/lib/site-config.test.ts`:
   - Test siteConfig has required keys (name, siteUrl, navLinks, socialLinks)
6. Create `src/__tests__/lib/structured-data.test.ts`:
   - Test `personJsonLd()` returns valid schema.org structure
   - Test `blogPostJsonLd()` returns valid BlogPosting
7. Create `src/__tests__/data/projects-data.test.ts`:
   - Test all projects pass Zod schema
   - Test at least one featured project exists
8. Create `src/__tests__/data/habits-data.test.ts`:
   - Test data exports exist and have expected shape
9. Create component smoke tests (render, check no errors)
10. Run `npm run test` — all pass

## Todo List
- [ ] Install Vitest + RTL dependencies
- [ ] Create `vitest.config.ts`
- [ ] Add test scripts to package.json
- [ ] Write mdx-utils tests (4 cases)
- [ ] Write site-config test
- [ ] Write structured-data tests (2 cases)
- [ ] Write projects-data validation test
- [ ] Write habits-data validation test
- [ ] Write component smoke tests (2 components)
- [ ] All tests pass: `npm run test`

## Success Criteria
- `npm run test` runs all tests and passes
- Tests execute in < 5 seconds
- Path traversal attack caught by test
- No mocks for filesystem (test real MDX files)

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Path alias resolution fails in Vitest | Medium | Medium | Explicit resolve.alias in vitest.config.ts |
| next-mdx-remote imports break in test env | Medium | Medium | Test data/util layer only, not MDX compilation |
| fs operations differ on CI vs local | Low | Medium | Use path.join(process.cwd(), ...) consistently — already done |

## Next Steps
- Phase 6 Dockerfile should run `npm run test` in build stage (optional)
- Future: add Playwright e2e tests (separate plan, YAGNI for now)
