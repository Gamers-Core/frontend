'use client';

import { useAuthSync, useCartProducts, useCartSync } from '@/hooks';

import { CartDrawer } from './cart';
import { PixelPageView } from './PixelPageView';

export const QueryProviders = () => {
  useCartSync();
  useCartProducts();
  useAuthSync();

  return (
    <>
      <PixelPageView />

      <CartDrawer />
    </>
  );
};
