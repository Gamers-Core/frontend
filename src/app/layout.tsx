import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { cn } from '@/lib/utils';

import './globals.css';

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

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', inter.variable)}>
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="oklch(0.424 0.199 265.638)" />

        {children}
      </body>
    </html>
  );
};

export default RootLayout;
