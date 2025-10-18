# Feature Specification: Song Queue System

**Feature Branch**: `002-title-song-queue`  
**Created**: 2025-10-18  
**Status**: Draft  
**Input**: User description: "Users can manage a playback queue in the music player. They can view the currently playing song, add songs to the upcoming queue, remove songs, and reorder them. Each user has a personal queue tied to their account. Adding updates backend and frontend immediately. Queue persists during session and reloads on refresh. Optional: prevent duplicates. Edge: adding while playing, clearing when playback ends, unavailable/deleted songs."

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Add song to queue (Priority: P1)

As a listener, I want to add a song to my queue so I can listen to it after the current track finishes.

**Why this priority**: Core control for sequential listening.

**Independent Test**: Logged-in listener adds a song to an empty or non-empty queue and sees it appear in upcoming list.

**Acceptance Scenarios**:

1. Given a logged-in listener and a currently playing track, When they add a different song to the queue, Then the song appears at the end of the upcoming list and the player state remains playing.
2. Given a logged-in listener with an empty queue, When they add a song, Then that song appears as the next upcoming item.

---

### User Story 2 - View current queue (Priority: P1)

As a listener, I want to view my current queue so I know what’s next.

**Why this priority**: Visibility drives trust and control.

**Independent Test**: Listener opens the player/queue drawer and sees the current track and upcoming list in order.

**Acceptance Scenarios**:

1. Given a logged-in listener, When they open the queue, Then the currently playing track and upcoming list are displayed in the correct order.
2. Given the queue was previously populated, When the user refreshes the page, Then the queue restores to its previous state for that session/account.

---

### User Story 3 - Remove or reorder songs (Priority: P1)

As a listener, I want to remove or reorder songs in my queue.

**Why this priority**: Enables tailoring the listening experience.

**Independent Test**: Listener removes an item or drags to reorder and sees upcoming list update accordingly.

**Acceptance Scenarios**:

1. Given an upcoming list with multiple items, When the listener removes an item, Then it disappears and the order of remaining items is preserved.
2. Given an upcoming list with multiple items, When the listener reorders items, Then the new order is saved and reflected in subsequent playback sequence.
3. Given the listener clears the queue, When confirmed, Then the upcoming list becomes empty without interrupting the currently playing track.

---

### User Story 4 - Optional duplicate prevention (Priority: P3)

As a listener, I want optional prevention of duplicate songs in my queue to avoid repeats.

**Why this priority**: Quality-of-life feature; can be toggled by product policy.

**Independent Test**: With setting enabled, adding the same song twice does not create duplicates.

**Acceptance Scenarios**:

1. Given duplicate prevention is enabled, When the listener adds a song already in upcoming list, Then no duplicate is added and a non-blocking notice is shown.

### Edge Cases

- Adding a song while another is already playing (should append to upcoming without interrupting playback)
- Clearing the queue when playback ends (auto-advance; optional auto-clear when no upcoming items)
- Handling unavailable or deleted songs (skip and notify; remove from queue)
- Concurrent updates from multiple tabs (last-write wins or server-authoritative ordering)
- Very long queues (pagination/virtualized rendering; reasonable max length policy)

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- FR-001: The system MUST maintain a per-user playback queue containing the current track and an ordered list of upcoming items.
- FR-002: The system MUST allow adding one or more tracks to the upcoming list without interrupting current playback.
- FR-003: The system MUST allow removing tracks from the upcoming list.
- FR-004: The system MUST allow reordering tracks in the upcoming list.
- FR-005: The system MUST persist the queue state for the user such that reloading the app restores the queue for the active session/account.
- FR-006: The system MUST update the visible queue immediately after any change.
- FR-007: The system MUST advance to the next item automatically when the current track ends and update the queue accordingly.
- FR-008: The system MUST handle unavailable/deleted tracks by skipping them and notifying the user.
- FR-009: The system SHOULD optionally prevent adding duplicates to the upcoming list when the feature is enabled by product policy.
- FR-010: The system MUST enforce authorization so users can only view and modify their own queues.

Assumptions:

- Queue persistence is tied to the authenticated user identity (not device-only), with session-based restore behavior.
- Duplicate prevention is a configurable product setting and may be enabled later without breaking flows.

### Key Entities _(include if feature involves data)_

- Queue: represents a user’s playback state; attributes include userId, currentTrackId, upcoming: [trackId], updatedAt, settings (e.g., duplicatePreventionEnabled).
- QueueItem: a positionally ordered reference to a track in upcoming; attributes include trackId, position, addedAt, addedBy.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- SC-001: 95% of add-to-queue actions reflect on the UI within 200ms.
- SC-002: 99% of track-end events advance to the next item without user action.
- SC-003: 90% of users can locate and view their queue and reorder at least one item without assistance on the first attempt.
- SC-004: On refresh, 95% of sessions restore the last known queue within 2 seconds for typical network conditions.
