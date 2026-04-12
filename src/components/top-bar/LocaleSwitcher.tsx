'use client';

import { Locale, useLocale, useTranslations } from 'next-intl';
import { ChevronDown, LanguageSkillIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

import { locales, usePathname, useRouter } from '@/i18n';
import { cn } from '@/lib/utils';
import { useLocaleMutation } from '@/hooks';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui';
import { Button } from '../Button';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores';

interface NavButtonProps {
  isFull?: boolean;

  className?: string;
}

export const LocaleSwitcher = ({ isFull = false, className }: NavButtonProps) => {
  const [open, setOpen] = useState(false);

  const t = useTranslations();
  const currentLocale = useLocale();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const localeMutation = useLocaleMutation();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const onLocaleChange = async (newLocale: Locale) => {
    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ''}`;

    if (isLoggedIn) await localeMutation.mutateAsync(newLocale);

    router.push(url, { locale: newLocale });
  };

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
            <Button
              variant="ghost"
              isDisabled={locale === currentLocale}
              className={cn('block w-full text-md h-auto text-start', { 'font-bold': locale === currentLocale })}
              onClick={() => onLocaleChange(locale)}
            >
              {t(locale)}
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
