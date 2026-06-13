'use client';

import { QueryProvider } from '@/lib/query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <Toaster position="top-right" duration={10000} />
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}
