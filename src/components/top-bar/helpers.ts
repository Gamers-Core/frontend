import { cn } from '@/lib/utils';

export const buttonClassName = (isScrolled: boolean) =>
  cn('p-1 size-8 h-auto transition-colors duration-300 hover:text-foreground', {
    'hover:bg-transparent!': isScrolled,
  });
