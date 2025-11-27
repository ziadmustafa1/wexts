# Railway Deployment

## ✅ أفضل حل للـ WEXTS Unified Server

Railway بيدعم Node.js servers عادية - مثالي للـ unified approach!

### خطوات الـ Deploy:

1. **روح على https://railway.app**
2. **اعمل Sign up/Login**
3. **New Project → Deploy from GitHub**
4. **اختار الـ repo**
5. **Railway هيكتشف كل حاجة تلقائياً!**

### Environment Variables (في Railway Dashboard):

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
NODE_ENV=production
PORT=3000
```

### Railway Config (nixpacks.toml):

أضف الملف ده في الـ root:

```toml
[phases.setup]
nixPacks = ["nodejs-20", "pnpm"]

[phases.install]
cmds = ["pnpm install"]

[phases.build]
cmds = ["pnpm run build"]

[start]
cmd = "pnpm start"
```

### Build Settings:

```
Build Command: pnpm run build
Start Command: pnpm start  
Root Directory: /
```

### ✅ مميزات Railway:

- ✅ بيشغل Node.js server عادي (مثالي للـ unified approach)
- ✅ PostgreSQL مجاني مدمج
- ✅ SSL تلقائي
- ✅ Auto-deploy من GitHub
- ✅ Free tier كويس للبداية

## 🚀 بعد Deploy:

```
https://your-app.railway.app
✅ Frontend + Backend في مكان واحد!
```

---

## Alternative: Render.com

نفس الخطوات تقريباً - بيدعم Node.js unified servers كمان.

---

## ⚠️ Vercel Limitation

Vercel مصمم للـ serverless functions، مش للـ unified Node.js servers.
عشان كده Railway أو Render أفضل للـ WEXTS approach.
