'use client';

import { useAuthSync, useCartProducts, useCartSync } from '@/hooks';

import { CartDrawer } from './cart';

export const QueryProviders = () => {
  useCartSync();
  useCartProducts();
  useAuthSync();

  return <CartDrawer />;
};
