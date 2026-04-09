'use client';

import { useEffect, useRef } from 'react';
import { useQueries } from '@tanstack/react-query';

import { useCartStore } from '@/stores';

import { useProductQuery } from './products';

export const useCartSync = () => {
  const syncedRef = useRef<Map<string, number>>(new Map());

  const items = useCartStore((state) => state.items);
  const setItem = useCartStore((state) => state.setItem);

  const productQueries = useQueries({
    queries: items.map((item) => ({ ...useProductQuery, queryKey: useProductQuery.queryKey(item.productId) })),
  });

  useEffect(() => {
    const currentIds = new Set(items.map((i) => i.externalId));
    for (const key of syncedRef.current.keys()) if (!currentIds.has(key)) syncedRef.current.delete(key);

    productQueries.forEach((product, index) => {
      if (!product.isSuccess || product.isFetching) return;

      const item = items[index];
      const lastSynced = syncedRef.current.get(item.externalId);

      if (lastSynced === product.dataUpdatedAt) return;
      syncedRef.current.set(item.externalId, product.dataUpdatedAt);

      const freshVariant = product.data.variants.find((v) => v.externalId === item.externalId);
      if (!freshVariant) return;

      const hasChanged =
        freshVariant.price !== item.price ||
        freshVariant.compareAt !== item.compareAt ||
        freshVariant.stock !== item.stock;

      if (hasChanged)
        setItem({ ...item, stock: freshVariant.stock, price: freshVariant.price, compareAt: freshVariant.compareAt });
    });
  }, [productQueries, items, setItem]);
};
