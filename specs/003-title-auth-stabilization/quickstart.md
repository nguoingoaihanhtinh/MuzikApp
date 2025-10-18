# Quickstart: Auth Stabilization

1. Backend

- Run the API (Development)
- Test endpoints via Swagger or REST client:
  - POST /api/auth/validate-signup
  - POST /api/auth/verify-pincode
  - POST /api/auth/signup
  - POST /api/auth/login

2. Frontend

- Wire the registration UI to verification flow.
- Persist token and rehydrate on app launch.

3. Diagnostics

- Use GET /api/auth/test-token in Development to inspect tokens.
