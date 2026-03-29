'use client';

import { Search, ShoppingBag, User } from '@hugeicons/core-free-icons';
import { useLocale } from 'next-intl';

import { useScroll } from '@/hooks';
import { cn } from '@/lib/utils';

import { Logo } from '../Logo';
import { NavItems } from './NavItems';
import { SidebarTrigger } from '../ui';
import { SideMenu } from './SideMenu';
import { ModeToggle } from './ModeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { NavButton } from './NavButton';
import { buttonClassName } from './helpers';

export const TopBar = () => {
  const { isScrolled } = useScroll();

  const locale = useLocale();

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-3 bg-transparent transition-colors duration-300 text-sm font-medium text-muted-foreground',
        {
          'bg-black dark:bg-white': isScrolled,
        },
      )}
    >
      <SideMenu locale={locale} />

      <div className="flex items-center gap-4">
        <SidebarTrigger
          className={cn('p-0 size-6 block sm:hidden hover:bg-transparent! hover:text-muted-foreground', {
            'text-white dark:text-black': isScrolled,
          })}
        />

        <Logo
          className={cn('dark:text-white text-black hidden xs:block sm:hidden md:block', {
            'text-white dark:text-black': isScrolled,
          })}
        />
        <Logo
          isCompact
          className={cn('dark:text-white text-black xs:hidden sm:block md:hidden', {
            'text-white dark:text-black': isScrolled,
          })}
        />

        <NavItems isScrolled={isScrolled} className="hidden sm:block" />
      </div>

      <div
        className={cn(
          'flex items-center gap-1.5 text-foreground hover:text-muted-foreground transition-colors duration-300',
          {
            'text-white dark:text-black hover:text-gray-400': isScrolled,
          },
        )}
      >
        <NavButton isScrolled={isScrolled} icon={Search} />
        <NavButton isScrolled={isScrolled} icon={User} className="hidden sm:block" />
        <NavButton isScrolled={isScrolled} icon={ShoppingBag} />
        <ModeToggle className={cn(buttonClassName(isScrolled), 'hidden sm:block')} />
        <LocaleSwitcher className={cn(buttonClassName(isScrolled), 'hidden sm:block')} />
      </div>
    </header>
  );
};
