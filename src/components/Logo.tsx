import { LogoIcon } from '@/assets';
import { cn } from '@/lib/utils';

import { Link } from './Link';

interface LogoProps {
  isCompact?: boolean;
  className?: string;
}

export const Logo = ({ isCompact = false, className }: LogoProps) => (
  <Link
    href="/"
    className={cn(
      'relative flex items-center gap-2 w-fit text-black dark:text-white before:absolute before:-inset-1.5',
      className,
    )}
  >
    {/* TODO: Add logo image when available */}

    <LogoIcon className="text-inherit dark:text-inherit" isCompact={isCompact} />
  </Link>
);
