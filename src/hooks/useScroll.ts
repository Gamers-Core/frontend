'use client';

import { useLayoutEffect, useState } from 'react';

interface ScrollProps {
  threshold?: number;
}

export const useScroll = ({ threshold = 50 }: ScrollProps = {}) => {
  const [state, setState] = useState({ isScrolled: false, scrollY: 0 });

  useLayoutEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;

      setState((prev) => {
        const next = { scrollY, isScrolled: scrollY > threshold };

        return prev.scrollY === next.scrollY && prev.isScrolled === next.isScrolled ? prev : next;
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

  return state;
};
