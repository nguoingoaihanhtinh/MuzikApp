# Feature Specification: Authentication Stabilization (Login + Register)

**Feature Branch**: `003-title-auth-stabilization`
**Created**: 2025-10-18
**Status**: Draft
**Input**: "Fix and stabilize user authentication (login + register). Current flows have validation, state, or backend API inconsistencies. Must ensure users can register, verify, and log in correctly, with persistent authentication state and consistent error handling between frontend and backend. Fixes must preserve existing DB schema and session tokens."

## Goals

- Make registration and login reliable and consistent end-to-end.
- Provide clear, structured errors that the frontend can act on.
- Ensure persistent auth state across reloads and sessions.
- Preserve current DB schema and the existing session token model (JWT structure, claims) while improving robustness.

## Actors

- Anonymous Visitor
- Registered User (Listener/Artist/Admin via roles)

## Key User Journeys

1. Register and verify email then sign in

- Given an anonymous user fills out the sign-up form
- When they submit, the system validates fields, sends a 6-digit verification code to the email, and awaits verification
- When the user enters the correct code before it expires, the system creates the account with the selected role (default Listener) and issues a JWT for immediate sign-in (optional auto-login)
- Then the user is considered authenticated and can access protected endpoints

2. Sign in with email + password

- Given a registered user enters email and password
- When the credentials are valid, the API returns a JWT embedded with user id, email, and roles
- Then the client stores the token, sets auth state, and rehydrates on refresh

3. Persist session across app reloads

- Given a user is logged in
- When they refresh the page or return later within token validity
- Then the app restores auth state from the stored token and continues seamlessly

## Functional Requirements

- FR-AUTH-001: Validate sign-up input server-side; return structured errors with codes and fields.
- FR-AUTH-002: Send a one-time verification code (6 digits) to the email for sign-up confirmation.
- FR-AUTH-003: Verification code must have an expiry (e.g., 10 minutes) and limited retry attempts.
- FR-AUTH-004: Provide an endpoint to verify the pincode and proceed to account creation.
- FR-AUTH-005: Prevent duplicate accounts; return a specific error if email already exists.
- FR-AUTH-006: On successful registration, assign role (default Listener) and return a User DTO with JWT token.
- FR-AUTH-007: Login accepts email + password; on success returns User DTO with JWT, on failure returns structured errors.
- FR-AUTH-008: Errors must use a consistent shape: { code, message, field? } with stable codes.
- FR-AUTH-009: JWT must include user id, email, and roles; signature and expiry as currently configured.
- FR-AUTH-010: Server must accept Authorization header with either "Bearer <token>" or raw token (current behavior preserved).
- FR-AUTH-011: Client persists auth state using the token and rehydrates on reload; logout clears it.
- FR-AUTH-012: Password policy must align between FE hints and BE validation; return which rules failed.
- FR-AUTH-013: Provide a resend-code endpoint with minimal rate limiting (e.g., cooldown before resend).
- FR-AUTH-014: Expose a lightweight token introspection endpoint for diagnostics only in Development.
- FR-AUTH-015: Preserve existing DB schema and token shape; no breaking migrations.

## Non-Functional Requirements

- NFR-SEC-001: Do not leak whether an email exists except where explicitly intended for UX; throttle requests.
- NFR-SEC-002: Store verification codes server-side securely with TTL; do not return them to the client.
- NFR-PERF-001: Login and registration responses in under 500ms p95 under normal conditions (excluding email delivery time).
- NFR-UX-001: All failure states display human-friendly messages mapped from stable error codes.

## Error Taxonomy (stable codes)

- EAUTH-INVALID-EMAIL: Email format invalid
- EAUTH-EMAIL-EXISTS: Email already registered
- EAUTH-WEAK-PASSWORD: Password policy not met
- EAUTH-PINCODE-INVALID: Code incorrect
- EAUTH-PINCODE-EXPIRED: Code expired
- EAUTH-CREDENTIALS-INVALID: Incorrect email or password
- EAUTH-RATE-LIMITED: Too many attempts; try later
- EAUTH-UNVERIFIED-EMAIL: Email must be verified (if policy enforced)
- EAUTH-UNKNOWN: Unexpected error

## API Contracts (summary)

- POST /api/auth/validate-signup: Validates inputs, triggers email with pincode. Returns { success: true }.
- POST /api/auth/verify-pincode: Verifies code and returns a one-time token or proceeds to create the account.
- POST /api/auth/signup: Creates user (after verification), returns UserDto with token.
- POST /api/auth/login: Returns UserDto with token on success; structured error on failure.
- POST /api/auth/resend-code: Resends verification code (cooldown enforced).
- POST /api/auth/email-exists: Only used for UX hints; returns { exists: boolean } without issuing a JWT.
- GET /api/auth/test-token: Dev-only: decode a token and echo claims (no secrets).

See contracts/openapi.yaml for detailed schemas and responses.

## Acceptance Scenarios

Happy Path – Register

1. Given a new email and valid password, When calling validate-signup, Then a code is sent and the API returns success.
2. Given the received code, When calling verify-pincode within TTL, Then verification succeeds.
3. Given verification succeeded, When calling signup, Then an account is created and a JWT is returned.

Happy Path – Login

1. Given a registered email and correct password, When calling login, Then a JWT with id, email, roles is returned.
2. Given a valid token stored, When refreshing the UI, Then auth state is restored without re-login.

Failure – Email exists

1. Given an email already registered, When calling validate-signup or signup, Then EAUTH-EMAIL-EXISTS is returned.

Failure – Wrong password

1. Given an email exists but password is wrong, When calling login, Then EAUTH-CREDENTIALS-INVALID is returned.

Failure – Code expired

1. Given a code older than TTL, When calling verify-pincode, Then EAUTH-PINCODE-EXPIRED is returned.

## Constraints and Scope

- Preserve DB schema and JWT structure (claims, roles, 7-day expiry); no DB migrations as part of this feature.
- Email verification via 6-digit code; initial storage may be in-memory cache with TTL (later can upgrade to persistent/distributed store).
- OAuth providers and MFA are out of scope for this iteration.

## Risks and Considerations

- Token lifetime validation: current config disables lifetime validation; enabling it improves security but must ensure existing tokens remain valid per their exp claim. If changed, communicate clearly and stage rollout.
- "EmailExists" currently returns a token – this must be corrected to avoid issuing tokens outside login/signup.
- In-memory code store will not work across multiple instances; acceptable for dev/single instance; plan follow-up for distributed cache.

## Success Criteria

- SC-AUTH-001: 99% of valid login attempts succeed on first try; sub-500ms p95 response.
- SC-AUTH-002: 95% of valid registration flows complete within 10 minutes (email delivery dependent).
- SC-AUTH-003: 100% of errors return a stable code from the taxonomy with a helpful message.
- SC-AUTH-004: Auth state persists across reloads throughout token validity without manual re-login.
