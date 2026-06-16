# Project: Full-Stack Task Manager — CLAUDE.md

## Tech Stack
- Backend: Spring Boot 4.0.7, Java 17, Spring Data JPA, H2 (in-memory)
- Frontend: Angular 18 (standalone components), TypeScript, SCSS
- Build: Maven Wrapper (`mvnw`) for backend, npm/Angular CLI for frontend

## Layout
- `backend/src/main/java/com/demo/taskmanager/`
  - `model/` — JPA entities and enums (`Task`, `TaskStatus`, `Priority`)
  - `repository/` — Spring Data repositories
  - `dto/` — request/response records
  - `service/` — business logic and exceptions
  - `web/` — REST controllers and `@RestControllerAdvice`
  - `config/` — CORS config, data seeding
- `frontend/src/app/`
  - `models/` — TypeScript interfaces mirroring the DTOs
  - `services/` — `HttpClient` API wrappers
  - `components/` — standalone feature components

## Spring Boot 4 gotchas (different from 3.x)
- Web starter is `spring-boot-starter-webmvc` (not `-web`).
- The fat `spring-boot-starter-test` is split into module test starters
  (`spring-boot-starter-webmvc-test`, `-data-jpa-test`, `-validation-test`).
- `@AutoConfigureMockMvc` lives in `org.springframework.boot.webmvc.test.autoconfigure`.
- Jackson 3 ships by default — its packages are `tools.jackson.*`, not
  `com.fasterxml.jackson.*`.
- Uses Jakarta EE 11 (`jakarta.*` imports).

## Coding Standards
- Backend: constructor injection (no field `@Autowired`); DTOs as `record`s; validate
  request bodies with `@Valid`; return `ProblemDetail` for errors.
- Frontend: standalone components only; inject with `inject()`; reactive forms; keep API
  calls in services, not components.

## Conventions
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`.
- Run `./mvnw test` (backend) and `npm run build` (frontend) before declaring work done.

## What to be careful with
- The H2 database is in-memory; data resets on restart and is re-seeded by `DataSeeder`.
- CORS origins are configured via `app.cors.allowed-origins` in `application.properties`.
