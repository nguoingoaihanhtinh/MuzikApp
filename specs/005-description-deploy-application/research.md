# Research: Deploying Next.js (Vercel) and ASP.NET Core (Render) with Supabase

## Decision

- **Frontend**: Deploy Next.js app to Vercel using Git integration and Vercel dashboard. Configure environment variables for Supabase URL and anon key in Vercel project settings.
- **Backend**: Deploy ASP.NET Core backend to Render using Git integration and Render dashboard. Configure environment variables for Supabase connection string in Render service settings.
- **Automation**: Use GitHub/GitLab integration for automatic deployments on push to main branch. Use Vercel/Render build and deploy hooks for CI/CD.

## Rationale

- Vercel is optimized for Next.js, provides fast global CDN, and easy environment variable management.
- Render supports .NET 8, persistent background services, and secure environment variable storage.
- Both platforms support zero-downtime deploys and rollbacks.

## Alternatives Considered

- **Self-hosting**: More control, but higher maintenance and less scalability.
- **Azure/AWS**: More complex setup, higher cost for small projects.
- **Docker Compose on VPS**: Simpler for dev, but lacks managed scaling and CI/CD.

## References

- Vercel Next.js deployment docs: https://vercel.com/docs/deployments
- Render .NET deployment docs: https://render.com/docs/deploy-dotnet
- Supabase environment variable docs: https://supabase.com/docs/guides/functions/environment-variables

---

This resolves all deployment platform and automation clarifications for this feature.
