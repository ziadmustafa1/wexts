# WEXTS Architecture

## C1: System Context

```
┌─────────────────────────────────────────┐
│                                         │
│            End Users                    │
│         (Browsers/Clients)              │
│                                         │
└───────────────┬─────────────────────────┘
                │ HTTP
                ↓
┌───────────────────────────────────────────┐
│                                           │
│        WEXTS Unified Application          │
│    (Full-Stack Node.js Server)            │
│                                           │
│  • Next.js SSR/CSR Frontend               │
│  • NestJS REST API Backend                │
│  • Prisma Database Access                 │
│                                           │
└───────────────┬───────────────────────────┘
                │ SQL
                ↓
┌───────────────────────────────────────────┐
│         Database (PostgreSQL/SQLite)      │
└───────────────────────────────────────────┘
```

## C2: Container Diagram

```
┌─────────────────────────────────────────────────────┐
│            WEXTS Unified Runtime (Port 3000)        │
│                                                     │
│  ┌────────────────────┐      ┌──────────────────┐ │
│  │   Next.js App      │      │   NestJS API     │ │
│  │   (Frontend)       │      │   (Backend)      │ │
│  │                    │      │                  │ │
│  │  • Pages/Routes    │      │  • Controllers   │ │
│  │  • Components      │      │  • Services      │ │
│  │  • Client/Server   │      │  • Guards        │ │
│  │                    │      │  • Middleware    │ │
│  └────────┬───────────┘      └────────┬─────────┘ │
│           │                           │           │
│           │  /api SDK calls           │           │
│           └──────────────────────────►│           │
│                                       │           │
│                                       ↓           │
│                           ┌──────────────────┐   │
│                           │  Prisma Client   │   │
│                           └────────┬─────────┘   │
└────────────────────────────────────┼─────────────┘
                                     │
                                     ↓
                            ┌────────────────┐
                            │    Database    │
                            └────────────────┘
```

## C3: Component Diagram - Frontend

```
┌───────────────────────────────────────────┐
│          Next.js Application              │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │       Pages (App Router)           │  │
│  │   /login, /dashboard, etc.         │  │
│  └───────────────┬────────────────────┘  │
│                  │                        │
│                  ↓                        │
│  ┌────────────────────────────────────┐  │
│  │      React Components              │  │
│  │   LoginForm, TodoList, etc.        │  │
│  └───────────────┬────────────────────┘  │
│                  │                        │
│                  ↓                        │
│  ┌────────────────────────────────────┐  │
│  │       WEXTS SDK (lib/api.ts)       │  │
│  │   api.auth.login()                 │  │
│  │   api.todos.findAll()              │  │
│  └───────────────┬────────────────────┘  │
│                  │ fetch('/api/...')     │
└──────────────────┼────────────────────────┘
                   │
                   ↓
              [To NestJS]
```

## C3: Component Diagram - Backend

```
┌───────────────────────────────────────────┐
│          NestJS Application               │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │      Controllers (Prefix: /api)    │  │
│  │   AuthController, TodosController  │  │
│  └───────────────┬────────────────────┘  │
│                  │                        │
│                  ↓                        │
│  ┌────────────────────────────────────┐  │
│  │          Services                  │  │
│  │   AuthService, TodosService        │  │
│  └───────────────┬────────────────────┘  │
│                  │                        │
│                  ↓                        │
│  ┌────────────────────────────────────┐  │
│  │       Prisma Service               │  │
│  │   (Database Access Layer)          │  │
│  └───────────────┬────────────────────┘  │
│                  │                        │
└──────────────────┼────────────────────────┘
                   │
                   ↓
              [To Database]
```

## C4: Request Flow

### Frontend Page Request (`/login`)

```
User Browser
     │
     │ GET /login
     ↓
Express Server (server.ts)
     │
     │ Check: starts with /api?  NO
     ↓
Next.js Handler (nextHandler)
     │
     │ Render /login page
     ↓
HTML Response
```

### API Request (`/api/auth/login`)

```
Frontend (api.auth.login(...))
     │
     │ fetch POST /api/auth/login
     ↓
Express Server (server.ts)
     │
     │ Check: starts with /api?  YES
     ↓
NestJS Handler (prefix: 'api')
     │
     ↓
AuthController.login()
     │
     ↓
AuthService.login()
     │
     ↓
Prisma.user.findUnique(...)
     │
     ↓
Database Query
     │
     ↓
JSON Response
```

## C4: Bootstrap Sequence

```
1. server.ts starts
   │
   ├─► Load Next.js app
   │   ├─► next({ dev, dir })
   │   ├─► await prepare()
   │   └─► Get request handler
   │
   ├─► Load NestJS app
   │   ├─► Import AppModule
   │   ├─► Create with ExpressAdapter
   │   ├─► setGlobalPrefix('api')
   │   └─► await init()
   │
   ├─► Setup routing middleware
   │   └─► server.use(nextHandler)
   │
   └─► Start listening on port 3000
```

## Key Design Decisions

### 1. Single Express Instance

Both Next.js and NestJS share the **same Express server** instance:

```typescript
const server = express();
const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(server));
```

**Why?** Enables both to handle requests on the same port without conflicts.

### 2. Prefix-based Routing

NestJS uses `/api` prefix for all routes:

```typescript
nestApp.setGlobalPrefix('api');
```

**Why?** Clear separation - anything not `/api` goes to Next.js.

### 3. Middleware Order Matters

Next.js fallback middleware comes **after** NestJS routes:

```typescript
// NestJS registers routes first
await nestApp.init();

// Then Next.js catches everything else
server.use(nextHandler);
```

**Why?** Express matches routes in order. NestJS routes registered first get priority.

### 4. Relative API Calls

Frontend uses relative paths:

```typescript
fetch('/api/auth/login') // Not 'http://localhost:5050/...'
```

**Why?** Same origin = no CORS, no configuration.

## Security Considerations

- JWT tokens in httpOnly cookies
- CORS enabled (same origin = safe)
- SQL injection prevented by Prisma
- Input validation via class-validator DTOs
- Rate limiting (can be added to NestJS)

## Performance

- **Cold Start**: ~2-3 seconds (both apps load)
- **Hot Reload**: < 1 second (Turbopack + NestJS watch)
- **Request Latency**: < 5ms (internal routing)
- **Memory**: ~150MB (both apps combined)

## Deployment Options

| Platform | Method | Notes |
|----------|--------|-------|
| Docker | Official | Best for production |
| Vercel | Node Runtime | NOT serverless |
| Railway | Node | One-click deploy |
| Render | Node | Free tier available |
| VPS | PM2 | Full control |

---

**WEXTS Architecture** - Designed for simplicity, built for scale.
