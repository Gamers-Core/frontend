import { cn } from '@/lib/utils';

import { Link } from './Link';
import { LogoIcon } from '@/assets';

interface LogoProps {
  isCompact?: boolean;
  className?: string;
}

export const Logo = ({ isCompact = false, className }: LogoProps) => (
  <Link href="/" className={cn('flex items-center gap-2 w-fit p-1.5 text-inherit', className)}>
    {/* TODO: Add logo image when available */}

    <LogoIcon className="text-inherit" isCompact={isCompact} />
  </Link>
);
