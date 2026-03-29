'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { useState } from 'react';

import { Locale } from '@/i18n';

import { SidebarProvider, TooltipProvider } from './ui';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
}

export const Providers = ({ children, locale, messages }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
        <QueryClientProvider client={queryClient}>
          <SidebarProvider className="flex flex-col items-center">
            <TooltipProvider>{children}</TooltipProvider>
          </SidebarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
};
