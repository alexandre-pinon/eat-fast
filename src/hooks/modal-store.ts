import type { ModalState, PartialMeal } from "@/types";
import { v4 as uuid } from "uuid";
import { create } from "zustand";

type ModalStore = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalState: ModalState;
  setModalState: (newState: ModalState) => void;
  activeMeal: PartialMeal;
  setActiveMeal: (newActiveMeal: PartialMeal) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  modalState: "meal",
  setModalState: (newState) => set({ modalState: newState }),
  activeMeal: {
    id: uuid(),
    type: "lunch",
  },
  setActiveMeal: (newActiveMeal) => set({ activeMeal: newActiveMeal }),
}));
