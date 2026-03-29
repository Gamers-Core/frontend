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
    <div
      className={cn(
        'fixed top-0 inset-x-0 inset-e-(--removed-body-scroll-bar-size,0) z-50 transition-colors duration-300',
        {
          'bg-white dark:bg-black': isScrolled,
        },
      )}
    >
      <SideMenu locale={locale} />

      <header
        className={cn(
          'md:container mx-auto flex items-center justify-between px-4 py-3 bg-transparent transition-colors duration-300 text-sm font-medium text-muted-foreground',
        )}
      >
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className={cn('p-0 size-6 block md:hidden hover:bg-transparent! hover:text-muted-foreground', {
              'text-black dark:text-white': isScrolled,
            })}
          />

          <Logo className={cn('text-white block lg:block', { 'text-black dark:text-white': isScrolled })} />

          <nav className="hidden md:block">
            <NavItems isInverted={isScrolled} />
          </nav>
        </div>

        <div
          className={cn('flex items-center gap-1.5 text-primary-foreground transition-colors duration-300', {
            'text-black dark:text-white': isScrolled,
          })}
        >
          <NavButton isScrolled={isScrolled} icon={Search} />
          <NavButton isScrolled={isScrolled} icon={User} className="hidden md:block" />
          <NavButton isScrolled={isScrolled} icon={ShoppingBag} />
          <ModeToggle className={cn(buttonClassName(isScrolled), 'hidden md:block')} />
          <LocaleSwitcher className={cn(buttonClassName(isScrolled), 'hidden md:block')} />
        </div>
      </header>
    </div>
  );
};
