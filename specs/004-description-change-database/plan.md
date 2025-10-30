# Implementation Plan: Migrate Database to Supabase

**Branch**: `004-description-change-database` | **Date**: 2025-10-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-description-change-database/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the MuzikApp database from a local PostgreSQL instance to an online Supabase PostgreSQL instance. All application data and operations will be moved to Supabase, ensuring data integrity, minimal downtime, and a seamless user experience. Schema changes will be reviewed manually before production, with automation allowed for non-breaking updates. Migration will use the provided Supabase connection string and environment variables.

## Technical Context

**Language/Version**: C# (.NET 8), TypeScript (ES2022), Node 20 LTS  
**Primary Dependencies**: ASP.NET Core, EF Core (Npgsql), Next.js, Supabase JS client, AutoMapper, FluentValidation, TailwindCSS  
**Storage**: Supabase PostgreSQL (connectionString: `postgresql://postgres:[YOUR_PASSWORD]@db.aazussqfrfpnmcqshozo.supabase.co:5432/postgres`)  
**Testing**: xUnit (backend), React Testing Library, Playwright (frontend)  
**Target Platform**: Cloud-hosted (Supabase), Windows/Unix dev, Web (Next.js)  
**Project Type**: Web application (Next.js frontend, ASP.NET Core backend)  
**Performance Goals**: <200ms p95 for main user actions, <30min migration downtime, 0% data loss  
**Constraints**: No secrets in client bundle, schema changes require manual review for breaking changes, must use provided .env for Supabase keys  
**Scale/Scope**: All current users and data, support for future scaling to 10k+ users

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The plan MUST address the following gates from the Constitution:

- Naming & Style: Confirm C# (PascalCase, Async suffix, DTO suffix) and TS (PascalCase components, camelCase funcs) conventions.
- Modularity: Controllers thin, services/repositories separation; Next.js services for data; reusable UI components.
- Test Plan: Backend unit tests (xUnit) and frontend integration/E2E (RTL/Playwright) defined for this feature.
- Simplicity: Justify any added dependency or abstraction beyond existing patterns.
- Git & CI: Branch naming, Conventional Commits, and CI checks (build, lint, tests) defined.

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
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

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

**Structure Decision**: Use the existing monorepo structure:

- `Muzik/` for backend (ASP.NET Core, EF Core)
- `client/` for frontend (Next.js, Supabase client)
- All migration, schema, and integration logic will be added to these folders as needed.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
