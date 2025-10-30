# Research Notes

- Current AuthController supports validate-signup, signup, login, email-exists, send-email, test-token; verify-pincode is commented out.
- IdentityServiceExtensions accepts raw token or Bearer; ValidateLifetime currently disabled.
- TokenService includes NameIdentifier, Email, and Role claims, 7-day expiry.
- Gaps:
  - EmailExists issues a token today; should not.
  - No verify-pincode endpoint; registration can proceed without proof of email control.
  - Error responses are mixed (strings vs identity errors), hindering FE consistency.
  - No TTL or rate-limiting for pin codes.
