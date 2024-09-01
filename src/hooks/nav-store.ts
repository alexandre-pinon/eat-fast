import { create } from "zustand";

type NavStore = {
  isMinimized: boolean;
  toggleMinimized: () => void;
};

export const useNavStore = create<NavStore>(set => {
  return {
    isMinimized: false,
    toggleMinimized: () => set(state => ({ isMinimized: !state.isMinimized })),
  };
});
