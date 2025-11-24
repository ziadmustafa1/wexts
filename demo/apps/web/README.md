# Fusion Next.js Web

Modern Next.js 16 frontend with wexts integration.

## Features

- ✅ Next.js 16 (App Router)
- ✅ React 19
- ✅ Tailwind CSS v4
- ✅ TypeScript
- ✅ wexts Provider & Hooks
- ✅ Authentication Flow
- ✅ Todo Management Dashboard

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Update NEXT_PUBLIC_API_URL in .env.local to point to your API

# Start development server
npm run dev
```

## Project Structure

```
app/
├── layout.tsx          # Root layout with FusionProvider
├── page.tsx            # Homepage with auth redirect
├── globals.css         # Global styles
├── login/
│   └── page.tsx        # Login page
├── register/
│   └── page.tsx        # Registration page
└── dashboard/
    └── page.tsx        # Protected dashboard with todos
```

## Using Fusion Hooks

```tsx
import { useFusion, useAuth } from 'wexts/next';

function MyComponent() {
  const { client } = useFusion();
  const { user, isAuthenticated } = useAuth();

  // Make API calls
  const data = await client.get('/endpoint');
}
```

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5050)
