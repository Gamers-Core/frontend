import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';

import { cn } from '@/lib/utils';

import { Button } from '../Button';
import { buttonClassName } from './helpers';

interface NavButtonProps {
  icon: IconSvgElement;
  onClick?: () => void;
  isScrolled?: boolean;
  className?: string;
}

export const NavButton = ({ isScrolled = false, onClick, icon, className }: NavButtonProps) => (
  <Button
    onClick={onClick}
    icon={<HugeiconsIcon icon={icon} className="rtl:rotate-y-180 size-full transition-colors duration-300" />}
    variant="ghost"
    className={cn(buttonClassName(isScrolled), className)}
  />
);
