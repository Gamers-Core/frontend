import { Building06FreeIcons, ChatQuestion01FreeIcons } from '@hugeicons/core-free-icons';
import { IconSvgElement } from '@hugeicons/react';
import { Messages } from 'next-intl';

interface NavItem {
  name: keyof Messages;
  href: string;
  icon?: IconSvgElement;
}

export const navItems: NavItem[] = [
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
