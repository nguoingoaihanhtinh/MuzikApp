# Quickstart: Supabase Migration

## Prerequisites

- Supabase project created and credentials available
- Supabase connection string:
  `postgresql://postgres:[YOUR_PASSWORD]@db.aazussqfrfpnmcqshozo.supabase.co:5432/postgres`
- .env variables set:
  - `NEXT_PUBLIC_SUPABASE_URL=https://aazussqfrfpnmcqshozo.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- Local database accessible for data export

## Steps

1. **Review Supabase schema**
   - Compare local and Supabase schemas
   - Apply non-breaking changes automatically; review breaking changes manually
2. **Configure application**
   - Update backend connection string to Supabase
   - Set frontend .env variables
3. **Run migration**
   - Use `/api/migrate` endpoint (see OpenAPI contract)
   - Optionally run with `dryRun` to validate
4. **Verify migration**
   - Use `/api/verify-migration` endpoint
   - Check for data consistency and completeness
5. **Monitor application**
   - Ensure all CRUD operations use Supabase
   - Monitor for errors or data issues

## Rollback

- If migration fails, revert connection string and .env to local database
- Restore data from backup if needed

---

For detailed API contracts, see `contracts/migration-api.yaml`.
