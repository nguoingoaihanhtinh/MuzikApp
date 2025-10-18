# Quickstart – Song Queue System

## Backend endpoints (dev)

- GET /api/queue – current + upcoming
- POST /api/queue/add – add by songId
- DELETE /api/queue/{songId} – remove
- PUT /api/queue/reorder – reorder by orderedSongIds

## Frontend integration

- QueuePanel: shows current/upcoming with remove and drag-reorder
- useQueue(): exposes state and actions; optimistic updates; reconcile on response
- Add to Queue buttons: on song cards and player UI; show toast on success
- Player: on track end, request next from queue and update UI

## Local run

- Backend: dotnet run (ensure DB available and migrations applied)
- Frontend: install deps, run dev server, configure API base URL
- Compose: run api, client, db services together
