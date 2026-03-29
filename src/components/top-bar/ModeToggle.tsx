'use client';

import { useTheme } from 'next-themes';
import { HugeiconsIcon } from '@hugeicons/react';
import { Moon02FreeIcons, Sun } from '@hugeicons/core-free-icons';
import { useLocale, useTranslations } from 'next-intl';

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  className?: string;
}

export function ModeToggle({ className }: NavButtonProps) {
  const t = useTranslations();
  const { setTheme, theme } = useTheme();
  const locale = useLocale();

  return (
    <DropdownMenu dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('p-1 size-8 h-auto transition-colors duration-300 hover:text-foreground', className)}
        >
          <HugeiconsIcon
            icon={Sun}
            className="size-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 rtl:rotate-y-180 dark:hidden"
          />

          <HugeiconsIcon
            icon={Moon02FreeIcons}
            className="size-full scale-0  rotate-90 transition-all dark:scale-100 dark:rotate-0 rtl:rotate-y-180 hidden dark:inline-block"
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-24">
        <DropdownMenuItem className={cn({ 'font-bold': theme === 'light' })} onClick={() => setTheme('light')}>
          {t('mode_light')}
        </DropdownMenuItem>
        <DropdownMenuItem className={cn({ 'font-bold': theme === 'dark' })} onClick={() => setTheme('dark')}>
          {t('mode_dark')}
        </DropdownMenuItem>
        <DropdownMenuItem className={cn({ 'font-bold': theme === 'system' })} onClick={() => setTheme('system')}>
          {t('mode_system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
