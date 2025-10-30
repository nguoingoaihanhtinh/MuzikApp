# Implementation Plan: Authentication Stabilization

- Backend

  - Introduce a structured error helper to map to { code, message, field? } consistently.
  - AuthController
    - validate-signup: validate email format and password via UserManager validators; send pincode; return { success: true }.
    - verify-pincode: new endpoint; check email + code against in-memory cache with TTL and attempt counter.
    - signup: require verified email (from cache) before creating user; return UserDto with JWT.
    - login: return structured errors with EAUTH-CREDENTIALS-INVALID; keep JWT claims same.
    - email-exists: change to return { exists } only; remove token issuance.
    - resend-code: optional cooldown keyed by email.
  - IdentityServiceExtensions
    - Keep acceptance of raw token and Bearer prefix.
    - Consider enabling ValidateLifetime = true if backward compatibility is acceptable.
  - TokenService
    - Keep claims: NameIdentifier, Email, Role(s); 7-day expiry.

- Frontend

  - Normalize error handling: map API errors by `code` to user-friendly messages.
  - Persist token in secure storage (httpOnly cookie preferred; if not changing, use localStorage with careful use).
  - On app init, rehydrate auth state from token and decode minimal claims (id, email, roles) if needed.
  - Update Register and Login pages to handle verification code flow.

- Testing

  - Unit tests for pincode verification logic (TTL, attempts).
  - Integration tests for validate-signup → verify-pincode → signup flow.
  - Integration tests for login success and failure cases.

- Migration/Release
  - No DB migrations.
  - Feature flagged if altering lifetime validation.
