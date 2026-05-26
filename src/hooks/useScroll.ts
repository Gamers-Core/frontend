'use client';

import { useLayoutEffect, useState } from 'react';

interface ScrollProps {
  threshold?: number;
  thresholdPercentage?: number;
}

export const useScroll = ({ threshold = 50, thresholdPercentage }: ScrollProps = {}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useLayoutEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      let shouldBeScrolled: boolean;

      if (thresholdPercentage !== undefined) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollY / scrollHeight) * 100;
        shouldBeScrolled = scrollPercentage > thresholdPercentage;
      } else shouldBeScrolled = scrollY > threshold;

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

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, thresholdPercentage]);

  return { isScrolled };
};
