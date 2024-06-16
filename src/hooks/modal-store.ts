import type { Meal, ModalState, Nullable } from "@/types";
import { create } from "zustand";

type ModalStore = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalState: ModalState;
  setModalState: (newState: ModalState) => void;
  activeMeal: Nullable<Meal>;
  setActiveMeal: (newActiveMeal: Nullable<Meal>) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  modalState: "meal",
  setModalState: (newState) => set({ modalState: newState }),
  activeMeal: null,
  setActiveMeal: (newActiveMeal) => set({ activeMeal: newActiveMeal }),
}));
