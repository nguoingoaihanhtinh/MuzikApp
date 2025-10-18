import { create } from "zustand";
import type { Song } from "@/types/global";

interface QueueState {
  current?: Song | null;
  upcoming: Song[];
  setQueue: (current: Song | null | undefined, upcoming: Song[]) => void;
  addUpcoming: (song: Song) => void;
  clear: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  current: null,
  upcoming: [],
  setQueue: (current, upcoming) => set({ current: current ?? null, upcoming }),
  addUpcoming: (song) => set((s) => ({ upcoming: [...s.upcoming, song] })),
  clear: () => set({ current: null, upcoming: [] }),
}));
