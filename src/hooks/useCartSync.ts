'use client';

import { useEffect, useRef } from 'react';
import { useQueries } from '@tanstack/react-query';

import { useCartStore } from '@/stores';

import { useProductQuery } from './products';

export const useCartSync = () => {
  const syncedRef = useRef<Map<string, number>>(new Map());

  const items = useCartStore((state) => state.items);
  const setItem = useCartStore((state) => state.setItem);

  const uniqueProductIds = [...new Set(items.map(({ productId }) => productId))];

  const productQueries = useQueries({
    queries: uniqueProductIds.map((productId) => ({
      ...useProductQuery,
      queryKey: useProductQuery.queryKey(productId),
    })),
  });

  const productQueryMap = new Map(uniqueProductIds.map((productId, index) => [productId, productQueries[index]]));

  useEffect(() => {
    const currentIds = new Set(items.map(({ externalId }) => externalId));
    for (const key of syncedRef.current.keys()) if (!currentIds.has(key)) syncedRef.current.delete(key);

    items.forEach((item) => {
      const product = productQueryMap.get(item.productId);
      if (!product?.isSuccess || product.isFetching) return;

      const lastSynced = syncedRef.current.get(item.externalId);
      if (lastSynced === product.dataUpdatedAt) return;

      syncedRef.current.set(item.externalId, product.dataUpdatedAt);

      const freshVariant = product.data.variants.find((v) => v.externalId === item.externalId);
      if (!freshVariant) return;

      const hasProductNameChanged = product.data.name !== item.productName;
      const hasVariantNameChanged = freshVariant.name !== item.name;
      const hasPriceChanged = freshVariant.price !== item.price;
      const hasCompareAtChanged = freshVariant.compareAt !== item.compareAt;
      const hasStockChanged = freshVariant.stock !== item.stock;
      const hasChanged =
        hasProductNameChanged || hasVariantNameChanged || hasPriceChanged || hasCompareAtChanged || hasStockChanged;

      if (hasChanged)
        setItem({
          ...item,
          productName: hasProductNameChanged ? product.data.name : item.productName,
          name: hasVariantNameChanged ? freshVariant.name : item.name,
          price: hasPriceChanged ? freshVariant.price : item.price,
          compareAt: hasCompareAtChanged ? freshVariant.compareAt : item.compareAt,
          stock: hasStockChanged ? freshVariant.stock : item.stock,
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productQueries, items, setItem]);
};
