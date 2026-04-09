'use client';

import { useEffect, useRef } from 'react';
import { useQueries } from '@tanstack/react-query';

import { useCartStore } from '@/stores';

import { useProductQuery } from './products';

export const useCartSync = () => {
  const syncedRef = useRef<Set<string>>(new Set());

  const items = useCartStore((state) => state.items);
  const setItem = useCartStore((state) => state.setItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const productQueries = useQueries({
    queries: items.map((item) => ({ ...useProductQuery, queryKey: useProductQuery.queryKey(item.productId) })),
  });

  useEffect(() => {
    productQueries.forEach((product, index) => {
      if (!product.isSuccess || product.isFetching) return;

      const item = items[index];

      const syncKey = `${item.externalId}-${product.dataUpdatedAt}`;
      if (syncedRef.current.has(syncKey)) return;
      syncedRef.current.add(syncKey);

      const freshVariant = product.data.variants.find((v) => v.externalId === item.externalId);
      if (!freshVariant) return;

      const hasChanged =
        freshVariant.price !== item.price ||
        freshVariant.compareAt !== item.compareAt ||
        freshVariant.stock !== item.stock;

      if (hasChanged)
        setItem({ ...item, stock: freshVariant.stock, price: freshVariant.price, compareAt: freshVariant.compareAt });
    });
  }, [productQueries, items, setItem, removeItem]);
};
