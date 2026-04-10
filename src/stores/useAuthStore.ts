import { create } from 'zustand';

import { BasicUser } from '@/api';

interface AuthStoreState {
  isLoggedIn: boolean;
  user: BasicUser | null;
}

interface AuthStoreActions {
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: BasicUser | null) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

const defaultState: AuthStoreState = {
  isLoggedIn: false,
  user: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...defaultState,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setUser: (user) => set({ user }),
  clearAuth: () => set(defaultState),
}));
