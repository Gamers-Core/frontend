'use client';

import { useLayoutEffect, useState } from 'react';

interface ScrollProps {
  threshold?: number;
}

export const useScroll = ({ threshold = 50 }: ScrollProps = {}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useLayoutEffect(() => {
    let ticking = false;

    const update = () => {
      const shouldBeScrolled = window.scrollY > threshold;

      setIsScrolled((prev) => {
        if (prev === shouldBeScrolled) return prev;
        return shouldBeScrolled;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { isScrolled };
};
