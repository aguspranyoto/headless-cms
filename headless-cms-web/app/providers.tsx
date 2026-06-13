'use client';

import { QueryProvider } from '@/lib/query';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Toaster position="top-right" />
      {children}
    </QueryProvider>
  );
}
