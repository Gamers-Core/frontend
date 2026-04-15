'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { CreateItem } from '@/api';
import { mapBackendCartItemToCartItem, useAuthStore, useCartStore } from '@/stores';

import { buildSignatureFromItems, toCreateItems } from './helpers';
import { useCartSyncMutation } from './useCartSyncMutation';
import { useCartQuery } from './useCartQuery';

type SyncStatus = 'idle' | 'hydrating' | 'ready';

export const useCartSync = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const items = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);

  const cartQuery = useCartQuery(isLoggedIn);
  const cartSyncMutation = useCartSyncMutation();

  const wasLoggedInRef = useRef(false);
  const statusRef = useRef<SyncStatus>('idle');
  const syncLockRef = useRef(false);
  const lastSyncedSignatureRef = useRef<string | null>(null);
  const skipNextSyncRef = useRef(false);

  const payload = useMemo<CreateItem[]>(() => toCreateItems(items), [items]);

  const payloadSignature = useMemo(() => buildSignatureFromItems(payload), [payload]);

  const syncPayload = useCallback(
    (nextPayload: CreateItem[], nextSignature: string) => {
      if (syncLockRef.current) return;

      const previousSignature = lastSyncedSignatureRef.current;
      lastSyncedSignatureRef.current = nextSignature;
      syncLockRef.current = true;

      cartSyncMutation.mutate(nextPayload, {
        onSuccess: (cart) => {
          const mappedItems = cart.items.map(mapBackendCartItemToCartItem);
          setItems(mappedItems);

          lastSyncedSignatureRef.current = buildSignatureFromItems(mappedItems);
        },
        onError: () => {
          lastSyncedSignatureRef.current = previousSignature;
        },
        onSettled: () => {
          syncLockRef.current = false;
        },
      });
    },
    [cartSyncMutation, setItems],
  );

  useEffect(() => {
    if (!isLoggedIn) {
      wasLoggedInRef.current = false;
      statusRef.current = 'idle';
      syncLockRef.current = false;
      lastSyncedSignatureRef.current = null;
      skipNextSyncRef.current = false;
      return;
    }

    const justLoggedIn = !wasLoggedInRef.current;
    wasLoggedInRef.current = true;

    if (justLoggedIn) {
      statusRef.current = 'hydrating';
    }

    if (statusRef.current !== 'hydrating') return;
    if (syncLockRef.current || cartSyncMutation.isPending || !cartQuery.isSuccess) return;

    const backendItems = cartQuery.data.items.map(mapBackendCartItemToCartItem);
    const backendSignature = buildSignatureFromItems(backendItems);

    statusRef.current = 'ready';

    skipNextSyncRef.current = true;
    setItems(backendItems);

    lastSyncedSignatureRef.current = backendSignature;
  }, [cartQuery.data, cartQuery.isSuccess, cartSyncMutation.isPending, isLoggedIn, setItems]);

  useEffect(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    if (!isLoggedIn || statusRef.current !== 'ready') return;
    if (syncLockRef.current || cartSyncMutation.isPending) return;
    if (lastSyncedSignatureRef.current === payloadSignature) return;

    syncPayload(payload, payloadSignature);
  }, [cartSyncMutation.isPending, isLoggedIn, payload, payloadSignature, syncPayload]);
};
