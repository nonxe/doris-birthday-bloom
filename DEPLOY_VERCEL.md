# Deploying to Vercel

This project is a TanStack Start app. Lovable's preview builds it for Cloudflare Workers, and Vercel builds it via [Nitro's Vercel preset](https://nitro.build/deploy/providers/vercel).

## One-time setup

1. Push the repo to GitHub / GitLab / Bitbucket.
2. In Vercel → **Add New Project** → import the repo.
3. **Framework Preset:** `Other` (leave blank — `vercel.json` handles it).
4. **Build Command / Install Command / Output Directory:** leave defaults — they are configured in `vercel.json`:
   - Build: `NITRO_PRESET=vercel vite build`
   - Install: `bun install`
   - Output: `.vercel/output`
5. Click **Deploy**.

## Environment variables

If you add Lovable Cloud / Supabase later, copy the `VITE_*` and any server secrets from Lovable into Vercel → Project → Settings → Environment Variables.

## Local check

```bash
NITRO_PRESET=vercel bun run build
```

This produces `.vercel/output/` using the Vercel Build Output API — the exact artifact Vercel deploys.
