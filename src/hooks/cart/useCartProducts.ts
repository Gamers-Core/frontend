'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useCartStore } from '@/stores';

import { useManyProductsQuery, useSetProductData } from '../products';
import { buildSignature } from './helpers';

export const useCartProducts = () => {
  const items = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);
  const previousQuantitySignatureRef = useRef<string | null>(null);

  const uniqueProductIds = useMemo(() => [...new Set(items.map(({ productId }) => productId))], [items]);
  const quantitySignature = useMemo(() => buildSignature(items), [items]);

  const setProductData = useSetProductData();
  const productsQuery = useManyProductsQuery(uniqueProductIds);
  const { refetch } = productsQuery;

  useEffect(() => {
    const previousQuantitySignature = previousQuantitySignatureRef.current;
    if (previousQuantitySignature === quantitySignature) return;

    previousQuantitySignatureRef.current = quantitySignature;

    if (previousQuantitySignature === null || uniqueProductIds.length === 0) return;

    refetch();
  }, [quantitySignature, refetch, uniqueProductIds.length]);

  const productMap = useMemo(
    () =>
      new Map(
        (productsQuery.data ?? []).map((product) => [
          product.id,
          { ...product, variantMap: new Map(product.variants.map((v) => [v.externalId, v])) },
        ]),
      ),
    [productsQuery.data],
  );

  useEffect(() => {
    if (!productsQuery.isSuccess || productsQuery.isFetching) return;

    for (const product of productsQuery.data) setProductData(product.id, product);
  }, [productsQuery.data, productsQuery.isFetching, productsQuery.isSuccess, setProductData]);

  useEffect(() => {
    if (!productsQuery.isSuccess || productsQuery.isFetching) return;

    let didChange = false;

    const updatedItems = useCartStore.getState().items.reduce<typeof items>((acc, item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        acc.push(item);
        return acc;
      }

      const freshVariant = product.variantMap.get(item.externalId);
      if (!freshVariant) {
        acc.push(item);
        return acc;
      }

      const maxStock = Math.max(freshVariant.stock, 0);
      if (maxStock === 0) {
        didChange = true;
        return acc;
      }

      const nextQuantity = Math.min(item.quantity, maxStock);

      const hasChanged =
        product.name !== item.productName ||
        freshVariant.name !== item.name ||
        freshVariant.price !== item.price ||
        freshVariant.compareAt !== item.compareAt ||
        freshVariant.stock !== item.stock ||
        nextQuantity !== item.quantity;

      if (!hasChanged) {
        acc.push(item);
        return acc;
      }

      didChange = true;
      acc.push({
        ...item,
        productName: product.name,
        name: freshVariant.name,
        price: freshVariant.price,
        compareAt: freshVariant.compareAt,
        stock: freshVariant.stock,
        quantity: nextQuantity,
      });

      return acc;
    }, []);

    if (didChange) setItems(updatedItems);
  }, [productMap, productsQuery.dataUpdatedAt, productsQuery.isFetching, productsQuery.isSuccess, setItems]);
};
