import { Hamburger, X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

import { useDisclosure } from '@/hooks';
import { cn } from '@/lib/utils';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ModeToggle } from './ModeToggle';
import { NavItems } from './NavItems';
import { Button } from '../Button';

interface SideMenuDrawerProps {
  triggerClassName?: string;
}

export const SideMenuDrawer = ({ triggerClassName }: SideMenuDrawerProps) => {
  const t = useTranslations();

  const disclosure = useDisclosure();

  return (
    <Drawer {...disclosure}>
      <DrawerTrigger asChild>
        <Button
          icon={<HugeiconsIcon icon={Hamburger} strokeWidth={2} className="rtl:rotate-180  size-full" />}
          variant="ghost"
          className={cn(
            'active:bg-transparent aria-expanded:bg-transparent aria-expanded:text-inherit',
            triggerClassName,
          )}
        />
      </DrawerTrigger>

      <DrawerContent className="bg-transparent before:backdrop-blur-lg before:bg-popover/60 h-full">
        <DrawerHeader>
          <div className="sr-only">
            <DrawerTitle>{t('side_menu_title')}</DrawerTitle>

            <DrawerDescription>{t('side_menu_description')}</DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button icon={<HugeiconsIcon icon={X} />} variant="outline" className="w-fit ms-auto" />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 px-4 flex flex-col gap-5 overflow-y-auto">
          <NavItems
            extended
            className="flex flex-col justify-start items-start text-3xl rtl:text-2xl gap-6 text-black dark:text-gray-400"
            onClick={disclosure.onClose}
          />
        </div>

        <DrawerFooter className="gap-4 flex-row justify-between items-center p-4">
          <LocaleSwitcher isFull className="size-auto text-xl" />

          <ModeToggle className="size-8" align="end" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

    // <Sidebar
    //   variant="sidebar"
    //   side={locale === 'ar' ? 'right' : 'left'}
    //   className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(0,0,0,0.2)]  backdrop-blur-2xl border-none!"
    // >
    //   <SidebarHeader className="p-4 pt-2">
    //     <Button
    //       variant="ghost"
    //       className="w-fit p-0.5 h-auto"
    //       onClick={toggleSidebar}
    //       icon={<HugeiconsIcon icon={Cancel} className="size-8" />}
    //     />
    //   </SidebarHeader>

    //   <SidebarContent className="px-4">
    //     <SidebarGroup>
    //       <NavItems
    //         extended
    //         className="flex flex-col justify-start items-start text-3xl rtl:text-2xl gap-6 text-black dark:text-gray-400"
    //       />
    //     </SidebarGroup>
    //   </SidebarContent>
    //   <SidebarFooter className="flex flex-row gap-4 justify-between items-center p-4">
    //     <LocaleSwitcher isFull className="size-auto text-xl" />

    //     <ModeToggle className="size-8" />
    //   </SidebarFooter>
    // </Sidebar>
  );
};
