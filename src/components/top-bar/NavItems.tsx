import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';

import { usePathname } from '@/i18n';
import { cn } from '@/lib/utils';

import { navItems } from './const';
import { Link } from '../Link';
import { useSidebar } from '../ui';

interface NavItemsProps {
  className?: string;
  extended?: boolean;
}

export const NavItems = ({ className, extended = false }: NavItemsProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const { setOpenMobile } = useSidebar();

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
            onClick={() => setOpenMobile(false)}
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
