# Implementation Plan: Lora’s Music – Core App Capabilities

**Branch**: `001-title-lora-s` | **Date**: 2025-10-14 | **Spec**: specs/001-title-lora-s/spec.md
**Input**: Feature specification from `/specs/001-title-lora-s/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a Spotify-like MVP enabling authentication, playback (play/pause/skip/shuffle), playlist management, artist uploads, search, and admin moderation. Client (Next.js TypeScript) consumes a RESTful ASP.NET Core API backed by PostgreSQL. Media files (audio, artwork) are uploaded to and served via Cloudinary using signed URLs. Containers orchestrated with Docker Compose; deploy to Azure (primary) or Render (staging). CI gates enforce build/lint/test and basic coverage.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: C# (.NET 8), TypeScript (ES2022), Node 20 LTS  
**Primary Dependencies**: ASP.NET Core Web API, EF Core (Npgsql), AutoMapper, FluentValidation; Next.js (App Router), React, TailwindCSS; Cloudinary SDK  
**Storage**: PostgreSQL (primary data), Cloudinary (audio/artwork)  
**Testing**: Backend xUnit + FluentAssertions; Frontend Vitest + React Testing Library; E2E Playwright  
**Target Platform**: Containers (Linux) on Azure (Container Apps/Web Apps + Azure Database for PostgreSQL) or Render  
**Project Type**: Web app (frontend + backend)  
**Performance Goals**: <200ms avg API response (p50), <2s song load time to audible playback (p95)  
**Constraints**: Streaming via signed URLs; no offline downloads; moderation required before public visibility  
**Scale/Scope**: MVP scope per spec; single region deployment initially

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The plan MUST address the following gates from the Constitution:

- Naming & Style: Confirm C# (PascalCase, Async suffix, DTO suffix) and TS (PascalCase components, camelCase funcs) conventions.
- Modularity: Controllers thin, services/repositories separation; Next.js services for data; reusable UI components.
- Test Plan: Backend unit tests (xUnit) and frontend integration/E2E (RTL/Playwright) defined for this feature.
- Simplicity: Justify any added dependency or abstraction beyond existing patterns.
- Git & CI: Branch naming, Conventional Commits, and CI checks (build, lint, tests) defined.

Gate evaluation (pre-design):

- Naming & Style: Confirmed. C# PascalCase/Async suffix/Dto suffix; TS PascalCase components, camelCase functions. Enforced by analyzers + ESLint/Prettier.
- Modularity: Confirmed. Thin controllers; services + repositories; Next.js services for data and reusable UI components.
- Test Plan: Confirmed. Unit tests for services/helpers; component/integration tests; Playwright smoke. Coverage thresholds: backend ~70% on services/helpers.
- Simplicity: Confirmed. Use existing abstractions; no additional architectural layers beyond services/repos/mappers.
- Git & CI: Confirmed. Branches feature/_, bugfix/_; Conventional Commits; CI runs build/lint/test for both apps.

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
```

**Structure Decision**: Use existing `Muzik/` (backend) and `client/` (frontend) roots with subfolders as shown. Tests live alongside respective apps.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |

---

## Architecture Overview

- Flow: Client (Next.js) → API (ASP.NET Core) → PostgreSQL.
- Media: Artists upload audio/artwork; server validates and issues signed upload/persist metadata; clients stream via signed delivery URLs.
- Authentication: Session/JWT based; role-aware (Listener, Artist, Admin).
- Observability: Structured logs; basic request metrics; health endpoints.

Diagram (conceptual):
Client (Web) ⇄ API Gateway/Controllers ⇄ Services ⇄ Repositories ⇄ PostgreSQL
⇵
Cloudinary

## Backend Modules

- Auth: registration, login, token refresh, roles; user preferences.
- Songs: CRUD (admin/artist as permitted), metadata, playback URL issuance, search support.
- Playlists: CRUD, track ordering, add/remove tracks.
- Artists: upload management, track listings, profile.
- Admin: moderation queue (approve/reject/remove), reports.

## Frontend Modules

- Player: playback bar, queue, controls (play/pause/skip/shuffle), progress.
- Library: user playlists, liked/recent (future), search results.
- Upload: artist dashboard to upload/manage tracks and artwork.
- Profile: user settings (theme, preferences), artist profile.
- Admin: moderation dashboard for pending/reported items.

## API Design (REST examples)

- Auth: POST /api/auth/register, POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout
- Songs: GET /api/songs?query=&genre=&page=, GET /api/songs/{id}, POST /api/songs (artist), PUT /api/songs/{id}, DELETE /api/songs/{id}
- Playback: GET /api/songs/{id}/stream-url (returns time-limited URL)
- Playlists: GET /api/playlists, POST /api/playlists, GET /api/playlists/{id}, PUT /api/playlists/{id}, DELETE /api/playlists/{id}, POST /api/playlists/{id}/tracks, DELETE /api/playlists/{id}/tracks/{trackId}, PATCH /api/playlists/{id}/reorder
- Artists: GET /api/artists/me/tracks, POST /api/artists/me/tracks (upload init), PUT /api/artists/me/tracks/{id}, DELETE /api/artists/me/tracks/{id}
- Admin: GET /api/admin/moderation, POST /api/admin/moderation/{id}/approve, POST /api/admin/moderation/{id}/reject, DELETE /api/admin/tracks/{id}
- Search: GET /api/search?query=&type=song|artist|album

Schemas are defined in contracts/openapi.yaml.

## Docker Setup

- Compose services:
  - api: build from `Muzik/Dockerfile`, expose 5000, depends_on db, env from `.env`.
  - client: build from `client/Dockerfile`, expose 3000, env NEXT_PUBLIC_API_BASE_URL.
  - db: postgres:15 with volume for persistence, healthcheck.
  - (optional) reverse proxy for unified origin.
- Multi-stage builds; production images are immutable; volumes bound only in dev.

## CI/CD Plan

- CI (PRs):
  - Backend: dotnet restore/build/test; dotnet format --verify-no-changes.
  - Frontend: install deps, eslint, unit tests (Vitest); Playwright smoke (selected PRs/main).
  - Build container images (no push) to validate Dockerfiles.
- CD (main):
  - Build and push images; apply migrations; deploy to Azure (Container Apps/Web App + Azure PostgreSQL) or Render.
  - Run post-deploy smoke tests.

## Project Structure (recommended)

See tree above; add `Muzik.Tests/` for backend unit tests and `client/tests/` for frontend unit/E2E.

## Performance Targets

- API average response <200ms (p50) for typical CRUD/search requests; p95 < 500ms under nominal load.
- Song load time to audible playback <2s (p95) assuming warm CDN and normal network.

## Constitution Check (post-design re-eval)

Gates remain satisfied; no new dependencies beyond declared. Any non-trivial additions require justification.
