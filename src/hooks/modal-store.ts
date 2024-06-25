import type { ModalState, PartialMeal } from "@/types";
import { v4 as uuid } from "uuid";
import { create } from "zustand";

type ModalStore = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalState: ModalState;
  setModalState: (state: ModalState) => void;
  activeMeal: PartialMeal;
  setActiveMeal: (meal: PartialMeal) => void;
  prevModalState?: ModalState;
  setPrevModalState: (state: ModalState) => void;
  isBackLinkVisible: boolean;
  showBackLink: () => void;
  hideBackLink: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  modalState: "meal",
  setModalState: (state) => set({ modalState: state }),
  activeMeal: {
    id: uuid(),
    type: "lunch",
  },
  setActiveMeal: (meal) => set({ activeMeal: meal }),
  prevModalState: undefined,
  setPrevModalState: (state) => set({ prevModalState: state }),
  isBackLinkVisible: false,
  showBackLink: () => set({ isBackLinkVisible: true }),
  hideBackLink: () => set({ isBackLinkVisible: false }),
}));
