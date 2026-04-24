'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

import { Locale } from '@/i18n';
import { useAuthStore } from '@/stores';

import { SidebarProvider, TooltipProvider, Toaster } from './ui';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
  isLoggedIn?: boolean;
}

export const Providers = ({ children, locale, messages, isLoggedIn = false }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  useEffect(() => {
    setIsLoggedIn(isLoggedIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <NextThemesProvider enableColorScheme attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
        <QueryClientProvider client={queryClient}>
          <SidebarProvider className="flex flex-col items-center">
            <TooltipProvider>
              {children}

              <Toaster duration={5000} richColors dir={locale === 'ar' ? 'rtl' : 'ltr'} position="top-center" />
            </TooltipProvider>
          </SidebarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
};
