import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

const computeDerived = (items: CartItem[]) => ({
  count: items.reduce((sum, item) => sum + item.quantity, 0),
  total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  compareAtTotal: items.reduce((sum, item) => sum + (item.compareAt ?? 0) * item.quantity, 0),
});

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...defaultState,
      setItems: (items) => set({ items, ...computeDerived(items) }),
      setItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.externalId === item.externalId);
          const items = exists
            ? state.items.map((i) => (i.externalId === item.externalId ? item : i))
            : [...state.items, item];
          return { items, ...computeDerived(items) };
        }),
      updateItem: (externalId, update) =>
        set((state) => {
          const items = state.items.map((i) =>
            i.externalId === externalId ? { ...i, ...update, quantity: update.quantity ?? i.quantity } : i,
          );
          return { items, ...computeDerived(items) };
        }),
      removeItem: (externalId) =>
        set((state) => {
          const items = state.items.filter((i) => i.externalId !== externalId);
          return { items, ...computeDerived(items) };
        }),
      clearCart: () => set(defaultState),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items }) => ({ items }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const derived = computeDerived(state.items);
        state.count = derived.count;
        state.compareAtTotal = derived.compareAtTotal;
        state.total = derived.total;
      },
    },
  ),
);
