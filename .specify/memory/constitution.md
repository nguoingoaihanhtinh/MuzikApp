# Lora’s Music Constitution

<!--
Sync Impact Report
- Version change: N/A → 1.0.0
- Modified principles: N/A (initial ratification)
- Added sections: "Development Standards", "Workflow and Governance"
- Removed sections: None
- Templates requiring updates:
	✅ .specify/templates/plan-template.md (Constitution Check gates added)
	✅ .specify/templates/tasks-template.md (Path conventions aligned to repo)
	✅ .specify/templates/spec-template.md (No change needed; confirmed alignment)
- Follow-up TODOs: None
-->

## Core Principles

### I. Naming & Code Style (C# and TypeScript)

Non‑negotiables:

- C#
  - Types, methods, properties: PascalCase. Private fields: \_camelCase. Parameters/locals: camelCase.
  - Interfaces prefixed with I (e.g., IAlbumRepository). Async methods end with Async.
  - DTO suffix Dto (e.g., UserDto); entities singular (e.g., Song). Files match type name.
  - Enable nullable reference types. Prefer var for locals when type is obvious. No magic strings; use constants/enums.
  - Logging via Microsoft.Extensions.Logging with structured messages. DI mandatory; no service locator.
  - Use expression-bodied members where clearer; keep methods focused (<50 LOC when practical).
- TypeScript/React (Next.js)
  - Components and types/interfaces: PascalCase. Functions/variables: camelCase. Hooks: useXxx.
  - File names: ComponentName.tsx, useThing.ts, thing.service.ts, thing.types.ts.
  - Avoid any; use unknown + narrowing. Prefer union/types over enums unless interop requires.
  - Prettier + ESLint enforced. No default exports for shared components/utilities; prefer named exports.

Rationale: Consistent, predictable code reduces review time, defects, and onboarding friction.

### II. Modular Structure (Reusable Components & Services)

Non‑negotiables:

- Backend (ASP.NET Core)
  - Controllers are thin; business logic in Services; data access in Repositories. Interfaces live in Interfaces/.
  - DTOs isolate API contracts from Entities. Automapper profiles in Helpers/AutoMapperProfiles.cs.
  - Cross‑cutting concerns via Middleware and Extensions; no duplication across controllers.
- Frontend (Next.js App Router)
  - UI split into components/ui (pure) and components/features (feature‑scoped composites).
  - Data fetching and mutations encapsulated in services/api clients under src/services/ with typed responses.
  - Shared utilities in src/libs. State isolated per feature under stores/; global state only when unavoidable.

Rationale: Modularity enables reuse, testability, and parallel work without merge churn.

### III. Test‑First Discipline

Non‑negotiables:

- Backend: Unit tests (xUnit + FluentAssertions) for services and helpers. Repository tests use test DB or in‑memory provider with realistic behavior.
- Frontend: Integration/E2E tests with Playwright; component tests with React Testing Library + Vitest (or Jest).
- Red‑Green‑Refactor: write/adjust tests in the same PR as the change; PRs without tests require explicit justification.
- Minimum coverage gates in CI: backend 70% lines on services/helpers; frontend components critical paths covered; E2E smoke for top flows.

Rationale: Tests are executable specs and safety nets for refactors.

### IV. Simplicity & Maintainability

Non‑negotiables:

- Prefer standard library and existing project abstractions before adding dependencies.
- Keep functions small and single‑purpose; avoid deep inheritance. Favor composition.
- Public APIs documented via XML docs (backend) and JSDoc/TSDoc (frontend) where not self‑evident.
- Complexity must be justified in PR description. Technical debt tracked and time‑boxed.

Rationale: Simple code costs less to change and has fewer defects.

### V. Version Control & Commit Discipline

Non‑negotiables:

- GitFlow‑light: main (protected), develop (optional), feature/_, bugfix/_, chore/_, release/_.
- Conventional Commits: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
- Small, focused commits; avoid unrelated changes. Rebase feature branches before merge; squash on merge to main.
- Semantic Versioning for releases. Breaking changes require MAJOR bump and migration notes.

Rationale: Clean history improves traceability and release reliability.

## Development Standards

### Folder Structure Conventions

- Backend (ASP.NET Core) in Muzik/
  - Controllers/
  - DTOs/
  - Entities/
  - Data/ (DbContext, Migrations, Seed)
  - Interfaces/
  - Repositories/
  - Services/
  - Helpers/ (e.g., AutoMapperProfiles, JwtHelper)
  - Extensions/ (DI, options)
  - Middleware/
  - Assets/, Config files (appsettings.\*.json)
  - Tests: Muzik.Tests/ (xUnit) [to be added if not present]
