# Data Model – Song Queue System

## Entities

### QueueItem

- Id: UUID
- UserId: UUID (FK → User)
- SongId: UUID (FK → Song)
- Position: int (0-based ascending order in upcoming)
- AddedAt: datetime (UTC)

### Queue (derived/aggregated)

- UserId: UUID
- CurrentTrackId: UUID | null (from player state or last advanced item)
- Upcoming: QueueItem[] (ordered by Position)
- Settings: { duplicatePreventionEnabled: boolean }
- UpdatedAt: datetime (UTC)

## Relationships

- A User has many QueueItems
- QueueItems reference Song

## Validation Rules

- Position MUST be unique per (UserId)
- Reorder MUST provide a permutation of existing SongIds (no missing/extra IDs)
- Add MUST reject unknown/unavailable SongId (or mark to skip and notify)

## State Transitions

- Add: append to end (Position = max+1)
- Remove: delete item; re-index positions to maintain contiguous order
- Reorder: set positions according to provided orderedSongIds
- Advance: shift first item from upcoming to current; next item becomes current
