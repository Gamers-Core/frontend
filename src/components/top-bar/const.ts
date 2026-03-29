import { Building06FreeIcons, ChatQuestion01FreeIcons, Shop } from '@hugeicons/core-free-icons';
import { IconSvgElement } from '@hugeicons/react';
import { Messages } from 'next-intl';

interface NavItem {
  name: keyof Messages;
  href: string;
  icon?: IconSvgElement;
}

export const navItems: NavItem[] = [
  {
    name: 'nav_shop',
    href: '/shop',
    icon: Shop,
  },
  {
    name: 'nav_brands',
    href: '/brands',
    icon: Building06FreeIcons,
  },
  {
    name: 'nav_faqs',
    href: '/faqs',
    icon: ChatQuestion01FreeIcons,
  },
];
