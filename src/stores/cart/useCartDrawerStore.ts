import { create } from 'zustand';

interface CartDrawerStore {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
}

export const useCartDrawerStore = create<CartDrawerStore>((set) => ({
  open: false,
  onOpenChange: (open) => set({ open }),
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
