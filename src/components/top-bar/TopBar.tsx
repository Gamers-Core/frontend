'use client';

import { Search, User } from '@hugeicons/core-free-icons';
import { useLocale } from 'next-intl';

import { useScroll } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores';

import { Logo } from '../Logo';
import { NavItems } from './NavItems';
import { SidebarTrigger } from '../ui';
import { SideMenu } from './SideMenu';
import { ModeToggle } from './ModeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { NavButton } from './NavButton';
import { buttonClassName } from './helpers';
import { CartButton } from '../cart';

interface TopBarProps {
  isHome?: boolean;
}

export const TopBar = ({ isHome = false }: TopBarProps) => {
  const locale = useLocale();

  const { isScrolled } = useScroll({ threshold: isHome ? 50 : 20 });

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div
      className={cn(
        'fixed top-0 inset-x-0 right-(--removed-body-scroll-bar-size,0) z-50 transition-colors duration-300',
        { 'bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-2xl': isScrolled },
      )}
    >
      <SideMenu locale={locale} />

      <header className="md:container flex items-center justify-between px-4 py-3 bg-transparent transition-colors duration-300 text-sm font-medium text-muted-foreground">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className={cn('p-0 size-6 block md:hidden hover:bg-transparent! hover:text-muted-foreground', {
              'text-black dark:text-white': isScrolled || !isHome,
            })}
          />

          <Logo className={cn('text-white block lg:block', { 'text-black dark:text-white': isScrolled || !isHome })} />

          <nav className="hidden md:block">
            <NavItems
              className={cn('text-primary-foreground', {
                'text-black dark:text-gray-400 hover:text-gray-800': isScrolled || !isHome,
              })}
            />
          </nav>
        </div>

        <div
          className={cn('flex items-center gap-1.5 text-primary-foreground transition-colors duration-300', {
            'text-gray-900 dark:text-white': isScrolled || !isHome,
          })}
        >
          <NavButton href="/search" isDisabled isScrolled={isScrolled} icon={Search} />
          <NavButton href={isLoggedIn ? '/profile' : '/signin'} isScrolled={isScrolled} icon={User} />
          <CartButton iconOnly className={buttonClassName(isScrolled)} />
          <ModeToggle className={cn(buttonClassName(isScrolled), 'hidden md:block')} />
          <LocaleSwitcher className={cn(buttonClassName(isScrolled), 'hidden md:block')} />
        </div>
      </header>
    </div>
  );
};
