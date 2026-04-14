import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isClient } from '@/helpers';
import { CartItem as BackendCartItem } from '@/api';

export interface CartItem {
  externalId: string;
  productId: number;
  productName: string;
  name: string;
  imageURL: string;
  stock: number;
  price: number;
  compareAt: number | null;
  quantity: number;
}

interface CartStoreState {
  items: CartItem[];
  count: number;
  compareAtTotal: number;
  total: number;
}

interface CartStoreActions {
  setItems: (items: CartItem[]) => void;
  setItem: (item: CartItem) => void;
  updateItem: (externalId: string, update: Partial<CartItem>) => void;
  removeItem: (externalId: string) => void;
  clearCart: () => void;
}

type CartStore = CartStoreState & CartStoreActions;

const defaultState: CartStoreState = {
  items: [],
  count: 0,
  compareAtTotal: 0,
  total: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...defaultState,
      setItems: (items) => set(withDerived(items)),
      setItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.externalId === item.externalId);
          const items = exists
            ? state.items.map((i) => (i.externalId === item.externalId ? item : i))
            : [...state.items, item];
          return withDerived(items);
        }),
      updateItem: (externalId, update) =>
        set((state) => {
          const items = state.items.map((i) =>
            i.externalId === externalId ? { ...i, ...update, quantity: update.quantity ?? i.quantity } : i,
          );
          return withDerived(items);
        }),
      removeItem: (externalId) =>
        set((state) => {
          const items = state.items.filter((i) => i.externalId !== externalId);
          return withDerived(items);
        }),
      clearCart: () => set(defaultState),
    }),
    {
      name: 'cart',
      storage: isClient() ? createJSONStorage(() => localStorage) : undefined,
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.setItems(state.items);
      },
    },
  ),
);

const withDerived = (items: CartItem[]) => {
  let count = 0;
  let total = 0;
  let compareAtTotal = 0;

  items.forEach((item) => {
    count += item.quantity;
    total += item.price * item.quantity;
    compareAtTotal += (item.compareAt ?? 0) * item.quantity;
  });

  return {
    items,
    count,
    total,
    compareAtTotal,
  };
};

export const mapBackendCartItemToCartItem = ({ variant: { product, ...v }, quantity }: BackendCartItem): CartItem => ({
  ...v,
  quantity,
  productId: product.id,
  productName: product.name,
});
