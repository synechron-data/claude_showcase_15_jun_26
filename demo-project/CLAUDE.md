# Project: Demo App — CLAUDE.md

## Tech Stack
- Runtime: Node.js v20
- Framework: Express.js v4
- Database: PostgreSQL with Prisma ORM
- Testing: Jest
- Language: TypeScript for all new code only

## Architecture
- `src/auth/` — authentication and token management
- `src/api/` — route handlers and middleware
- `src/utils/` — shared utility functions
- `tests/` — mirrors src structure, file.test.ts naming

## Coding Standards
- Always use async/await, never raw Promises
- All functions must have JSDoc comments
- No console.log in production code — use the logger utility
- Every new function must have at least one unit test

## What Claude Must Never Do
- Never modify .env or .env.* files
- Never push directly to main branch
- Never remove existing tests
- Never install packages without confirming with the developer

## PR and Git Standards
- Commit messages follow Conventional Commits: feat:, fix:, docs:, test:
- PR descriptions must include: what changed, why it changed, how to test