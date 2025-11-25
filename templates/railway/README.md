# Railway Template for WEXTS

One-click deployment template for WEXTS framework projects on Railway.

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/ziadmustafa1/wexts)

## What Gets Deployed

- ✅ Full-stack monorepo with Next.js + NestJS
- ✅ Automatic build with Nixpacks
- ✅ Production-ready configuration
- ✅ Health checks enabled
- ✅ Auto-restart on failure

## Configuration Files

### `railway.json`
Main Railway configuration with build and deploy settings.

### `nixpacks.toml`
Nixpacks build configuration specifying Node.js 20 and pnpm 9.

## Environment Variables

Set these in your Railway project:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (production/development) | No (defaults to production) |
| `DATABASE_URL` | PostgreSQL connection string | Yes (if using database) |
| `PORT` | Application port | No (Railway sets automatically) |

## Manual Deployment

If you prefer to deploy manually:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

## Project Structure

```
wexts/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # Shared types and utilities
├── railway.json      # Railway configuration
└── nixpacks.toml     # Build configuration
```

## Customization

### Change Node Version

Edit `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "pnpm-9_x"]  # Use Node 18 instead
```

### Custom Build Command

Edit `railway.json`:

```json
{
  "build": {
    "buildCommand": "pnpm install && pnpm build:web"
  }
}
```

### Add Services

Railway supports multiple services. You can deploy frontend and backend separately:

1. Create two Railway services
2. Set different start commands:
   - Frontend: `pnpm start:web`
   - Backend: `pnpm start:api`

## Troubleshooting

### Build Fails

- Check that `pnpm-lock.yaml` is committed
- Verify Node/pnpm versions in `nixpacks.toml`
- Review build logs in Railway dashboard

### App Crashes

- Check environment variables are set correctly
- Review application logs
- Verify health check endpoint works

## Support

For issues specific to Railway deployment:
- [Railway Documentation](https://docs.railway.app)
- [WEXTS Documentation](https://wexts.vercel.app)

## License

MIT
