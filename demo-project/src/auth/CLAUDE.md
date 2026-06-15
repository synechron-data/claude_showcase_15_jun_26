# CLAUDE.md — src/auth/

Core authentication logic. Two files with distinct responsibilities — keep them separate.

## Files

- **`authService.js`** — Stateful business logic: credential verification, token generation, in-memory refresh token store (`Map`). This is the only file that touches `bcryptjs` and `uuid`.
- **`tokenHelper.js`** — Stateless JWT utilities: parse, verify, decode, extract. No store access, no side effects.

## API reference

### authService.js

| Export | Signature | Notes |
|---|---|---|
| `loginUser` | `async (email, password, userRecord) → { accessToken, refreshToken, user }` | `userRecord` must include `passwordHash` |
| `refreshToken` | `(refreshToken) → { accessToken }` | Validates against in-memory store; deletes expired tokens |
| `revokeToken` | `(token) → boolean` | Logout — removes token from store |
| `isTokenExpired` | `(token) → boolean` | Decodes without verifying; checks `exp` claim |
| `generateAccessToken` | `(user) → string` | JWT signed with `JWT_SECRET`, TTL from `JWT_EXPIRES_IN` |
| `generateRefreshToken` | `(userId) → string` | UUID v4 stored in Map with `userId` + `createdAt` |

### tokenHelper.js

| Export | Signature | Notes |
|---|---|---|
| `verifyToken` | `(token) → payload` | Throws on expired or invalid — use in auth middleware |
| `decodeToken` | `(token) → payload\|null` | No signature check — read-only, non-sensitive claims only |
| `extractBearerToken` | `(authHeader) → string\|null` | Strips `"Bearer "` prefix |
| `getTokenTTL` | `(token) → number` | Remaining seconds; 0 if expired or undecodable |

## Known intentional demo bugs

These are present for learning/showcase purposes — do not fix unless instructed:

1. **`authService.js:32`** — `bcrypt.compare` is missing `await`; always resolves to a truthy Promise, so password validation never fails.
2. **`authService.js:68`** — `isTokenExpired` returns `decoded.exp > now` (inverted logic); returns `true` for valid tokens and `false` for expired ones.
3. **`authService.js:92`** — `await getUserById(...)` inside `refreshToken`, which is not declared `async`; will throw at runtime.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `JWT_SECRET` | `dev-secret-key` | Signing key — must be 32+ chars in production |
| `JWT_EXPIRES_IN` | `1h` | Access token TTL |
| `REFRESH_EXPIRES_IN` | `7d` | Refresh token TTL (stored in Map only) |
