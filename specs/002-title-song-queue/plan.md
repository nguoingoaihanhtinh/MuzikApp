# Implementation Plan: Song Queue System

**Branch**: `002-title-song-queue` | **Date**: 2025-10-18 | **Spec**: specs/002-title-song-queue/spec.md
**Input**: Feature specification from `/specs/002-title-song-queue/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a per-user playback queue enabling add, view, remove, and reorder of upcoming songs without interrupting current playback. The backend exposes REST endpoints to manage the queue persisted in PostgreSQL. The frontend provides a QueuePanel, “Add to Queue” actions, and a useQueue() hook to sync local state with server state. Player advances automatically on track end and reflects queue changes promptly with optimistic updates and server reconciliation.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: C# (.NET 8), TypeScript (ES2022)  
**Primary Dependencies**: ASP.NET Core Web API, EF Core (Npgsql); Next.js (App Router), React, TailwindCSS  
**Storage**: PostgreSQL (QueueItem + queue metadata)  
**Testing**: Backend xUnit + FluentAssertions; Frontend Vitest + RTL; E2E Playwright (smoke)  
**Target Platform**: Containers (Docker Compose)  
**Project Type**: Web app (frontend + backend)  
**Performance Goals**: <200ms avg API response for queue ops; UI reflects add/remove/reorder within 200ms; player auto-advance reliability 99%  
**Constraints**: No WebSocket requirement; client uses optimistic updates + pull-based sync; authorization enforced  
**Scale/Scope**: Per-user queue; initial release excludes multi-device live sync

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The plan MUST address the following gates from the Constitution:

- Naming & Style: Confirm C# (PascalCase, Async suffix, DTO suffix) and TS (PascalCase components, camelCase funcs) conventions.
- Modularity: Controllers thin, services/repositories separation; Next.js services for data; reusable UI components.
- Test Plan: Backend unit tests (xUnit) and frontend integration/E2E (RTL/Playwright) defined for this feature.
- Simplicity: Justify any added dependency or abstraction beyond existing patterns.
- Git & CI: Branch naming, Conventional Commits, and CI checks (build, lint, tests) defined.

Gate evaluation (pre-design):

- Naming & Style: API types and TS components follow project conventions (PascalCase, camelCase, Async suffix, DTO suffix).
- Modularity: New QueueController is thin; QueueService encapsulates logic; QueueRepository handles persistence. Frontend uses useQueue() and component composition.
- Test Plan: Backend unit tests for QueueService (add/remove/reorder/advance); Frontend component/integration tests for QueuePanel and hook; E2E smoke on main flows.
- Simplicity: No new infrastructure beyond DB rows; avoid WebSockets for MVP to reduce complexity.
- Git & CI: feature/002-title-song-queue branch; Conventional Commits; CI build/lint/test for both apps.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# Web application structure (frontend + backend present in this repo)
Muzik/                     # ASP.NET Core backend
├── Controllers/
├── DTOs/
├── Entities/
├── Data/
├── Interfaces/
├── Repositories/
├── Services/
├── Helpers/
├── Extensions/
├── Middleware/
└── Tests/                 # if applicable

client/                    # Next.js frontend
├── src/app/
├── src/components/
├── src/services/
├── src/libs/
├── src/stores/
├── src/types/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Implement QueueController/Service/Repository in `Muzik/`. Frontend: `client/src/components/features/queue/QueuePanel.tsx`, `client/src/hooks/useQueue.ts`, and “Add to Queue” button variants within song cards and player UI. Tests live under respective app test folders.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |

---

## Architecture Overview

- Flow: Client (Next.js) → Queue API (ASP.NET Core) → PostgreSQL.
- Queue state is server-authoritative; client maintains a local mirror and reconciles after each operation.
- Playback integration: when current track ends, player requests next from queue and updates UI.

## Backend Modules

- Entities: QueueItem { Id, SongId, UserId, Position, AddedAt }.
- Repository: IQueueRepository with methods GetUserQueue, Add, Remove, Reorder, Advance.
- Service: QueueService for validation, ordering, and business rules (e.g., duplicate prevention toggle).
- Controller: QueueController with routes:
  - GET /api/queue → current user queue (current + upcoming)
  - POST /api/queue/add → add song(s) to queue
  - DELETE /api/queue/{songId} → remove song
  - PUT /api/queue/reorder → reorder upcoming
  - (internal) POST /api/queue/advance → advance on track end (or handled by player consuming GET and PUT)
- Return updated queue state on each mutation.

## Frontend Modules

- QueuePanel component: displays current track and upcoming list; supports remove and drag-to-reorder.
- Add to Queue: buttons on song cards and player UI trigger add operation and show toast.
- Hook useQueue(): exposes queue state, actions (add/remove/reorder/fetch), and handles optimistic updates + revalidation.
- Auto-refresh: player subscribes to queue changes (via hook state/revalidation) to keep playback in sync.

## API Design (subset)

- GET /api/queue → 200 { current: TrackSummary|null, upcoming: TrackSummary[] }
- POST /api/queue/add { songId: string } → 200 { queue }
- DELETE /api/queue/{songId} → 200 { queue }
- PUT /api/queue/reorder { orderedSongIds: string[] } → 200 { queue }

Error handling: 400 invalid songId/order; 401 unauthorized; 404 song not found/unavailable.

## Docker Setup

- Use existing compose: api, client, db services.
- No additional containers. Migrations run with the API startup or a separate job.
- Healthchecks confirm API and DB readiness.

## CI/CD Plan

- PR checks:
  - Backend: build/test; add QueueService unit tests for add/remove/reorder/advance.
  - Frontend: lint/unit tests; integration tests for QueuePanel and useQueue hook; optional Playwright smoke.
  - Build images to validate Dockerfiles.
- Main branch:
  - Build & push images, run DB migrations, deploy, run smoke tests for add/remove/reorder flows.

## Performance Targets

- API queue endpoints p50 < 200ms, p95 < 500ms under nominal load.
- UI reflects add/remove/reorder within 200ms (optimistic update; reconcile on response).

## Constitution Check (post-design re-eval)

All gates satisfied; no new complexity introduced beyond standard patterns.
