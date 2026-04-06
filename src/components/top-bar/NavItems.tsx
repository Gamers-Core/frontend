import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n';
import { cn } from '@/lib/utils';

import { navItems } from './const';
import { HugeiconsIcon } from '@hugeicons/react';

interface NavItemsProps {
  className?: string;
  extended?: boolean;
}

export const NavItems = ({ className, extended = false }: NavItemsProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <ul className={cn('flex items-center gap-4 text-sm text-muted-foreground', className)}>
      {navItems.map(({ name, href, icon }) => (
        <li key={href}>
          <Link
            href={href}
            className={cn(
              'font-medium hover:dark:text-foreground transition-colors duration-300 flex items-center gap-2',
              {
                'text-foreground': pathname.startsWith(href),
              },
            )}
          >
            {extended && icon && (
              <HugeiconsIcon icon={icon} strokeWidth={2} className="size-6 inline-block rtl:rotate-y-180" />
            )}

            {t(name)}
          </Link>
        </li>
      ))}
    </ul>
  );
};
