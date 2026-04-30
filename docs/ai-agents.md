# Using AI Agents with Wexts

Because Wexts heavily relies on generated RPC code and a unified single-runtime execution model, AI agents (like Cursor, GitHub Copilot, or Claude) sometimes need a little guidance to understand how your project is structured.

By adding a `.cursorrules` or system prompt to your project, you can teach the AI how Wexts works, which dramatically improves its ability to generate correct full-stack code.

## Recommended `.cursorrules` Template

If you are using **Cursor** or any IDE that supports a rules file, create a `.cursorrules` file in the root of your project and paste the following content:

```markdown
# Wexts Project AI Rules

You are an expert full-stack developer working on a Wexts application.
Wexts is a unified single-runtime toolkit that combines Next.js (frontend) and NestJS (backend) using a highly typed RPC bridge.

## Project Structure
- `apps/api/`: The NestJS backend. Contains business logic, database models, and RPC services.
- `apps/web/`: The Next.js frontend. Contains UI components, pages, and consumes the RPC client.
- `apps/web/lib/wexts`: The auto-generated typed RPC client (DO NOT EDIT MANUALLY).

## Backend Guidelines (NestJS)
1. **RPC Services**: To create an API endpoint, create a NestJS provider decorated with `@RpcService({ name: 'serviceName' })` and methods decorated with `@RpcMethod()`.
2. **Imports**: Import `@RpcService` and `@RpcMethod` from `wexts/nest`.
3. Do NOT manually create REST controllers unless explicitly needed for webhooks. Use the RPC bridge for all internal frontend-backend communication.
4. **Auth**: If a service requires authentication, set `@RpcService({ requireAuth: true })`.

## Frontend Guidelines (Next.js)
1. **RPC Usage**: To call the backend, import the `api` client from `@/lib/wexts` or your designated Wexts client file. 
2. **Syntax**: `const data = await api.serviceName.methodName(args);`
3. The `api` object is fully type-safe. Rely on TypeScript autocomplete rather than guessing endpoints.
4. **Client Components**: If calling RPC from a client component, ensure you handle async states properly (e.g., React Query or SWR).

## Development Workflow
- When asked to add a new full-stack feature:
  1. Add the database model (Prisma).
  2. Create/update the NestJS RPC service in `apps/api`.
  3. Remind the user to run `wexts generate` (or `pnpm generate`) so the types sync.
  4. Build the UI in Next.js using the new `api` methods.
- **Never** hardcode `fetch('http://localhost:3000/...')`. ALWAYS use the generated `api` SDK.
```

## How It Helps the AI
1. **Prevents URL Hardcoding:** AI tends to hallucinate `fetch('/api/users')`. This prompt forces it to use `api.users.getUsers()`.
2. **Teaches the Decorators:** The AI will learn to use `@RpcService` and `@RpcMethod` instead of standard `@Controller` decorators for internal communication.
3. **Monorepo Context:** It helps the AI understand the boundary between `apps/api` and `apps/web` while recognizing they share the same types.

## Automating RPC Generation with AI
If your AI agent supports running terminal commands (like Cursor's agent or GitHub Copilot Workspaces), instruct it to automatically run `pnpm run generate` or `wexts generate` immediately after it finishes writing a backend RPC service. This ensures the frontend types are instantly available for the AI to use in the very next step.
