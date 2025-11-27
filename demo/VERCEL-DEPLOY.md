# Vercel Deployment للـ WEXTS

## الـ Architecture على Vercel

Vercel بيشتغل serverless، عشان كده محتاجين نفصل:
- ✅ **Next.js** → Vercel native (frontend)
- ✅ **NestJS** → Vercel Serverless Functions (backend API)

## خطوات الـ Deploy

### 1. Project Settings في Vercel

```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: cd ../.. && pnpm run build
Output Directory: .next
Install Command: cd ../.. && pnpm install
```

### 2. Environment Variables

في Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
DIRECT_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

### 3. Deploy

```bash
# Push to GitHub
git add .
git commit -m "Vercel deployment ready"
git push

# Vercel هيعمل auto-deploy
```

## ⚠️ Important Notes

1. **Database:** لازم PostgreSQL (مش SQLite) - استخدم:
   - Vercel Postgres
   - Supabase
   - Neon
   - Railway Postgres

2. **Prisma Generate:** لازم يشتغل في build time:
   ```json
   "scripts": {
     "postinstall": "cd apps/api && npx prisma generate"
   }
   ```

3. **API Routes:** هتشتغل على `/api/*` تلقائياً

## 🎯 URLs بعد Deploy

```
https://your-project.vercel.app         → Next.js Frontend
https://your-project.vercel.app/api/*   → NestJS API
```

## 🐛 Troubleshooting

### Build Errors:
```bash
# Local test
pnpm run build

# Check logs في Vercel Dashboard
```

### Database Connection:
```bash
# Test locally with production DB
DATABASE_URL="postgresql://..." pnpm start
```

## ✅ يجب عمله قبل Deploy

- [ ] Database PostgreSQL جاهز
- [ ] Environment variables في Vercel
- [ ] `pnpm run build` يشتغل local
- [ ] `prisma generate` في postinstall
- [ ] `.env.example` في git (مش `.env`)

## 🚀 Alternative (أسهل)

إذا واجهت مشاكل، استخدم **Railway** - أسهل وأسرع للـ unified servers!

```bash
# Railway يدعم الـ unified approach مباشرة
git push  # Railway auto-deploy!
```
