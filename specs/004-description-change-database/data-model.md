# Data Model: Supabase Migration

## Entities

### User

- id (UUID, PK)
- email (string, unique)
- password_hash (string)
- display_name (string)
- created_at (timestamp)
- ... (profile fields)

### Song

- id (UUID, PK)
- title (string)
- artist_id (UUID, FK)
- album_id (UUID, FK)
- duration (int)
- ... (metadata)

### Album

- id (UUID, PK)
- title (string)
- release_date (date)
- ... (metadata)

### Playlist

- id (UUID, PK)
- name (string)
- owner_id (UUID, FK)
- created_at (timestamp)
- ...

### QueueItem

- id (UUID, PK)
- user_id (UUID, FK)
- song_id (UUID, FK)
- position (int)
- ...

### Genre, Photo, Payment, etc.

- As defined in current model, with relationships preserved

## Relationships

- User has many Playlists, QueueItems
- Song belongs to Album, Artist; has many Genres, Photos
- Playlist has many Songs (many-to-many)
- Album has many Songs

## Validation Rules

- All UUIDs must be valid and unique
- Required fields: id, name/title, owner/artist references
- Foreign keys must reference existing records
- No orphaned records after migration

## State Transitions

- User: created → active → (optional: suspended/deleted)
- Song/Album/Playlist: created → updated → (optional: deleted)

---

This model is to be implemented in Supabase PostgreSQL, matching the current local schema as closely as possible. Manual review required for destructive schema changes.