- Frontend (Next.js + Tailwind) in client/
  - src/app/ (routes, layouts)
  - src/components/ui/ and src/components/features/
  - src/services/ (API clients, Cloudinary helpers)
  - src/contexts/, src/stores/ (Zustand/Context)
  - src/libs/ (utilities)
  - src/types/
  - public/ (assets)
  - tests/ (unit with Vitest/RTL, e2e with Playwright)

### Coding Guidelines

- Backend (C#)
  - Validate inputs at boundaries (controllers/services). Return ProblemDetails for errors.
  - CancellationTokens on async endpoints. Async all the way. Avoid sync over async.
  - Use EF Core with explicit Include only when needed; pagination with PagedList helper.
  - Configuration via IOptions<T> bound from appsettings; no direct Environment access in services.
- Frontend (TSX)
  - Server actions/data in app router use async/await; cache appropriately with revalidate.
  - Accessibility first: semantic HTML, aria‑labels, keyboard support, focus management.
  - Tailwind utility‑first with small component classes; extract patterns to reusable components.

### CI/CD Expectations

- Pull Requests:
  - Build backend (dotnet build), run tests, dotnet format --verify-no-changes.
  - Build frontend (install/build with project package manager), run linters (eslint), run unit tests.
  - Run Playwright smoke e2e on PRs to main when feasible.
- Releases:
  - Tag with SemVer. Build and push Docker images for client and backend.
  - Apply database migrations automatically on startup or as a separate job.

### Docker Configuration Rules

- Use provided Dockerfiles (Muzik/Dockerfile and client/Dockerfile) with multi‑stage builds.
- docker-compose.yml orchestrates: backend (ASP.NET), frontend (Next.js), postgres, and any reverse proxy.
- Environment variables come from .env files and CI secrets; never commit secrets. NEXT*PUBLIC*\* for client‑side exposure only.
- Healthchecks required for services; minimal base images (e.g., aspnet:alpine, node:20‑alpine) when possible.
- Bind volumes only in development; production images are immutable.

### Security & Environment Management

- Store secrets in CI/secret manager; local development uses .env (git‑ignored).
- Backend
  - Use HTTPS, validate JWTs, limit CORS origins. Rate limit and log auth events.
  - Cloudinary credentials via configuration; validate file types and size limits server‑side.
- Frontend
  - Only expose non‑sensitive vars via NEXT*PUBLIC*. Never embed secrets in the bundle.
  - Sanitize user input rendered as HTML. Avoid dangerouslySetInnerHTML unless audited.

### Accessibility & UI/UX Standards

- Target WCAG 2.1 AA. Ensure keyboard accessibility and visible focus states.
- Maintain color contrast ≥ 4.5:1, provide alt text, labels, and ARIA where needed.
- Responsive layouts across breakpoints; respect prefers-reduced-motion.

## Workflow and Governance

### Git Branching Model

- Branches: feature/<slug>, bugfix/<slug>, chore/<slug>, release/<version>.
- main is protected; only fast‑forward merges from reviewed PRs.

### Code Review & Testing Gates

- Two approvals recommended (one mandatory). CI must be green.
- Required checks: format, lint, unit tests (backend and frontend), integration/E2E smoke.
- Large PRs (>500 LOC changed) must be split unless justified.

### Deployment Pipeline

- On merge to main: build images, run migrations, deploy to target environment, run smoke tests.
- Rollback strategy documented per environment; use immutable artifacts per release tag.

### Amendment Process

- This Constitution supersedes conflicting guidelines elsewhere.
- Amend via PR labeled constitution with a Sync Impact Report summary.
- Versioning of this document follows SemVer:
  - MAJOR: incompatible principle changes/removals.
  - MINOR: new principle/section or significant guidance expansion.
  - PATCH: clarifications/typos without semantic changes.
- Compliance: Reviewers enforce gates; violations must be justified and tracked.

## Governance

All contributors MUST adhere to the principles and standards above. The governance process ensures
consistency, safety, and quality across backend and frontend deliverables. The Constitution is the
single source of truth for delivery discipline.

**Version**: 1.0.0 | **Ratified**: 2025-10-14 | **Last Amended**: 2025-10-14
