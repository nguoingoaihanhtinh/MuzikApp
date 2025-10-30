# Tasks: Authentication Stabilization

- Backend

  - [ ] Create ErrorCodes.cs with constants and helper method to return ProblemDetails-like or custom error shape.
  - [ ] Add IVerificationService with in-memory cache (email -> { code, expiresAt, attempts, lastSentAt }).
  - [ ] Implement VerificationService with TTL and rate limiting.
  - [ ] Add POST /api/auth/verify-pincode in AuthController.
  - [ ] Update /api/auth/validate-signup to use VerificationService and structured errors.
  - [ ] Update /api/auth/signup to require verified emails and structured errors.
  - [ ] Update /api/auth/login to map invalid creds to EAUTH-CREDENTIALS-INVALID.
  - [ ] Update /api/auth/email-exists to return { exists } only (remove token creation).
  - [ ] Add POST /api/auth/resend-code with cooldown.
  - [ ] Consider enabling ValidateLifetime and update docs; otherwise keep as-is.

- Frontend

  - [ ] Centralize API error mapping and toast messages.
  - [ ] Implement verification code UI in registration flow.
  - [ ] Persist token and rehydrate auth state on app load.
  - [ ] Add tests for auth store and API services.

- QA
  - [ ] Manual test scripts for happy paths and failure cases.
  - [ ] Load test light for login endpoint.
