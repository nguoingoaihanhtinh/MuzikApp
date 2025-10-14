# Quickstart – Lora’s Music

## Run locally (dev)

1. Backend
   - Configure connection string/env vars in `Muzik/appsettings.Development.json`
   - Run `dotnet build` then `dotnet run` (port 5000)
2. Frontend
   - Configure `client/.env.local` (e.g., NEXT_PUBLIC_API_BASE_URL)
   - Install deps and run dev server (port 3000)
3. Database
   - Ensure PostgreSQL is running and accessible; run migrations
4. Media
   - Set Cloudinary credentials in env; use provided upload forms in artist dashboard

## With Docker Compose

- Build and start: API, client, and Postgres containers
- Access frontend at http://localhost:3000; API at http://localhost:5000

## Smoke tests

- Visit the app, register a user, play a seeded track, create a playlist, and attempt an artist upload (in test env)
