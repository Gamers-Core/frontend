import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n';
import { cn } from '@/lib/utils';

import { navItems } from './const';

interface NavItemsProps {
  isScrolled?: boolean;
  className?: string;
}

export const NavItems = ({ isScrolled, className }: NavItemsProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className={className}>
      <ul className="flex items-center gap-4">
        {navItems.map(({ name, href }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300',
                {
                  'text-foreground': pathname.startsWith(href),
                  'text-gray-400 hover:text-gray-800': isScrolled,
                },
              )}
            >
              {t(name)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
