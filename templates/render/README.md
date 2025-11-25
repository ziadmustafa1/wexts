# Render Blueprint for WEXTS

Automated deployment configuration for WEXTS framework projects on Render.

## Quick Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ziadmustafa1/wexts)

## What Gets Deployed

This blueprint creates:

1. **Frontend Service** (Next.js)
   - Region: Oregon
   - Plan: Starter
   - Auto-deploy on push

2. **Backend Service** (NestJS) - Optional
   - Region: Oregon  
   - Plan: Starter
   - Health checks enabled

3. **PostgreSQL Database** - Optional
   - Plan: Starter
   - Automatic backups

## Configuration

### `render.yaml`

The blueprint file defining all services and their configuration.

### Environment Variables

Set these in the Render dashboard after deployment:

#### Frontend
- `NODE_ENV`: production (auto-set)
- `NEXT_PUBLIC_API_URL`: Your backend API URL

#### Backend  
- `DATABASE_URL`: PostgreSQL connection string (auto-set if using Render database)
- `JWT_SECRET`: Your JWT secret
- `PORT`: 3001 (auto-set)

## Manual Deployment

### Via Dashboard

1. Go to [render.com/new](https://render.com/new)
2. Select "Blueprint"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Review services and click "Apply"

### Via CLI

```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Deploy blueprint
render blueprint launch
```

## Service URLs

After deployment, you'll get:

- **Frontend**: `https://wexts-frontend.onrender.com`
- **Backend**: `https://wexts-backend.onrender.com`
- **Database**: Connection string provided in dashboard

## Customization

### Change Regions

Edit `render.yaml`:

```yaml
services:
  - type: web
    region: frankfurt  # Options: oregon, frankfurt, singapore, ohio
```

### Adjust Plans

```yaml
services:
  - type: web
    plan: standard  # Options: free, starter, standard, pro
```

### Add Background Worker

```yaml
services:
  - type: worker
    name: wexts-worker
    runtime: node
    buildCommand: pnpm install && pnpm run build
    startCommand: pnpm start:worker
```

### Add Cron Job

```yaml
services:
  - type: cron
    name: wexts-cron
    schedule: "0 0 * * *"  # Daily at midnight
    buildCommand: pnpm install
    startCommand: pnpm run cron:daily
```

## Monorepo Support

Render supports monorepos! Each service can have its own `rootDir`:

```yaml
services:
  - type: web
    name: frontend
    rootDir: apps/web  # Points to specific app

  - type: web
    name: backend
    rootDir: apps/api  # Different directory
```

## Health Checks

Health check endpoints must return HTTP 200:

**Frontend** (`/`):
```typescript
// app/page.tsx or pages/index.tsx
export default function Home() {
  return <div>OK</div>;
}
```

**Backend** (`/health`):
```typescript
// src/health/health.controller.ts
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

## Zero-Downtime Deploys

Render performs rolling deploys automatically. Your app stays online during updates.

## Scaling

Scale horizontally in the dashboard:
- Go to your service
- Click "Manual Deploy"
- Adjust instance count

## Troubleshooting

### Build Fails

- Verify `buildCommand` is correct
- Check build logs in Render dashboard
- Ensure `pnpm-lock.yaml` is committed

### App Won't Start

- Check `startCommand` matches your package.json scripts
- Review environment variables
- Check application logs

### Database Connection Issues

- Verify `DATABASE_URL` environment variable
- Check database is in same region as app
- Review connection pool settings

## Pricing

- **Free Tier**: Available for web services (with limitations)
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Database**: $7/month (Starter)

## Support

- [Render Documentation](https://render.com/docs)
- [WEXTS Documentation](https://wexts.vercel.app)

## License

MIT
