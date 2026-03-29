import type { Metadata } from 'next';
import { Cairo, Oxanium } from 'next/font/google';
import HolyLoader from 'holy-loader';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';

import { routing } from '@/i18n';
import { Providers } from '@/components';
import { cn } from '@/lib/utils';

import './globals.css';

const oxanium = Oxanium({ subsets: ['latin'], variable: '--font-oxanium' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'Gamers Core',
  creator: 'Gamers Core',
  publisher: 'Gamers Core',
  applicationName: 'Gamers Core',
  description: 'Get your gaming Gear at the best price',
  authors: [{ name: 'Gamers Core', url: 'https://gamerscore.com' }],
  keywords: ['gaming', 'gear', 'best price', 'gamers core', 'controllers', 'gaming accessories'],
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout = async ({ children, params }: Readonly<RootLayoutProps>) => {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={cn('h-full', 'antialiased', cairo.variable, oxanium.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <HolyLoader color="oklch(0.424 0.199 265.638)" />

        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
