'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUp02Icon } from '@hugeicons/core-free-icons';

import { useScroll } from '@/hooks';
import { cn } from '@/lib/utils';

import { Button } from './Button';

export const GoToTopButton = () => {
  const { isScrolled } = useScroll({ threshold: 200 });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      className={cn(
        'z-10 fixed bottom-5 -inset-e-12 opacity-0 pointer-events-none md:bottom-10 rounded-full size-12 md:size-12 backdrop-blur-xl border border-sidebar-border transition-all duration-500',
        { 'opacity-100 inset-e-5 md:inset-e-10 pointer-events-auto': isScrolled },
      )}
      icon={<HugeiconsIcon icon={ArrowUp02Icon} className="text-foreground" />}
      size="icon-lg"
    />
  );
};
