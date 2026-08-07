# Phase 6: Deployment & README

## Context Links
- next.config.ts: already has `output: "standalone"`
- Package.json: `npm run build` uses `--turbopack`
- Security headers: already configured in next.config.ts

## Overview
- **Priority:** P2
- **Status:** Pending
- **Description:** Add Dockerfile for standalone deployment, `.dockerignore`, and `README.md` with setup/build/deploy instructions.

## Key Insights
- `output: "standalone"` already configured — produces minimal Node.js server
- Standalone output goes to `.next/standalone/` with `server.js` entry point
- Static assets need manual copy from `.next/static/` and `public/`
- Multi-stage Docker build keeps image small (~150MB)
- `--turbopack` in build script — verify Docker build works with it

## Requirements
**Functional:**
- Multi-stage Dockerfile: deps -> build -> runtime
- `.dockerignore` excluding node_modules, .next, .git, plans
- `README.md` with: project description, tech stack, local setup, build, Docker deployment, environment variables, project structure

**Non-functional:**
- Docker image < 200MB
- Non-root user in container
- NEXT_PUBLIC_SITE_URL configurable at build time
- README clear enough for any developer to get running in < 5 minutes

## Architecture
```
Dockerfile                   → multi-stage build
.dockerignore                → exclude non-essential files
README.md                    → project documentation
```

**Build flow:** `npm ci` -> `npm run build` -> copy standalone + static -> run `server.js`

## Related Code Files
- **Create:** `Dockerfile`, `.dockerignore`, `README.md`
- **Modify:** None (next.config.ts already configured)

## Implementation Steps
1. Create `Dockerfile`:
   ```
   Stage 1 (deps): node:20-alpine, copy package*.json, npm ci
   Stage 2 (build): copy source, npm run build
   Stage 3 (runner): node:20-alpine, copy .next/standalone, .next/static, public
   - Set HOSTNAME=0.0.0.0, PORT=3000
   - Run as non-root user (nextjs:nodejs)
   - CMD ["node", "server.js"]
   ```
2. Create `.dockerignore`:
   - `.git`, `node_modules`, `.next`, `plans`, `.claude`, `*.md` (except README)
3. Create `README.md`:
   - Project title + description
   - Tech stack list
   - Prerequisites (Node 20+, npm)
   - Quick start: `npm install && npm run dev`
   - Build: `npm run build && npm start`
   - Docker: `docker build -t myblog . && docker run -p 3000:3000 myblog`
   - Environment variables table
   - Project structure overview
   - License
4. Test Docker build locally: `docker build -t myblog .`
5. Test container runs: `docker run -p 3000:3000 myblog`

## Todo List
- [ ] Create `Dockerfile` (multi-stage, standalone)
- [ ] Create `.dockerignore`
- [ ] Create `README.md` with full setup instructions
- [ ] Test Docker build succeeds
- [ ] Test container serves site correctly
- [ ] Verify non-root user in container

## Success Criteria
- `docker build` completes without errors
- Container starts and serves site on port 3000
- README enables cold-start setup in < 5 minutes
- Docker image < 200MB
- No secrets in image

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Turbopack build fails in Docker | Low | High | Remove `--turbopack` from build script if needed (it's optional for prod) |
| Static files missing in standalone | Medium | High | Explicit COPY for `.next/static` and `public/` in Dockerfile |
| Content files not included | Medium | High | Already handled: `outputFileTracingIncludes` in next.config.ts |

## Security Considerations
- Non-root user in Docker container
- No `.env` files in image (use runtime env vars)
- `.dockerignore` excludes plans, .claude, .git

## Next Steps
- Configure CI/CD pipeline (GitHub Actions) — separate future plan
- Set up domain and SSL (deployment platform dependent)
