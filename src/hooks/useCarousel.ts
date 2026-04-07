'use client';

import { useEffect, useState } from 'react';

import { CarouselApi } from '@/components';

interface CarouselState {
  selected: number;
  items: number[];
}

export const useCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [state, setState] = useState<CarouselState>({ selected: 0, items: [] });

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setState({ selected: api.selectedScrollSnap(), items: api.scrollSnapList() });
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = (index: number) => {
    if (!api) return;

    api.scrollTo(index);
  };

  return { setApi, scrollTo, ...state };
};
