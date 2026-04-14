'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { useState } from 'react';

import { Locale } from '@/i18n';
import { useAuthSync, useCartProducts, useCartSync } from '@/hooks';

import { SidebarProvider, TooltipProvider, Toaster } from './ui';
import { CartDrawer } from './cart';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
  isLoggedIn?: boolean;
}

export const Providers = ({ children, locale, messages, isLoggedIn = false }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
        <QueryClientProvider client={queryClient}>
          <SidebarProvider className="flex flex-col items-center">
            <TooltipProvider>
              <AuthProvider isLoggedIn={isLoggedIn} />
              <CartProvider />

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

const CartProvider = () => {
  useCartSync();
  useCartProducts();

  return <CartDrawer />;
};

interface AuthProviderProps {
  isLoggedIn: boolean;
}

const AuthProvider = ({ isLoggedIn }: AuthProviderProps) => {
  useAuthSync(isLoggedIn);

  return null;
};
