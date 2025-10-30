# Data Model: Deployment Configurations

## Entities

### DeploymentConfig

- id (UUID, PK)
- service (string: 'frontend' | 'backend')
- provider (string: 'vercel' | 'render')
- repo_url (string)
- env_vars (json: key-value pairs)
- build_command (string)
- start_command (string)
- created_at (timestamp)

### SupabaseConnection

- id (UUID, PK)
- url (string)
- anon_key (string)
- connection_string (string)
- created_at (timestamp)

## Relationships

- DeploymentConfig references SupabaseConnection for DB access

## Validation Rules

- All required env_vars must be present for each deployment
- No secrets in frontend env*vars except NEXT_PUBLIC*\*
- Build/start commands must be valid for the platform

## State Transitions

- DeploymentConfig: created → active → updated → (optional: archived)

---

This model supports tracking and validating deployment settings for both frontend (Vercel) and backend (Render).
