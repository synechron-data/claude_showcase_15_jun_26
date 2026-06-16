# Full-Stack Task Manager — Spring Boot 4 + Angular 18

A small but complete CRUD application built to demonstrate using **Claude Code** on a
full-stack Java + TypeScript project.

| Layer    | Tech                                                      |
| -------- | --------------------------------------------------------- |
| Backend  | Spring Boot 4.0.7, Java 17, Spring Data JPA, H2 (in-mem)  |
| Frontend | Angular 18 (standalone components), TypeScript, SCSS      |
| API      | REST + JSON, RFC 9457 `ProblemDetail` error responses     |

```
fullstack-task-app/
├── backend/     # Spring Boot REST API  (port 8080)
└── frontend/    # Angular SPA           (port 4200)
```

## Prerequisites

- **JDK 17+** (`java -version`)
- **Node 18.19+ / 20.11+ / 22+** and npm (`node -v`)
- No Maven install needed — the backend ships the Maven Wrapper (`mvnw`).

## Running the app

Open two terminals.

### 1. Backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

- API base: `http://localhost:8080/api`
- H2 console: `http://localhost:8080/h2-console`
  (JDBC URL `jdbc:h2:mem:taskdb`, user `sa`, empty password)
- The DB is in-memory and re-seeded with sample tasks on each start.

### 2. Frontend (port 4200)

```bash
cd frontend
npm install        # first time only
npm start          # ng serve
```

Open `http://localhost:4200`. The Angular dev server talks to the API at
`http://localhost:8080/api` (configured in `frontend/src/environments/environment.ts`;
CORS is allowed for `http://localhost:4200` in the backend).

## REST API

Base path `/api/tasks`.

| Method | Path              | Description                          | Success |
| ------ | ----------------- | ------------------------------------ | ------- |
| GET    | `/api/tasks`      | List tasks (`?status=TODO` filter)   | 200     |
| GET    | `/api/tasks/{id}` | Get one task                         | 200     |
| POST   | `/api/tasks`      | Create a task                        | 201     |
| PUT    | `/api/tasks/{id}` | Replace a task                       | 200     |
| DELETE | `/api/tasks/{id}` | Delete a task                        | 204     |

### Task shape

```json
{
  "id": 1,
  "title": "Set up CI pipeline",
  "description": "Configure GitHub Actions",
  "status": "IN_PROGRESS",      // TODO | IN_PROGRESS | DONE
  "priority": "HIGH",           // LOW | MEDIUM | HIGH
  "dueDate": "2026-06-18",      // ISO date or null
  "createdAt": "2026-06-16T05:23:52Z",
  "updatedAt": "2026-06-16T05:23:52Z"
}
```

### Try it with curl

```bash
# list
curl http://localhost:8080/api/tasks

# create
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs","status":"TODO","priority":"MEDIUM"}'
```

## Tests

```bash
cd backend  && ./mvnw test     # JUnit + MockMvc integration tests
cd frontend && npm test        # Karma/Jasmine (needs Chrome)
```

## Notes for the demo

This project pairs with `../demo-project` and the repo's `notes/` to showcase Claude
Code on a real codebase: scaffolding, multi-file edits, running builds/tests, and fixing
framework-version gotchas (e.g. Spring Boot 4 moved test starters and ships Jackson 3).
