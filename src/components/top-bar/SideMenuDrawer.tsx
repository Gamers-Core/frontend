'use client';

import { Hamburger, X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useLocale, useTranslations } from 'next-intl';

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
  const locale = useLocale();

  const disclosure = useDisclosure();

  return (
    <Drawer direction={locale === 'ar' ? 'right' : 'left'} {...disclosure}>
      <DrawerTrigger asChild>
        <Button
          icon={<HugeiconsIcon icon={Hamburger} strokeWidth={2} className="rtl:rotate-180  size-full" />}
          variant="ghost"
          className={cn(
            'active:bg-transparent aria-expanded:bg-transparent aria-expanded:text-inherit',
            triggerClassName,
          )}
          aria-label={t('open_side_menu')}
        />
      </DrawerTrigger>

      <DrawerContent className="bg-transparent before:backdrop-blur-lg before:bg-popover/60 h-full">
        <DrawerHeader>
          <div className="sr-only">
            <DrawerTitle>{t('side_menu_title')}</DrawerTitle>

            <DrawerDescription>{t('side_menu_description')}</DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button icon={<HugeiconsIcon icon={X} />} variant="outline" className="w-fit" aria-label={t('close')} />
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
  );
};
