import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import HolyLoader from 'holy-loader';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { routing } from '@/i18n';
import { Providers } from '@/components';
import { cn } from '@/lib/utils';

import './globals.css';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Gamers Core',
  creator: 'Gamers Core',
  publisher: 'Gamers Core',
  applicationName: 'Gamers Core',
  description: 'Get your gaming Gear at the best price',
  authors: [{ name: 'Gamers Core', url: 'https://gamerscore.com' }],
  keywords: ['gaming', 'gear', 'best price', 'gamers core', 'controllers', 'gaming accessories'],
};

const RootLayout = async ({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang="en" className={cn('h-full', 'antialiased', inter.variable)}>
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
