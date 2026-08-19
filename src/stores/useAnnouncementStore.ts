import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isClient } from '@/helpers';

const DEFAULT_INTERVAL_MS = 6;

interface AnnouncementStoreState {
  lastShownAt: number | null;
}

interface AnnouncementStoreActions {
  markAsShown: () => void;
  shouldShow: (interval?: number) => boolean;
}

type AnnouncementStore = AnnouncementStoreState & AnnouncementStoreActions;

const defaultState: AnnouncementStoreState = {
  lastShownAt: null,
};

export const useAnnouncementStore = create<AnnouncementStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      markAsShown: () => set({ lastShownAt: Date.now() }),
      shouldShow: (interval = DEFAULT_INTERVAL_MS) => {
        const { lastShownAt } = get();

        if (!lastShownAt) return true;

        return Date.now() - lastShownAt >= interval * 60 * 60 * 1000;
      },
    }),
    {
      name: 'announcement',
      storage: isClient() ? createJSONStorage(() => localStorage) : undefined,
    },
  ),
);
