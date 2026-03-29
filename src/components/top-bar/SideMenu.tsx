import { Locale } from 'next-intl';
import { Cancel, User } from '@hugeicons/core-free-icons';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, useSidebar } from '../ui';
import { ModeToggle } from './ModeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { NavButton } from './NavButton';
import { NavItems } from './NavItems';
import { Button } from '../Button';
import { HugeiconsIcon } from '@hugeicons/react';

interface SideMenuProps {
  locale: Locale;
}

export const SideMenu = ({ locale }: SideMenuProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar variant="sidebar" side={locale === 'ar' ? 'right' : 'left'}>
      <SidebarHeader className="p-4 pt-2">
        <Button
          variant="ghost"
          className="w-fit p-0.5 h-auto"
          onClick={toggleSidebar}
          icon={<HugeiconsIcon icon={Cancel} className="size-8" />}
        />
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <NavItems extended className="flex flex-col justify-start items-start text-3xl rtl:text-2xl gap-6" />
        </SidebarGroup>
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
};
