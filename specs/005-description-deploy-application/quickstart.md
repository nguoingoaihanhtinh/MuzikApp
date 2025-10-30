# Quickstart: Deploying MuzikApp (Vercel + Render + Supabase)

## Prerequisites

- Supabase project and credentials ready
- Vercel and Render accounts created
- GitHub/GitLab repository for MuzikApp

## Frontend (Vercel)

1. Import the `client/` directory as a new project in Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Configure build command: `npm run build`
4. Configure output directory: `.vercel/output` or `out` (if using static export)
5. Deploy and verify the app is live

## Backend (Render)

1. Create a new Web Service in Render, point to `Muzik/` directory
2. Set environment variables in Render dashboard:
   - `ConnectionStrings__DefaultConnection` (Supabase connection string)
   - Any other required secrets
3. Configure build command: `dotnet build Muzik.csproj`
4. Configure start command: `dotnet Muzik.dll`
5. Deploy and verify API endpoints are live

## Automation

- Enable GitHub/GitLab integration for auto-deploy on push to main
- Use Vercel/Render deploy hooks for manual triggers if needed

## Rollback

- Use Vercel/Render dashboard to rollback to previous deployment if issues occur

---

For API contracts, see `contracts/deployment-api.yaml`.
