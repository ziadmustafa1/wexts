# WEXTS Deployment Guide

## 🚀 Build للـ Production

```bash
pnpm install
pnpm run build
```

هيعمل:
1. ✅ Build NestJS API
2. ✅ Build Next.js Frontend
3. ✅ Build Unified Server

## 🌐 Deploy على Vercel

### 1. أضف `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

### 2. Environment Variables في Vercel:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### 3. Deploy:

```bash
vercel --prod
```

## 🐳 Deploy على Docker

```bash
docker build -t wexts-app .
docker run -p 3000:3000 wexts-app
```

## 🚂 Deploy على Railway

1. Push code to GitHub
2. Connect Railway to repo
3. Add environment variables
4. Deploy automatically!

## ⚙️ Deploy على VPS

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run with PM2
pm2 start dist/server.js --name wexts

# Auto-restart on reboot
pm2 startup
pm2 save
```

## 📝 Notes

- ✅ **Single Build** - كل حاجة تتبني مرة واحدة
- ✅ **Single Process** - Node.js واحد يشغل كل حاجة
- ✅ **No URLs** - كل حاجة internal
- ✅ **Works Everywhere** - أي platform بيدعم Node.js
