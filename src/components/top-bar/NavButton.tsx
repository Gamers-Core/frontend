import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';

import { cn } from '@/lib/utils';

import { buttonClassName } from './helpers';
import { Link, LinkProps } from '../Link';

interface NavButtonProps extends LinkProps {
  icon: IconSvgElement;
  isScrolled?: boolean;
}

export const NavButton = ({ isScrolled = false, icon, className, ...props }: NavButtonProps) => (
  <Link {...props} className={cn('hover:bg-muted/50 rounded-lg', buttonClassName(isScrolled), className)}>
    <HugeiconsIcon icon={icon} className="rtl:rotate-y-180 size-full transition-colors duration-300" />
  </Link>
);
