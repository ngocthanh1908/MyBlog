# MyBlog - Project Roadmap

**Last Updated:** 2026-08-06
**Current Version:** 1.0.0
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

### Phase 2: Content & Feature Expansion (PLANNED)
**Status:** 📋 Planned | **Target Start:** 2026-09-01
**Progress:** 0%

Content development, feature enhancements, and SEO optimization for organic growth.

**Planned Work**:
- 📋 Write 10+ new blog articles (tech, running, lifestyle)
- 📋 SEO optimization (structured data, sitemap, meta tags)
- 📋 Email newsletter integration
- 📋 Social media share buttons
- 📋 Comment system (Disqus or similar)
- 📋 Reading time accuracy improvements
- 📋 Performance optimization (Core Web Vitals)
- 📋 Analytics integration (Google Analytics, Vercel Analytics)

**Expected Outcomes**:
- 30+ quality blog articles
- Improved search engine rankings
- Better user engagement metrics
- Email subscriber base (500+)
- Increased organic traffic

---

### Phase 3: Advanced Features (PLANNED)
**Status:** 📋 Planned | **Target Start:** Q1 2027
**Progress:** 0%

Advanced features for enhanced user experience and monetization.

**Planned Items**:
- 📋 Search functionality (full-text blog search)
- 📋 Related articles suggestions
- 📋 Newsletter subscription widget
- 📋 Reading list / saved articles
- 📋 Export articles (PDF, markdown)
- 📋 Dark mode enhancements (more theme variants)
- 📋 Multi-language support expansion
- 📋 Subscribe to category feeds

---

### Phase 4: Monetization & Growth (FUTURE)
**Status:** 📋 Future | **Target Start:** Q2 2027
**Progress:** 0%

Features supporting sustainable growth and potential monetization.

**Planned Items**:
- 📋 Sponsorship opportunities widget
- 📋 Affiliate links integration
- 📋 Digital products (courses, guides)
- 📋 Patreon or membership program
- 📋 Premium content sections
- 📋 Advanced analytics dashboard
- 📋 Content recommendations engine

---

## Current Development Focus

### 1. Documentation Updates
- ✅ Updated all docs for MyBlog (not ClaudeKit)
- ✅ Created design-guidelines.md
- ✅ Updated codebase-summary.md
- ✅ Updated code-standards.md
- ✅ Updated project-overview-pdr.md
- ✅ Updated system-architecture.md
- ✅ Updated deployment-guide.md

### 2. Post-Redesign Polish
- 📋 Bug fixes and refinements
- 📋 Performance optimization
- 📋 Lighthouse score improvements
- 📋 Mobile UX testing
- 📋 Accessibility audit

### 3. Content Strategy
- 📋 Blog content calendar
- 📋 Running/fitness content
- 📋 Technical writing
- 📋 Personal essays

---

## Milestone Tracking

### Q3 2026 Milestones
| Milestone | Status | Due Date | Progress |
|-----------|--------|----------|----------|
| UX Redesign Complete | ✅ Complete | 2026-08-06 | 100% |
| Documentation Updated | ✅ Complete | 2026-08-06 | 100% |
| Bug Fixes & Polish | 📋 Pending | 2026-08-31 | 0% |
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
| Search Functionality | 📋 Planned | 2027-03-31 | 0% |
| Comment System | 📋 Planned | 2027-03-31 | 0% |
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

### Current Status (2026-08-06)
- UX redesign complete with all components working
- All tests passing (35 tests)
- Build clean (Turbopack)
- Deployed and live at phamngocthanh.me

### Next Steps
1. Polish any remaining UI issues
2. Optimize performance (Lighthouse > 90)
3. Plan content strategy for Phase 2
4. Set up analytics and monitoring
5. Begin writing Phase 2 articles

---

**Maintained By:** Pham Ngoc Thanh
**Last Review:** 2026-08-06
**Next Review Target:** 2026-09-30
