# MyBlog - Project Roadmap

**Last Updated:** 2026-08-10
**Current Version:** 1.2.0
**Repository:** https://github.com/ngocthanh1908/MyBlog
**Live:** https://phamngocthanh.me

## Executive Summary

MyBlog is a modern personal blog and portfolio built with Next.js 15, featuring a major UX redesign with Vietnamese localization, forest green design system, and enhanced reading experience. The project has completed the redesign phase and is ready for ongoing content development and feature enhancements.

## Phase Overview

### Phase 1: UX Redesign (COMPLETE)
**Status:** ✅ Complete | **Completion:** 2026-08-06
**Progress:** 100%

Redesigned entire UI with new color palette, typography, Vietnamese localization, and enhanced reading experience.

**Key Achievements:**
- ✅ Forest green design system (#0c5238 / #3eb481)
- ✅ Warm paper backgrounds (#f6f4ee / #111312)
- ✅ Vietnamese localization (UI labels, dates, OG metadata)
- ✅ Font sizer controls for articles (A-/A+)
- ✅ Reading progress bar (fixed top, gradient)
- ✅ HumanNote component (quote blocks with accent)
- ✅ Redesigned navbar (avatar, theme toggle)
- ✅ Refreshed footer layout
- ✅ Blog card improvements (tags, dates, read time)
- ✅ Tag filter pills with shadow effects
- ✅ About page with timeline layout
- ✅ Habits page with stats dashboard
- ✅ All tests passing (35 tests, 6 files)
- ✅ Build passes clean (Next.js 15.5.14)

**Components Added**:
- `src/components/blog/font-sizer.tsx` - Font size controls
- `src/components/home/human-note.tsx` - Quote block component
- `src/components/ui/reading-progress.tsx` - Progress bar

**Components Removed**:
- `src/components/habits/stat-card.tsx`
- `src/components/habits/personal-records-table.tsx`
- `src/__tests__/components/stat-card.test.tsx`

---

### Phase 2: CMS Expansion - Search & Comments (COMPLETE)
**Status:** ✅ Complete | **Completion:** 2026-08-07
**Progress:** 100%

Backend database integration with search indexing and discussion comments.

**Key Achievements**:
- ✅ Pagefind static search indexing (build-time)
- ✅ SearchBox component on /blog page
- ✅ Giscus GitHub Discussions comments on blog detail pages
- ✅ Theme-synced comment widget (light/dark mode)
- ✅ All 45 tests passing (CRUD, auth, search, render)
- ✅ XSS sanitization on search excerpts
- ✅ Draft post auth protection

**Components Added**:
- `src/components/admin/admin-bar.tsx` - Admin status indicator
- `src/components/blog/search-box.tsx` - Full-text search interface
- `src/components/blog/blog-comments.tsx` - Giscus wrapper

**Dependencies Added**:
- `pagefind` (dev) - Static search indexing
- `@giscus/react` - Comments widget

**Environment Variables**:
- `NEXT_PUBLIC_GISCUS_REPO_ID` - GitHub repo ID
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID` - Discussions category ID

---

### Phase 3: CMS Expansion - Docker & Deployment (COMPLETE)
**Status:** ✅ Complete | **Completion:** 2026-08-07
**Progress:** 100%

Production-ready Docker setup with volumes, static file serving, and enhanced security.

**Key Achievements**:
- ✅ Dockerfile optimized for better-sqlite3 native dependencies
- ✅ docker-compose.yml with named volumes (blog-data, blog-uploads)
- ✅ Nginx static serving for /uploads/ with 10M size limit
- ✅ GitHub Actions deploy workflow with --env-file support
- ✅ Timing-safe password comparison in auth
- ✅ Rate limit memory leak fixed
- ✅ Draft auth check on GET /api/posts/[id]

**Security Enhancements**:
- Timing-safe crypto comparison to prevent timing attacks
- Draft post visibility protected by auth middleware
- Rate limiter doesn't leak connection objects

**Infrastructure**:
- Docker Compose orchestration with persistent volumes
- Nginx reverse proxy with static asset caching
- GitHub Actions deployment automation

---

### Phase 4: CMS Expansion v2 - Editor & Tag Management (COMPLETE)
**Status:** ✅ Complete | **Completion:** 2026-08-10
**Progress:** 100%

Enhanced markdown editing, tag management, and security hardening.

**Key Achievements**:
- ✅ Markdown editor with CodeMirror + live preview
- ✅ Editor toolbar with formatting actions
- ✅ Tag management API and admin UI (CRUD)
- ✅ Media library component for file management
- ✅ File deletion endpoint for uploads
- ✅ Token type enforcement (access vs refresh)
- ✅ Rate limit TOCTOU race condition fix
- ✅ XSS protection via rehype-sanitize
- ✅ Token refresh endpoint with auto-renewal
- ✅ Admin interface with tab navigation
- ✅ Improved modal accessibility

**Components Added**:
- `src/components/admin/markdown-editor.tsx`
- `src/components/admin/editor-toolbar.tsx`
- `src/components/admin/markdown-preview.tsx`
- `src/components/admin/media-library.tsx`
- `src/components/admin/tag-manager.tsx`
- `src/app/api/auth/refresh/route.ts`
- `src/app/api/tags/route.ts`
- `src/app/api/tags/[name]/route.ts`
- `src/app/api/uploads/[name]/route.ts` (DELETE)

**Dependencies Added**:
- `rehype-sanitize` - XSS prevention
- `@codemirror/*` - Markdown editor
- `@codemirror/theme-one-dark` - Editor theming

---

### Phase 5: Content & Feature Expansion (PLANNED)
**Status:** 📋 Planned | **Target Start:** 2026-09-01
**Progress:** 0%

Content development, SEO optimization, and performance improvements.

**Planned Work**:
- 📋 Write 10+ new blog articles (tech, running, lifestyle)
- 📋 SEO optimization (structured data, sitemap enhancements)
- 📋 Email newsletter integration
- 📋 Social media share buttons
- 📋 Performance optimization (Core Web Vitals)
- 📋 Analytics integration (Google Analytics)
- 📋 Related articles suggestions

**Expected Outcomes**:
- 30+ quality blog articles
- Improved search engine rankings
- Better user engagement metrics
- Email subscriber base (500+)

---

### Phase 6: Advanced Features (PLANNED)
**Status:** 📋 Planned | **Target Start:** Q1 2027
**Progress:** 0%

Advanced features for enhanced user experience.

**Planned Items**:
- 📋 Reading list / saved articles
- 📋 Export articles (PDF, markdown)
- 📋 Dark mode enhancements (more theme variants)
- 📋 Newsletter subscription widget
- 📋 Subscribe to category feeds

---

### Phase 7: Monetization & Growth (FUTURE)
**Status:** 📋 Future | **Target Start:** Q2 2027
**Progress:** 0%

Features supporting sustainable growth and monetization.

**Planned Items**:
- 📋 Sponsorship opportunities widget
- 📋 Affiliate links integration
- 📋 Digital products (courses, guides)
- 📋 Patreon or membership program
- 📋 Premium content sections

---

## Current Development Focus

### 1. CMS Expansion Complete
- ✅ Search indexing (Pagefind)
- ✅ Comments system (Giscus)
- ✅ Markdown editor with CodeMirror
- ✅ Tag management API/UI
- ✅ Media library with file deletion
- ✅ Token refresh and auto-renewal
- ✅ Docker deployment pipeline
- ✅ Security hardening (v1.2.0)
- ✅ 45+ comprehensive tests

### 2. Next Phase: Content & SEO
- 📋 Blog content calendar planning
- 📋 Write 10+ new articles
- 📋 SEO optimization
- 📋 Email newsletter setup
- 📋 Analytics configuration

### 3. Future Phases
- 📋 Advanced features (Q1 2027)
- 📋 Monetization options (Q2 2027)

---

## Milestone Tracking

### Q3 2026 Milestones
| Milestone | Status | Due Date | Progress |
|-----------|--------|----------|----------|
| UX Redesign Complete | ✅ Complete | 2026-08-06 | 100% |
| CMS Expansion (Search & Comments) | ✅ Complete | 2026-08-07 | 100% |
| CMS v2 (Editor & Tags) | ✅ Complete | 2026-08-10 | 100% |
| Docker & Deployment Setup | ✅ Complete | 2026-08-07 | 100% |
| Security Hardening | ✅ Complete | 2026-08-10 | 100% |
| 45+ Tests Passing | ✅ Complete | 2026-08-07 | 100% |
| Documentation Updated | ✅ Complete | 2026-08-10 | 100% |
| First 10 Articles | 📋 Pending | 2026-09-30 | 0% |

### Q4 2026 Milestones
| Milestone | Status | Due Date | Progress |
|-----------|--------|----------|----------|
| 20+ Blog Articles | 📋 Planned | 2026-12-31 | 0% |
| SEO Optimization | 📋 Planned | 2026-12-31 | 0% |
| Newsletter Integration | 📋 Planned | 2026-12-31 | 0% |
| Analytics Setup | 📋 Planned | 2026-12-31 | 0% |

### Q1 2027 Milestones
| Milestone | Status | Due Date | Progress |
|-----------|--------|----------|----------|
| Advanced Features (Phase 5) | 📋 Planned | 2027-03-31 | 0% |
| 30+ Articles | 📋 Planned | 2027-03-31 | 0% |
| Core Web Vitals Green | 📋 Planned | 2027-03-31 | 0% |

---

## Success Metrics

### Content & Engagement
- Blog posts: 30+ articles
- Monthly readers: 1,000+ (target)
- Average session duration: 3+ minutes
- Click-through to projects: 5%+
- Newsletter subscribers: 500+ (target)

### Technical Performance
- Lighthouse Score: 90+ (all categories)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Core Web Vitals: All green

### SEO & Discovery
- Google indexed pages: 100%
- Organic search traffic: 500+ monthly
- Backlinks from technical sites: 10+
- Featured snippets: 3+
- Keywords ranked top 10: 20+

### Quality Metrics
- Test coverage: > 80%
- Build success rate: 100%
- Deployment frequency: Daily capable
- Error rate: < 0.1%
- 404 rate: < 1%

---

## Technical Architecture

### Framework & Stack
- **Framework**: Next.js 15.5.14 (App Router, Turbopack)
- **React**: 19.1.0
- **Styling**: Tailwind CSS 4.x
- **Content**: MDX via next-mdx-remote
- **Testing**: Vitest + React Testing Library
- **Deployment**: Docker + Nginx + GitHub Actions

### Infrastructure
- **Hosting**: VPS (103.98.160.56:8001)
- **Domain**: phamngocthanh.me via Cloudflare
- **SSL**: Flexible (via Cloudflare)
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions (auto-deploy on push)

---

## Known Constraints & Limitations

### Technical
- Single-column layout (max-w-[820px]) may not suit all content types
- Reading font size controlled via localStorage (client-side)
- Comment system requires external service
- Email newsletter needs third-party integration

### Content
- Manual blog post creation (no CMS)
- Frontmatter parsing requires proper YAML format
- Category taxonomy must be maintained manually
- Related articles require manual linking

### Operational
- Single author (future multi-author would need auth)
- No moderation system for comments
- Analytics requires manual setup
- No automatic social media posting

---

## Risk Management

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Low organic traffic | Medium | Medium | SEO optimization, quality content strategy |
| Mobile experience issues | High | Low | Responsive design, testing, lighthouse audits |
| Content creation burnout | Medium | Medium | Content calendar, batching, scheduled posts |
| Comment spam | Medium | High | Moderation system, automated filtering |
| Performance regression | High | Low | Monitoring, regular audits, lighthouse checks |

---

## Dependencies & External Requirements

### Required
- Node.js 20+ runtime
- Git version control
- GitHub account and repository
- VPS with Docker and Nginx

### Optional
- Email service (Mailchimp, ConvertKit, etc.)
- Analytics service (Google Analytics, Vercel Analytics)
- Comment system (Disqus, Commento, etc.)
- CDN acceleration (Cloudflare - already in use)
- SEO tools (Semrush, Ahrefs, etc.)

---

## Document References

### Core Documentation
- [Project Overview PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [Design Guidelines](./design-guidelines.md)
- [System Architecture](./system-architecture.md)
- [Codebase Summary](./codebase-summary.md)
- [Deployment Guide](./deployment-guide.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## Questions & Notes

### Current Status (2026-08-10)
- UX redesign complete (Phase 1)
- CMS expansion complete (phases 2-4: search, comments, Docker, editor, tags, security)
- All tests passing (45+ tests)
- Build clean (Turbopack)
- Deployed and live at phamngocthanh.me
- Production-ready Docker Compose setup
- Security-hardened with token type enforcement and XSS protection
- Ready for content creation phase

### Next Steps
1. Plan content strategy (Phase 4)
2. Set up analytics and monitoring
3. Write first 10 articles
4. SEO optimization
5. Newsletter integration

---

**Maintained By:** Pham Ngoc Thanh
**Last Review:** 2026-08-07
**Next Review Target:** 2026-09-30
