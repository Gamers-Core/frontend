import { cn } from '@/lib/utils';
import { Link } from './Link';

interface LogoProps {
  isFull?: boolean;
  className?: string;
}

export const Logo = ({ isFull = true, className }: LogoProps) => (
  <Link href="/" className={cn('flex items-center gap-2', className)}>
    {/* TODO: Add logo image when available */}

    <p className="select-none text-2xl font-extrabold text-nowrap transition-colors duration-300">
      {isFull && 'Gamers Core'}
    </p>
  </Link>
);
