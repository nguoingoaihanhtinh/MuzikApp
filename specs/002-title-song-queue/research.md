# Research – Song Queue System

## Unknowns and Decisions

- Duplicate handling: Decision – optional prevention toggle; default allow duplicates for MVP.
  - Rationale: Simpler UX initially; can enforce later without breaking flows.
  - Alternatives: Always prevent duplicates; allow duplicates only if not adjacent.
- Persistence semantics: Decision – server-authoritative per-user queue persisted in DB; client mirrors with optimistic updates.
  - Rationale: Consistency across tabs and refresh; conflict resolution simple (server wins).
  - Alternatives: Client-only queue (session), or websocket-based live sync (higher complexity).
- Advance behavior: Decision – player triggers advance at track end; server updates current and shifts queue.
  - Rationale: Clear handoff from playback event; avoids polling bursts.
  - Alternatives: API-driven timed progress tracking (overkill for MVP).

## Best Practices Reviewed

- Concurrency control: use positions with stable IDs; server validates reorder arrays and deduplicates.
- UX: optimistic updates with toasts; reconcile on failure; drag-and-drop accessibility cues.
- Testing: unit tests for ordering math; integration tests for queue round-trips; smoke tests for play→advance.

## Consolidated Outcomes

- Implement QueueService with Add/Remove/Reorder/Advance, returning updated queue state.
- Frontend useQueue hook centralizes state and server sync; QueuePanel handles display and interactions.
- E2E smoke: add→view→reorder→remove flow and advance on track end.
