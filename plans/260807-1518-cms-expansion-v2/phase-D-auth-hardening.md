# Phase D: Auth Hardening

**Priority:** LOW | **Status:** pending | **Depends on:** none

## Overview
Move rate limiter from in-memory to SQLite (survives restarts). Add refresh token rotation with short-lived access tokens.

## Key Insights
- Current rate limiter: in-memory Map in `src/app/api/auth/route.ts`, resets on restart
- Current token: single JWT with 7d expiry stored in localStorage
- Solo user — no multi-user, no TOTP/2FA (YAGNI)

## Requirements
### Functional
- Rate limiter persisted in SQLite
- Short-lived access token (15min) + refresh token (7d)
- Auto-refresh in admin UI before access token expires
- Refresh token in httpOnly cookie

### Non-functional
- Rate limit table auto-cleanup (entries older than 1 hour)
- Refresh token rotation (old token invalidated on use)

## Architecture
```
POST /api/auth          → returns { accessToken } + sets refreshToken cookie
POST /api/auth/refresh  → validates cookie, rotates refresh token, returns new accessToken
```

SQLite table:
```sql
CREATE TABLE IF NOT EXISTS rate_limits (
  ip TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (ip, endpoint)
);
```

## Related Code Files
### Modify
- `src/lib/db.ts` — add rate_limits table + helpers
- `src/lib/auth-utils.ts` — split into access/refresh token functions
- `src/app/api/auth/route.ts` — use SQLite rate limiter, issue refresh cookie
- `src/components/admin/admin-auth-provider.tsx` — auto-refresh logic

### Create
- `src/app/api/auth/refresh/route.ts` — refresh token endpoint

## Implementation Steps
1. Add `rate_limits` table to db.ts schema init
2. Add DB helpers: `checkRateLimit(ip, endpoint, max, windowSec)`, `cleanupExpiredRateLimits()`
3. Replace in-memory rate limiter in auth route with SQLite version
4. Split auth-utils: `signAccessToken()` (15min), `signRefreshToken()` (7d)
5. Update auth POST to set refresh token as httpOnly cookie
6. Create `POST /api/auth/refresh` endpoint with token rotation
7. Update admin-auth-provider to auto-refresh access token
8. Update `requireAuth` to accept short-lived access tokens
9. Test rate limiter persistence and token refresh flow

## Todo
- [ ] Rate limits SQLite table + helpers
- [ ] Migrate auth route to SQLite rate limiter
- [ ] Access/refresh token split
- [ ] Refresh token endpoint
- [ ] httpOnly cookie for refresh token
- [ ] Admin UI auto-refresh
- [ ] Cleanup old rate limit entries
- [ ] Tests for rate limiter and token refresh

## Success Criteria
- Rate limiter survives server restart
- Access token expires in 15min, auto-refreshes seamlessly
- Refresh token in httpOnly cookie (not accessible to JS)
- Old refresh tokens invalidated after use

## Risk Assessment
- Cookie not sent in dev (localhost): set `Secure: false` in dev, `true` in prod
- Token refresh race condition: debounce refresh calls in provider
- SQLite rate_limits growth: cleanup on each auth request (delete entries > 1 hour)

## Security
- Refresh token rotation prevents token reuse
- httpOnly cookie prevents XSS token theft
- Rate limiter prevents brute force even after restart
- Timing-safe password comparison already in place
