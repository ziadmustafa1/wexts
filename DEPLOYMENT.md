# WEXTS Framework - Deployment Guide

Complete guide to deploying WEXTS projects on any platform.

---

## Quick Start

### Vercel (Recommended for Next.js)

```bash
npm i -g vercel
cd your-wexts-project
vercel
```

**Or** use the dashboard: [vercel.com/new](https://vercel.com/new)

- Root Directory: `docs` (or your monorepo root)
- Framework: Next.js (auto-detected)

---

### Netlify

```bash
npm i -g netlify-cli
cd your-wexts-project
netlify deploy
```

**Or** connect via GitHub at [netlify.com](https://netlify.com)

Netlify will auto-detect the `@wexts/netlify-plugin`.

---

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/ziadmustafa1/wexts)

**Or** use CLI:

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

---

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ziadmustafa1/wexts)

**Or** use the blueprint in `templates/render/render.yaml`

---

## Platform Comparison

| Platform | Best For | Pros | Cons | Price |
|----------|----------|------|------|-------|
| **Vercel** | Next.js apps | Excellent Next.js support, edge functions, fast | Limited backend support | Free tier, $20/mo Pro |
| **Netlify** | JAMstack, static sites | Great plugin ecosystem, forms | Complex serverless setup | Free tier, $19/mo Pro |
| **Railway** | Full-stack monorepos | Easy setup, PostgreSQL included | Newer platform | $5/mo + usage |
| **Render** | Traditional apps | PostgreSQL, cron jobs, workers | Slower cold starts | Free tier, $7/mo Starter |

---

## Configuration Files

### For Vercel

**`vercel.json`** (optional - usually not needed):
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "apps/web/.next"
}
```

### For Netlify

**`netlify.toml`**:
```toml
[build]
  command = "pnpm run build"
  publish = "apps/web/.next"

[[plugins]]
  package = "@wexts/netlify-plugin"
```

### For Railway

**`railway.json`** + **`nixpacks.toml`** (in `templates/railway/`)

### For Render

**`render.yaml`** (in `templates/render/`)

---

## Environment Variables

### Recommended for All Platforms

```bash
NODE_ENV=production
NODE_VERSION=20
PNPM_VERSION=9
```

### Next.js Specific

```bash
NEXT_PUBLIC_API_URL=https://your-api.com
```

### NestJS Specific

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
PORT=3001
```

---

## Monorepo Deployment

WEXTS projects are monorepos. Different platforms handle them differently:

### Vercel

- Supports monorepos natively
- Set "Root Directory" to your app folder
- Example: `docs` or `apps/web`

### Netlify

- Use `base` directory in `netlify.toml`:
```toml
[build]
  base = "apps/web"
```

### Railway/Render

- Use `rootDir` in configuration files
- Or deploy each app as separate service

---

## Database Setup

### PostgreSQL

**Railway** (easiest):
```bash
railway add  # Select PostgreSQL
```

**Render**:
- Auto-created via `render.yaml`
- Or manually add in dashboard

**Vercel/Netlify**:
- Use external service (Supabase, Neon, etc.)

### Prisma Migrations

Run migrations after deployment:

```bash
# Vercel
vercel env pull
pnpm prisma migrate deploy

# Railway
railway run pnpm prisma migrate deploy

# Render
# Add to buildCommand in render.yaml:
buildCommand: "pnpm install && pnpm prisma migrate deploy && pnpm build"
```

---

## CI/CD

### GitHub Actions

All platforms support automatic deployment via GitHub integration.

**Enable**:
1. Connect repository to platform
2. Enable "Auto Deploy" or equivalent
3. Push to main branch → automatic deployment

### Custom Workflows

Example `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Troubleshooting

### Build Fails

1. **Check Node version**: Ensure platform uses Node 18+
2. **Verify pnpm**: Some platforms need explicit pnpm configuration
3. **Review logs**: Check build logs in platform dashboard

### App Won't Start

1. **Check start command**: Verify it matches package.json
2. **Environment variables**: Ensure all required vars are set
3. **Port configuration**: Some platforms set `PORT` automatically

### Slow Performance

1. **Enable caching**: Platforms cache `node_modules` and build artifacts
2. **Optimize build**: Use `pnpm install --frozen-lockfile --prefer-offline`
3. **Regional deployment**: Deploy closer to your users

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Health check endpoints working
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Analytics configured
- [ ] Custom domain configured
- [ ] SSL/HTTPS enabled (automatic on most platforms)
- [ ] Monitoring alerts setup

---

## Getting Help

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Render**: [render.com/docs](https://render.com/docs)
- **WEXTS**: [wexts.vercel.app](https://wexts.vercel.app)

---

## What's Next?

After successful deployment:

1. **Set up monitoring** (Vercel Analytics, Sentry, etc.)
2. **Configure CDN** (automatic on Vercel/Netlify)
3. **Add custom domain**
4. **Enable preview deployments** (for PRs)
5. **Set up staging environment**

Happy deploying! 🚀
