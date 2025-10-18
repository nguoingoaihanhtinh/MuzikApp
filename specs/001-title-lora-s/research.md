# Research – Lora’s Music

## Unknowns and Decisions

- Auth approach: Decision – role-based auth with session/JWT; email verification required.
  - Rationale: Standard web pattern; supports roles (Listener, Artist, Admin).
  - Alternatives: SSO/social login (future), magic links.
- Streaming delivery: Decision – time-limited signed stream URLs for audio files.
  - Rationale: Avoids exposing raw storage URLs; supports access control.
  - Alternatives: Proxy streaming through API (increases server load).
- Moderation visibility: Decision – artist uploads are non-public until approved, or soft-published with flag.
  - Rationale: Catalog quality; legal risk mitigation.
  - Alternatives: Publish immediately with report-only removal.
- Search scope: Decision – single keyword search across songs, artists, albums with basic filters.
  - Rationale: MVP discovery; more facets later.
  - Alternatives: Advanced multi-facet and typo tolerance (future).

## Best Practices Reviewed

- Web performance budgets: app shell rendering under ~3s; lazy-loading non-critical UI.
- Accessibility: keyboard-first flows, screen-reader labels, color contrast.
- Testing: unit tests for services/utilities; RTL for components; Playwright smoke for top flows.
- Docker: multi-stage builds; healthchecks; env separation; immutable production images.

## Consolidated Outcomes

- Proceed with RESTful API; OpenAPI contracts to guide integration.
- Cloudinary used for uploads and delivery; store only metadata and Cloudinary IDs in DB.
- Keep controllers thin; services encapsulate logic; repositories isolate data access.
- MVP defers offline downloads, collaborative playlists, and advanced analytics.
