---
description: "Tasks to implement Add Song to Queue (US1)"
---

# Tasks: Song Queue System – Add Song to Queue (US1)

**Input**: Design documents from `/specs/002-title-song-queue/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per Constitution, behavior changes MUST include tests. Write tests first, ensure they FAIL, then implement.

**Organization**: Tasks grouped by user story (US1: Add to Queue) to enable independent MVP delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (Add to Queue)
- Include exact file paths in descriptions

## Path Conventions

- Muzik/ (ASP.NET Core backend): Controllers/, DTOs/, Entities/, Data/, Interfaces/, Repositories/, Services/, Helpers/, Extensions/, Middleware/, Tests/
- client/ (Next.js frontend): src/app/, src/components/, src/services/, src/libs/, src/stores/, src/types/, tests/

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure testing infrastructure exists to follow test-first discipline

- [ ] TQ-001 Create backend test project `Muzik.Tests/` (xUnit + FluentAssertions); add to `Muzik.sln`
- [ ] TQ-002 [P] Create frontend test harness: `client/tests/unit/` (Vitest + RTL) and `client/tests/integration/`; configure npm scripts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data structures and DI wiring required by US1

- [ ] TQ-010 Add entity `Muzik/Entities/QueueItem.cs` with properties: `Id`, `SongId`, `UserId`, `Position`, `AddedAt`
- [ ] TQ-011 Update DbContext `Muzik/Data/DataContext.cs`: add `DbSet<QueueItem>`; configure indexes (UserId+Position)
- [ ] TQ-012 Create EF migration `AddQueueItem` and update database
- [ ] TQ-013 [P] Add interface `Muzik/Interfaces/IQueueRepository.cs` with methods: `GetUserQueueAsync`, `AddAsync`, `RemoveAsync`, `ReorderAsync`
- [ ] TQ-014 [P] Implement repository `Muzik/Repositories/QueueRepository.cs`
- [ ] TQ-015 [P] Add service `Muzik/Services/QueueService.cs` with `AddToQueueAsync(userId, songId)` returning updated queue DTO
- [ ] TQ-016 Register DI in `Muzik/Extensions/ApplicationServiceExtensions.cs` for `IQueueRepository` and `QueueService`
- [ ] TQ-017 [P] Create DTO `Muzik/DTOs/Queue/AddToQueueDto.cs` with `SongId`
- [ ] TQ-018 [P] Create DTO `Muzik/DTOs/Queue/QueueDto.cs` representing `{ current, upcoming[] }`

**Checkpoint**: Foundation ready – US1 can proceed

---

## Phase 3: User Story 1 – Add Song to Queue (Priority: P1) 🎯 MVP

**Goal**: Logged-in listener can add a song to their queue; API returns updated queue; UI reflects change with toast.

**Independent Test**: Using a seeded user and song, POST add → queue has appended song; UI shows new item.

### Tests for US1 (Write FIRST) ⚠️

- [ ] TQ-020 [US1] Backend unit tests for `QueueService.AddToQueueAsync` in `Muzik.Tests/Queue/QueueServiceTests.cs`
- [ ] TQ-021 [US1] Backend integration test for `POST /api/queue/add` add/remove order in `Muzik.Tests/Queue/QueueApiTests.cs`
- [ ] TQ-022 [P] Frontend unit test for `useQueue().addToQueue` in `client/tests/unit/useQueue.test.ts`
- [ ] TQ-023 [P] Frontend integration test for button → hook → state update in `client/tests/integration/queue.add.test.tsx`

### Implementation – Backend

- [ ] TQ-030 Implement controller `Muzik/Controllers/QueueController.cs` POST `/api/queue/add`
  - Derive `userId` from auth claims; accept `AddToQueueDto` body
  - Validate song exists and user authorized
  - Call service; return `QueueDto`
- [ ] TQ-031 Add route mapping and authorization attributes
- [ ] TQ-032 Add logging and ProblemDetails error handling for validation failures

### Implementation – Frontend

- [ ] TQ-040 Create API client `client/src/services/queue.service.ts` with `addToQueue(songId)`
- [ ] TQ-041 Extend hook `client/src/hooks/useQueue.ts` with `addToQueue` (optimistic update + reconcile)
- [ ] TQ-042 Create button component `client/src/components/features/queue/AddToQueueButton.tsx`
- [ ] TQ-043 Integrate button into song item UI (import into existing component, e.g., `client/src/components/features/songs/SongCard.tsx` or equivalent)
- [ ] TQ-044 Show toast on success (and non-blocking notice on duplicate prevention)

### UI Enhancement

- [ ] TQ-050 Implement `QueuePanel` in `client/src/components/features/queue/QueuePanel.tsx` displaying current + upcoming with order numbers
- [ ] TQ-051 Wire `QueuePanel` into player sidebar layout (ensure space for list and scroll)

**Checkpoint**: US1 fully functional and independently testable

---

## Phase N: Polish & Cross-Cutting

- [ ] TQ-060 Performance: verify API p50 < 200ms for add; UI update within ~200ms (optimistic) then reconcile
- [ ] TQ-061 Accessibility: ensure button labeled for screen readers; keyboard focus states in QueuePanel
- [ ] TQ-062 Docs: update `specs/002-title-song-queue/quickstart.md` with curl/UI steps for add

---

## Dependencies & Execution Order

- Foundational (Phase 2) blocks US1 implementation
- Tests must be written and fail before implementation for US1
- Backend service/repo before controller; API client before hook; hook before button integration
