# Project Overview & Product Development Requirements (PDR)

**Project Name**: MyBlog - Personal Portfolio & Blog
**Version**: 1.0.0
**Last Updated**: 2026-08-06
**Status**: Active Development (UX Redesign Complete)
**Repository**: https://github.com/ngocthanh1908/MyBlog
**Live Site**: https://phamngocthanh.me

## Executive Summary

MyBlog is a modern personal blog and portfolio built with Next.js 15, featuring a completely redesigned user interface with Vietnamese localization, an improved reading experience, and a compelling visual design using forest green tones and serif typography. The site showcases blog articles, running achievements, project portfolio, and personal information through an elegant, responsive interface.

## Project Purpose

### Vision
Create a beautiful, performant personal blog and portfolio that effectively communicates technical expertise, writing, and personal interests through thoughtful design and engaging content.

### Mission
Deliver a blog platform that:
- Showcases technical writing with excellent reading experience
- Highlights running passion and fitness journey
- Presents portfolio of projects and achievements
- Provides seamless navigation in both English and Vietnamese
- Offers optimal performance on all devices and network speeds
- Maintains clean, maintainable codebase with modern tech stack

### Key Features (Post-Redesign)
- **Multilingual UI**: Full Vietnamese localization for nav, labels, and metadata
- **Forest Green Design**: Custom color palette (#0c5238 light, #3eb481 dark)
- **Reading Experience**: Font sizer controls, reading progress bar, optimized typography
- **Content**: MDX-powered blog posts with metadata and category tagging
- **Portfolio**: Project showcase with links and descriptions
- **Habits**: Running statistics and personal goals dashboard
- **Responsive**: Mobile-first design, optimized for all screen sizes

## Target Audience

### Primary Visitors
1. **Potential Employers/Clients**: Evaluating skills and experience
2. **Technology Enthusiasts**: Reading technical articles and insights
3. **Running Community**: Following running journey and fitness updates
4. **Networking Contacts**: Learning about professional background
5. **Casual Readers**: Enjoying personal essays and thoughts

### User Scenarios

**Scenario 1: Employer Reviewing Portfolio**
- **Goal**: Assess technical skills and project experience
- **Needs**: Clear project descriptions, technical depth, code examples
- **Solution**: Dedicated projects page with links, descriptions, and live demos

**Scenario 2: Blog Reader Discovering Content**
- **Goal**: Find and read interesting articles
- **Needs**: Easy browsing, search/filter by category, responsive reading
- **Solution**: Blog grid with tags, reading progress, font sizing controls

**Scenario 3: Running Community Follower**
- **Goal**: Track running progress and achievements
- **Needs**: Stats, personal records, goals, MAF philosophy
- **Solution**: Habits page with dashboard, timeline, and stats display

## Key Features & Components

### 1. Design System (Post-Redesign)

**Color Palette**:
- **Primary**: Forest green (#0c5238 light, #3eb481 dark)
- **Background**: Warm paper (#f6f4ee light, #111312 dark)
- **Accent Hover**: Derived from primary, adjustable
- **Accessible**: WCAG AA contrast compliance

**Typography**:
- **Sans**: Plus Jakarta Sans (UI, navigation)
- **Serif**: Newsreader (headings, emphasis)
- **Mono**: JetBrains Mono (code blocks)
- **Vietnamese Subsets**: Full support for vi_VN locale

**Layout**:
- **Max Width**: Narrowed to 820px single-column for focused reading
- **Responsive**: Mobile-first, optimized for all screen sizes
- **Animations**: Pulse effects, smooth transitions, fade-in

### 2. Core Pages & Components

**Navigation**:
- **Navbar**: Avatar with initials, name/subtitle, circular theme toggle
- **Footer**: Centered layout, Vietnamese text, social links
- **Mobile Menu**: Responsive hamburger navigation

**Home Page**:
- **Hero**: Status badge with pulse, serif italic heading, Vietnamese copy
- **HumanNote**: Quote block with accent border (NEW)
- **Blog Preview**: Latest articles grid
- **Featured Articles**: Highlighted content
- **Project Showcase**: Portfolio grid
- **Stats**: Running/habits dashboard preview

**Blog Section** (`/blog`):
- **Blog Grid**: Card layout with category tags, Vietnamese dates, read time
- **Tag Filter**: Green pill buttons, active state with shadow
- **Blog Detail**: Full article with reading progress bar, font sizer, back button
- **ReadingProgress**: Fixed top gradient bar tracking scroll (NEW)
- **FontSizer**: A-/A+ controls for font size adjustment (NEW)

**Other Pages**:
- **About** (`/about`): Career timeline layout
- **Habits** (`/habits`): Stats dashboard, MAF philosophy section
- **Projects**: Portfolio showcase (not in main nav, accessible at `/projects`)

### 3. Data Management

**Site Configuration** (`src/lib/site-config.ts`):
- Name, subtitle, description (Vietnamese)
- Navigation links (updated)
- Social links including blog URL

**Content Data** (`src/data/`):
- `about-data.ts`: Biography, career timeline (Vietnamese)
- `habits-data.ts`: Running stats, goals, philosophy (Vietnamese)
- Blog posts: MDX format in `src/content/`

### 4. Visual Enhancements

**Animations**:
- Pulse-dot effect for status badges
- Slide-up transitions for content
- Fade-up motion for elements

**Reading Experience**:
- Font size controls (A-/A+)
- Reading progress bar (top fixed)
- Optimized line height and spacing
- Vietnamese-optimized typography

## Technical Requirements

### Functional Requirements

**FR1: Content Rendering**
- Render MDX blog posts with syntax highlighting
- Support markdown formatting with typography plugin
- Generate OG images dynamically
- Handle metadata (date, title, category, readTime)

**FR2: Navigation & Routing**
- App Router with dynamic routes
- URL-based blog filtering by category
- Proper 404 handling
- Vietnamese locale routing

**FR3: Theme Management**
- Dark/light mode toggle
- Persist theme preference
- Apply theme to all components
- Smooth transitions

**FR4: Reading Experience**
- Display reading progress bar
- Font size controls (+/- buttons)
- Reading time estimation
- Optimized typography per language

**FR5: Data Management**
- Load site configuration
- Parse blog metadata from MDX
- Manage habits/running data
- Handle static content files

**FR6: Internationalization**
- Vietnamese UI labels and content
- Locale-specific date formatting
- Proper HTML lang attribute
- OG locale metadata (vi_VN)

### Non-Functional Requirements

**NFR1: Performance**
- Static generation for blog posts (ISG)
- Optimized images with next/image
- Minimal JavaScript bundle
- Fast Time-to-Interactive < 2s

**NFR2: SEO**
- Proper Open Graph metadata
- Structured data for articles
- XML sitemap support
- Canonical URLs

**NFR3: Accessibility**
- WCAG 2.1 AA compliance
- Semantic HTML markup
- Keyboard navigation support
- Screen reader friendly

**NFR4: Responsiveness**
- Mobile-first design
- Tablet and desktop optimization
- Touch-friendly interactive elements
- Flexible layouts

**NFR5: Maintainability**
- Component-based architecture
- Clear file organization
- Type-safe with TypeScript
- Well-documented code

**NFR6: Reliability**
- Zero unhandled errors
- Graceful fallbacks
- Build validation
- Test coverage > 80%

## Success Metrics

### User Engagement
- Monthly page views
- Average session duration
- Blog post read rate
- Click-through to projects/social

### Technical Performance
- Page load time: < 1.5s (First Contentful Paint)
- Lighthouse Score: > 90
- Core Web Vitals: All green
- Mobile performance: Excellent

### Content Metrics
- Blog posts: 30+ articles
- Project portfolio: 10+ projects
- Running achievements: 100+ runs logged
- Category distribution: Balanced across topics

### Quality Metrics
- Test coverage: > 80%
- Build success rate: 100%
- Deployment frequency: Daily capable
- Error rate: < 0.1%

### SEO & Discoverability
- Indexed pages: 100%
- Organic search traffic: Growing
- Backlinks from technical sites
- Featured snippets in search results

## Technical Architecture

### Core Components

**1. Agent Framework**
- Agent definition files (Markdown with frontmatter)
- Agent orchestration engine
- Context management system
- Communication protocol (file-based reports)

**2. Command System**
- Command parser and router
- Argument handling ($ARGUMENTS, $1, $2, etc.)
- Command composition and nesting
- Help and discovery system

**3. Workflow Engine**
- Sequential execution support
- Parallel task scheduling
- Dependency resolution
- Error handling and recovery

**4. Documentation System**
- Repomix integration for codebase compaction
- Template-based doc generation
- Auto-update triggers
- Version tracking

**5. Quality System**
- Test runner integration
- Code review automation
- Type checking and linting
- Security scanning

**6. Release System**
- Semantic versioning engine
- Changelog generation
- GitHub release creation
- Asset packaging

### Technology Stack

**Runtime**:
- Node.js >= 18.0.0
- Bash scripting (Unix hooks)
- PowerShell scripting (Windows hooks)
- Cross-platform hook dispatcher (Node.js)

**AI Platforms**:
- Anthropic Claude (Sonnet 4, Opus 4)
- OpenRouter integration
- Google Gemini (for docs-manager)
- Grok Code (for git-manager)

**Development Tools**:
- Semantic Release
- Commitlint
- Husky (git hooks)
- Repomix (codebase compaction)
- Scout Block Hook (performance optimization)

**CI/CD**:
- GitHub Actions
- Conventional Commits
- Automated versioning

### Integration Points

**MCP Tools**:
- **context7**: Read latest documentation
- **sequential-thinking**: Structured problem solving
- **SearchAPI**: Google and YouTube search
- **review-website**: Web content extraction
- **VidCap**: Video transcript analysis

**External Services**:
- GitHub (Actions, Releases, PRs)
- Discord (notifications)
- NPM (optional package publishing)

## Use Cases

### UC1: Bootstrap New Project
**Actor**: Developer
**Goal**: Create new project from scratch
**Flow**:
1. Run `/bootstrap` command
2. Answer requirement questions
3. AI researches tech stacks
4. Review and approve recommendations
5. AI generates project structure
6. AI implements initial features
7. AI creates tests and documentation
8. Project ready for development

**Outcome**: Fully functional project with tests, docs, CI/CD in < 10 minutes

### UC2: Implement New Feature
**Actor**: Developer
**Goal**: Add feature with full workflow
**Flow**:
1. Run `/ck:cook "add user authentication"`
2. Planner creates implementation plan
3. Researcher agents explore auth solutions
4. Developer reviews and approves plan
5. AI implements code
6. AI writes comprehensive tests
7. AI performs code review
8. AI updates documentation
9. AI commits with conventional message

**Outcome**: Feature complete with tests, docs, and clean git history

### UC3: Debug Production Issue
**Actor**: Developer
**Goal**: Identify and fix production bug
**Flow**:
1. Run `/ck:debug "API timeout errors"`
2. Debugger agent analyzes logs and system
3. Root cause identified
4. Fix plan created
5. AI implements solution
6. Tests validate fix
7. Code review confirms quality
8. Commit and deploy

**Outcome**: Bug fixed with comprehensive testing and documentation

### UC4: Manage Commits and Deployments
**Actor**: Developer
**Goal**: Maintain professional git history
**Flow**:
1. Developer completes feature implementation
2. Run tests via `/ck:test` command
3. Code review via `/ck:cook` workflow
4. Conventional commit via git-manager agent
5. Push to feature branch
6. Create PR via GitHub interface

**Outcome**: Professional commit history and clean PR ready for review

### UC5: Update Documentation
**Actor**: Project Manager
**Goal**: Ensure docs are current
**Flow**:
1. Run `/ck:docs update`
2. Docs manager scans codebase
3. Generates fresh summary with repomix
4. Identifies outdated sections
5. Updates API docs, guides, architecture
6. Validates naming conventions
7. Creates update report

**Outcome**: Documentation synchronized with code

## Constraints & Limitations

### Technical Constraints
- Requires Node.js >= 18.0.0
- Depends on Claude Code or Open Code CLI
- File-based communication has I/O overhead
- Token limits on AI model context windows

### Operational Constraints
- Requires API keys for AI platforms
- GitHub Actions minutes for CI/CD
- Internet connection for MCP tools
- Storage for repomix output files

### Design Constraints
- Agent definitions must be Markdown with frontmatter
- Commands follow slash syntax
- Reports use specific naming conventions
- Conventional commits required

## Risks & Mitigation

### Risk 1: AI Model API Failures
**Impact**: High
**Likelihood**: Medium
**Mitigation**: Retry logic, fallback models, graceful degradation

### Risk 2: Context Window Limits
**Impact**: Medium
**Likelihood**: High
**Mitigation**: Repomix for code compaction, selective context loading, chunking

### Risk 3: Agent Coordination Failures
**Impact**: High
**Likelihood**: Low
**Mitigation**: Validation checks, error recovery, rollback mechanisms

### Risk 4: Secret Exposure
**Impact**: Critical
**Likelihood**: Low
**Mitigation**: Pre-commit scanning, .gitignore enforcement, security reviews

### Risk 5: Documentation Drift
**Impact**: Medium
**Likelihood**: Medium
**Mitigation**: Automated triggers, freshness checks, validation workflows

## Future Roadmap

### Phase 1: Foundation (Complete - v1.0-1.8)
- ✅ Core agent framework
- ✅ Slash command system
- ✅ Automated releases
- ✅ Skills library
- ✅ Documentation system

### Phase 2: Enhancement (Current)
- 🔄 Additional skills (GCP, AWS, Azure)
- 🔄 UI/UX improvements
- 🔄 Performance optimization
- 🔄 Enhanced error handling

### Phase 3: Advanced Features (Planned)
- 📋 Visual workflow builder
- 📋 Custom agent creator UI
- 📋 Team collaboration features
- 📋 Analytics and insights dashboard
- 📋 Multi-language support

### Phase 4: Enterprise (Future)
- 📋 Self-hosted deployment
- 📋 Advanced security features
- 📋 Compliance automation
- 📋 Custom integrations
- 📋 Enterprise support

## Dependencies & Integration

### Required Dependencies
- Node.js runtime environment
- Git version control
- Claude Code or Open Code CLI
- API keys for AI platforms

### Optional Dependencies
- Discord webhook for notifications
- GitHub repository for CI/CD
- NPM account for publishing

### Integrations
- GitHub Actions
- Semantic Release
- Commitlint
- Husky
- Repomix
- Various MCP servers

## Compliance & Standards

### Coding Standards
- YAGNI (You Aren't Gonna Need It)
- KISS (Keep It Simple, Stupid)
- DRY (Don't Repeat Yourself)
- Files < 500 lines
- Comprehensive error handling
- Security-first development

### Git Standards
- Conventional Commits
- Clean commit history
- No AI attribution
- No secrets in commits
- Professional PR descriptions

### Documentation Standards
- Markdown format
- Up-to-date (< 24 hours)
- Comprehensive coverage
- Clear examples
- Proper versioning

### Testing Standards
- Unit test coverage > 80%
- Integration tests for workflows
- Error scenario coverage
- Performance validation
- Security testing

## Glossary

- **Agent**: Specialized AI assistant with specific expertise and responsibilities
- **Slash Command**: Shortcut that triggers agent workflows (e.g., `/ck:plan`)
- **Skill**: Reusable knowledge module for specific technologies or patterns
- **MCP**: Model Context Protocol for AI tool integration
- **Repomix**: Tool for compacting codebases into AI-friendly format
- **Sequential Chaining**: Running agents one after another with dependencies
- **Parallel Execution**: Running multiple agents simultaneously
- **Query Fan-Out**: Spawning multiple researchers to explore different approaches
- **Conventional Commits**: Structured commit message format (type(scope): description)

## Appendix

### Related Documentation
- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Design Guidelines](./design-guidelines.md)

### External Resources
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [Open Code Documentation](https://opencode.ai/docs)
- [Conventional Commits](https://conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

### Support & Community
- GitHub Issues: https://github.com/claudekit/claudekit-engineer/issues
- Discussions: https://github.com/claudekit/claudekit-engineer/discussions
- Repository: https://github.com/claudekit/claudekit-engineer

## Unresolved Questions

1. **Performance Benchmarks**: Need to establish baseline metrics for agent execution times
2. **Multi-Repository Support**: How to handle projects spanning multiple repositories?
3. **Custom AI Model Support**: Should we support other AI platforms beyond Claude and OpenRouter?
4. **Agent Marketplace**: Community-contributed agents and skills distribution mechanism?
5. **Real-Time Collaboration**: How to handle multiple developers using agents simultaneously?
