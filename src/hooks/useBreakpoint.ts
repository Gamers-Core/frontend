'use client';

import { useEffect, useState } from 'react';

import { isClient } from '@/helpers';

const breakpoints = {
  phone: 0,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
} as const satisfies Record<string, number>;

export type Breakpoint = keyof typeof breakpoints;

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const current =
        (Object.entries(breakpoints) as [Breakpoint, number][]).reverse().find(([, value]) => width >= value)?.[0] ??
        null;

      setBreakpoint(current);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const client = isClient();
  const isAbove = (bp: Breakpoint) => client && window.innerWidth >= breakpoints[bp];
  const isBelow = (bp: Breakpoint) => client && window.innerWidth < breakpoints[bp];

  const isMobile = breakpoint === 'phone';

  console.log(breakpoint, isMobile);

  return { breakpoint, isAbove, isBelow, isMobile };
};
