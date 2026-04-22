'use client';

import { useTranslations } from 'next-intl';

import { policies } from '@/api';

import { Logo } from './Logo';
import { Link } from './Link';

export const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="flex items-center min-h-20 border-t-2 border-sidebar-border w-full">
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-10 md:container flex-wrap px-4 py-8">
        <Logo className="flex-1" />

        <div className="flex-1 grid grid-cols-2 md:flex-0 md:flex gap-4 min-w-fit">
          {policies.map((policy) => (
            <Link
              key={policy}
              href={`/policies/${policy}`}
              className="block min-w-max transition-colors duration-300 hover:text-primary hover:underline text-lg md:text-base text-center md:text-start"
            >
              {t(`policy_${policy}`)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
