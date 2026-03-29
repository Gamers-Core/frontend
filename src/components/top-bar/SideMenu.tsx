import { Locale } from 'next-intl';
import { User } from '@hugeicons/core-free-icons';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '../ui';
import { ModeToggle } from './ModeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { NavButton } from './NavButton';

interface SideMenuProps {
  locale: Locale;
}

export const SideMenu = ({ locale }: SideMenuProps) => (
  <Sidebar variant="sidebar" side={locale === 'ar' ? 'right' : 'left'}>
    <SidebarHeader />
    <SidebarContent>
      <SidebarGroup />
      <SidebarGroup />
    </SidebarContent>
    <SidebarFooter className="flex flex-row gap-4 justify-between items-center p-4">
      <LocaleSwitcher isFull className="size-auto text-xl" />

      <div className="flex items-center gap-1.5">
        <ModeToggle className="size-8" />

        <NavButton icon={User} />
      </div>
    </SidebarFooter>
  </Sidebar>
);
