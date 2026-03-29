import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';

import { cn } from '@/lib/utils';

import { Button } from '../Button';
import { buttonClassName } from './helpers';

interface NavButtonProps {
  icon: IconSvgElement;
  isScrolled?: boolean;
  className?: string;
}

export const NavButton = ({ isScrolled = false, icon, className }: NavButtonProps) => (
  <Button
    icon={<HugeiconsIcon icon={icon} className="rtl:rotate-y-180 size-full" />}
    variant="ghost"
    className={cn(buttonClassName(isScrolled), className)}
  />
);
