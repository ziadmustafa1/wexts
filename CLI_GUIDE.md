# 🎊 Wexts v2.0 - Successfully Deployed!

## ✅ الـ CLI شغال بنجاح!

```bash
$ npm install -g wexts@latest
$ wexts --version
2.0.0
```

## 🚀 الأوامر المتاحة:

### 1️⃣ إنشاء مشروع جديد
```bash
wexts create my-app
wexts create my-app --template monorepo
wexts create my-app --template api
wexts create my-app --template web
```

### 2️⃣ تشغيل Development Servers
```bash
wexts dev
wexts dev --api ./apps/api --web ./apps/web
wexts dev --port 3000 --api-port 5050
wexts dev --no-proxy  # تعطيل الـ proxy
```

### 3️⃣ بناء للإنتاج
```bash
wexts build
```

### 4️⃣ توليد Code
```bash
wexts generate controller UserController
wexts g module AuthModule
wexts g page dashboard
```

### 5️⃣ توليد API Client من NestJS
```bash
wexts codegen
wexts codegen --watch
wexts codegen --project ./apps/api --output ./packages/api-client/src
```

### 6️⃣ Help
```bash
wexts --help
wexts create --help
wexts dev --help
```

## 📦 استخدام كمكتبة في مشروع:

```typescript
// 1. Import utilities
import { logger, config } from 'wexts';

// 2. Import API client
import { apiFetcher } from 'wexts/client';

// 3. Import NestJS decorators
import { FusionController, FusionGet } from 'wexts/nest';

// 4. Import Next.js components & hooks
import { FusionProvider, useFusion, useAuth } from 'wexts/next';

// 5. Import types
import type { FusionConfig } from 'wexts/types';
```

## 🎯 تثبيت المكتبة:

```bash
# Global (للـ CLI)
npm install -g wexts@latest

# Local (للاستخدام في المشروع)
npm install wexts
# أو
pnpm add wexts
```

## 📊 معلومات النشر:

- **Package**: wexts
- **Version**: 2.0.4 (latest on npm)
- **CLI Version**: 2.0.0
- **Package Size**: 59.5 kB
- **Total Files**: 117
- **Registry**: npmjs.org

## ✨ الميزات:

✅ Next.js 16 Support  
✅ NestJS 11 Integration  
✅ React 19 Compatible  
✅ TypeScript 5.9  
✅ Full Type Safety  
✅ ESM & CJS Support  
✅ CLI Tools  
✅ Dev Server with Proxy  
✅ Code Generation  
✅ Auto API Client Generation  

## 🎊 Status: LIVE & WORKING!
