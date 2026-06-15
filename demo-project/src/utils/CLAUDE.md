# CLAUDE.md — src/utils/

Stateless, pure-function helpers. No Express, no auth logic, no side effects (except logger I/O).

## Files

- **`logger.js`** — Structured JSON logger. Respects `LOG_LEVEL` env var (`error | warn | info | debug`). Writes errors to stderr, everything else to stdout. Use this instead of `console.log` everywhere in `src/`.
- **`validators.js`** — Input validation and sanitization. All functions return `boolean` or a cleaned `string`; they never throw.

## Validators reference

| Function | Input | Returns |
|---|---|---|
| `validateEmail(email)` | string | boolean — local part `[a-zA-Z0-9._%+\-]+`, domain `[a-zA-Z0-9.\-]+`, TLD letters-only min 2 chars |
| `validatePassword(password)` | string | boolean (min 8 chars) |
| `validateUUID(id)` | string | boolean (UUID v4) |
| `sanitizeString(input)` | string | trimmed string, control chars stripped |

## Adding new utilities

- Keep functions pure and side-effect-free
- Export from the file directly — no barrel `index.js`
- Every new function must have a JSDoc comment and at least one unit test in `tests/utils/`
