'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, LanguageSkillIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

import { locales, usePathname } from '@/i18n';
import { cn } from '@/lib/utils';

import { Link } from '../Link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui';
import { Button } from '../Button';

interface NavButtonProps {
  isFull?: boolean;

  className?: string;
}

export const LocaleSwitcher = ({ isFull = false, className }: NavButtonProps) => {
  const [open, setOpen] = useState(false);

  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('p-1 size-8 h-auto transition-colors duration-300 hover:text-foreground', className)}
        >
          {isFull && (
            <>
              {t(currentLocale)}{' '}
              <HugeiconsIcon
                icon={ChevronDown}
                className={cn('size-6 transition-transform duration-300', { 'rotate-x-180': open })}
              />
            </>
          )}

          {!isFull && <HugeiconsIcon icon={LanguageSkillIcon} className="size-full rtl:rotate-y-180" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-24">
        {locales.map((locale) => (
          <DropdownMenuItem asChild key={locale}>
            <Link
              href={pathname}
              locale={locale}
              scroll
              isDisabled={locale === currentLocale}
              className={cn('block w-full text-md', { 'font-bold': locale === currentLocale })}
            >
              {t(locale)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
