import { cn } from '@/lib/utils';

import { Link } from './Link';
import { LogoIcon } from '@/assets';

interface LogoProps {
  isCompact?: boolean;
  className?: string;
}

export const Logo = ({ isCompact = false, className }: LogoProps) => (
  <Link
    href="/"
    className={cn('relative flex items-center gap-2 w-fit text-inherit before:absolute before:-inset-1.5', className)}
  >
    {/* TODO: Add logo image when available */}

    <LogoIcon className="text-inherit" isCompact={isCompact} />
  </Link>
);
