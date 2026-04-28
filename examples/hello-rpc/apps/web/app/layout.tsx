import type { ReactNode } from 'react';
import { WextsProvider } from '../lib/wexts-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WextsProvider>{children}</WextsProvider>
      </body>
    </html>
  );
}
