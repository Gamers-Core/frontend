import { Messages } from 'next-intl';

interface NavItem {
  name: keyof Messages;
  href: string;
}

export const navItems: NavItem[] = [
  {
    name: 'nav_shop',
    href: '/shop',
  },
  {
    name: 'nav_brands',
    href: '/brands',
  },
  {
    name: 'nav_faqs',
    href: '/faqs',
  },
];
