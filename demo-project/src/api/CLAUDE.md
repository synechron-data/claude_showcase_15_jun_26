# CLAUDE.md — src/api/

HTTP layer only — no business logic lives here. Routes delegate to `authService`, middleware delegates to `tokenHelper`.

## Files

- **`routes.js`** — Express router mounted at `/api/auth`. Handles request parsing, input validation, and response shaping.
- **`middleware.js`** — Reusable Express middleware: request logging, JWT auth, body validation, global error handler.

## Endpoints

| Method | Path | Auth required | Middleware | Notes |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | No | `validateBody(['email', 'password'])` | Returns `{ accessToken, refreshToken, user }` |
| `POST` | `/api/auth/refresh` | No | `validateBody(['refreshToken'])` | Returns `{ accessToken }` |
| `POST` | `/api/auth/logout` | Yes | `authenticate` | Revokes refresh token; `refreshToken` in body is optional |
| `GET` | `/api/auth/me` | Yes | `authenticate` | Returns `req.user` (decoded JWT payload) |

## Middleware reference

| Export | Purpose | Usage |
|---|---|---|
| `requestLogger` | Logs method, path, status, duration on response finish | Registered globally in `index.js` |
| `authenticate` | Extracts + verifies Bearer token; populates `req.user` | Apply to any protected route |
| `validateBody(fields)` | Returns middleware that 400s if any listed field is missing/empty | Pass field name array: `validateBody(['email'])` |
| `errorHandler` | Catches `next(err)` calls; returns 500 JSON | Must be registered last in `index.js` |

## Conventions

- Routes do input validation (email format, password length) before calling service functions — service functions do not re-validate. Email is sanitized via `sanitizeString` before being passed to `validateEmail` (strips whitespace and control characters), so the cleaned value flows through to `loginUser` as well. `validateEmail` enforces a strict regex: local part `[a-zA-Z0-9._%+\-]+`, domain `[a-zA-Z0-9.\-]+`, TLD letters-only min 2 chars.
- All `async` route handlers pass unexpected errors to `next(err)` so `errorHandler` catches them; only known error messages (e.g. `'Invalid credentials'`) are handled inline with explicit status codes.
- Mock user record in `POST /login` (line 32–37) replaces a real DB lookup — swap with a database query when wiring up persistence.
