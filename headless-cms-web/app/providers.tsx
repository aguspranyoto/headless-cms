'use client';

import { QueryProvider } from '@/lib/query';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Toaster position="top-right" duration={10000} />
      {children}
    </QueryProvider>
  );
}
