# Vercel Deployment Instructions

## Quick Deploy (Recommended)

### Option 1: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Configure Project Settings:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `docs`
   - **Build Command**: Leave empty (uses package.json script)
   - **Output Directory**: Leave empty (Next.js automatic)
   - **Install Command**: `pnpm install`

4. Click **Deploy**

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# From the root of the repo
cd wexts
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your team/personal
# - Link to existing project? No
# - Project name: wexts-docs
# - In which directory is your code? docs
# - Override settings? No
```

## Environment Variables (if needed)

No environment variables required for basic deployment.

## Troubleshooting

If deployment fails:
1. Check that `docs/apps/docs-web/.next` is in `.gitignore`
2. Ensure `pnpm-lock.yaml` is committed
3. Verify Node.js version is 18+ in Vercel project settings
