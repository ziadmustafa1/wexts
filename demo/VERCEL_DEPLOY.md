# Deploying Wexts Demo to Vercel

This monorepo contains two applications:
1. **Web App** (`apps/web`): A Next.js application.
2. **API** (`apps/api`): A NestJS application configured for Serverless.

To deploy this correctly on Vercel, you should create **two separate projects** connected to the same Git repository.

## 1. Deploying the Web App (`apps/web`)

1. Go to your Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2. Import your Git repository.
3. In the "Configure Project" step:
   - **Framework Preset**: Next.js (should be auto-detected).
   - **Root Directory**: Click "Edit" and select `demo/apps/web`.
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: The URL of your deployed API (see step 2). For now, you can leave it blank and update it later.
4. Click **Deploy**.

## 2. Deploying the API (`apps/api`)

1. Go to your Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2. Import the **same** Git repository again.
3. In the "Configure Project" step:
   - **Framework Preset**: Other (or leave as default).
   - **Root Directory**: Click "Edit" and select `demo/apps/api`.
   - **Environment Variables**:
     - `FRONTEND_URL`: The URL of your deployed Web App (e.g., `https://your-web-app.vercel.app`).
     - `DATABASE_URL`: Your production database URL (e.g., from Neon, Supabase, or MongoDB Atlas).
     - `JWT_SECRET`: A secure secret key for JWT tokens.
4. Click **Deploy**.

## 3. Connect Them

1. Once the API is deployed, copy its URL (e.g., `https://wexts-api.vercel.app`).
2. Go to the **Web App** project settings in Vercel.
3. Add/Update the `NEXT_PUBLIC_API_URL` environment variable with the API URL.
4. Redeploy the Web App.

## Local Development

To run both locally:
```bash
npm run dev
```
This will start both the Web App (localhost:3000) and the API (localhost:5050).
