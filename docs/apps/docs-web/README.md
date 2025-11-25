# wexts Documentation - SSR Architecture

## 🏗️ Architecture Pattern

This documentation site follows a **clean SSR architecture** where:

### Page Components (Max 10 Lines)
Located in `app/*/page.tsx` - These are thin wrappers that:
- Define metadata (title, description)
- Import and render feature components
- Stay under 10 lines of code

Example:
```typescript
import { Metadata } from 'next';
import { GettingStartedContent } from '@/features/docs/getting-started/GettingStartedContent';

export const metadata: Metadata = {
    title: 'Getting Started - wexts Documentation',
    description: 'Get started with wexts',
};

export default function Page() {
    return <GettingStartedContent />;
}
```

### Feature Components
Located in `features/` - These contain the actual content:
- Full SSR server components
- All business logic and content
- Reusable across multiple pages if needed
- Can be tested independently

## 📁 Structure

```
apps/docs-web/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home (imports from features/home/)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── docs/
│       ├── page.tsx             # Docs index
│       ├── layout.tsx           # Docs layout with sidebar
│       ├── getting-started/
│       │   ├── page.tsx         # Getting started (imports feature)
│       │   ├── installation/
│       │   │   └── page.tsx
│       │   └── quick-start/
│       │       └── page.tsx
│       ├── features/
│       │   ├── page.tsx
│       │   ├── rpc/page.tsx
│       │   ├── type-safety/page.tsx
│       │   └── insight/page.tsx
│       ├── examples/
│       │   └── page.tsx
│       └── api/
│           └── page.tsx
│
├── features/                     # Feature components (SSR)
│   ├── home/
│   │   └── HomePage.tsx         # Home page content
│   └── docs/
│       ├── DocsIndexContent.tsx
│       ├── getting-started/
│       │   ├── GettingStartedContent.tsx
│       │   ├── InstallationContent.tsx
│       │   └── QuickStartContent.tsx
│       ├── features/
│       │   ├── FeaturesContent.tsx
│       │   ├── RPCContent.tsx
│       │   ├── TypeSafetyContent.tsx
│       │   └── InsightContent.tsx
│       ├── examples/
│       │   └── ExamplesContent.tsx
│       └── api/
│           └── APIReferenceContent.tsx
│
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   ├── mdx/                     # MDX components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── TableOfContents.tsx
│   └── ThemeProvider.tsx
│
└── lib/
    └── utils.ts
```

## ✅ Benefits

1. **Clean Separation**: Pages vs Features
2. **SSR Optimized**: All content rendered on server
3. **Reusable**: Feature components can be used anywhere
4. **Type Safe**: Full TypeScript support
5. **Testable**: Easy to test feature components
6. **Maintainable**: Clear file structure

## 🚀 Running

```bash
cd apps/docs-web
pnpm dev
```

Site runs on: **http://localhost:3001**

## 📝 Adding New Pages

1. Create page file in `app/`
2. Create feature component in `features/`
3. Import feature in page (max 10 lines)

Example:
```typescript
// app/docs/new-page/page.tsx
import { Metadata } from 'next';
import { NewPageContent } from '@/features/docs/NewPageContent';

export const metadata: Metadata = {
    title: 'New Page - wexts',
    description: 'Description here',
};

export default function Page() {
    return <NewPageContent />;
}
```

```typescript
// features/docs/NewPageContent.tsx
export function NewPageContent() {
    return (
        <article className="mdx-content">
            <h1>New Page</h1>
            {/* Your content here */}
        </article>
    );
}
```

## 🎨 Styling

- All pages use `mdx-content` class for consistent typography
- Components use Tailwind CSS
- Theme provider handles dark/light mode
- Global styles in `app/globals.css`
