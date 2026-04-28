# WEXTS Deployment على Vercel

## 🚀 خطوات الـ Deploy

### 1. تجهيز المشروع

```bash
# تأكد إن الـ build شغال
pnpm run build

# Commit كل التغييرات
git add .
git commit -m "Ready for deployment"
git push
```

### 2. Environment Variables في Vercel

**افتح Vercel Dashboard → Project Settings → Environment Variables**

أضف المتغيرات دي:

```
JWT_SECRET=your-production-secret-here
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
PORT=3000
```

**Important:** 
- ✅ استخدم نفس المتغيرات لكل البيئات (Production, Preview, Development)
- ✅ Vercel هيقرا من `.env` واحد في الـ root

### 3. Deploy

```bash
# من الـ root directory
vercel --prod

# أو push to GitHub واربط repo بـ Vercel
```

### 4. Build Settings في Vercel

```
Build Command: pnpm run build
Output Directory: (leave empty - vercel.json handles it)
Install Command: pnpm install
```

### 5. vercel.json (موجود بالفعل)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.ts"
    }
  ]
}
```

## 🗂️ ملفات الـ Environment

```
wexts/demo/
├── .env              ← في gitignore (local only)
├── .env.example      ← في git (template)
└── vercel.json       ← في git
```

**Local:**
```bash
cp .env.example .env
# عدل القيم الحقيقية في .env
```

**Production (Vercel):**
- استخدم Vercel Dashboard لإضافة environment variables
- Vercel هيحقنها تلقائياً

## 📦 Dependencies

**مش محتاج تعمل أي حاجة!**

pnpm workspace بيدير كل الـ node_modules تلقائياً:
```
wexts/demo/
├── node_modules/        ← shared dependencies
├── apps/
│   ├── api/
│   │   └── node_modules/  ← api-specific
│   └── web/
│       └── node_modules/  ← web-specific
```

## ✅ Checklist قبل Deploy

- [ ] `pnpm run build` يشتغل بدون أخطاء
- [ ] `.env.example` موجود في git
- [ ] `vercel.json` موجود
- [ ] Environment variables مضافة في Vercel Dashboard
- [ ] Database URL صحيح (PostgreSQL for production)

## 🎉 بعد Deploy

```
Your app is live at: https://your-project.vercel.app

✅ Frontend: https://your-project.vercel.app
✅ API: https://your-project.vercel.app/api
This deprecated demo is not the production reference. Use `examples/hello-rpc` for the verified single-runtime path.
```
