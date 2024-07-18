import type { EmptyMeal, WeekMeal } from "@/entities/meal";
import type { UserPreferences } from "@/entities/user";
import type { ModalState } from "@/types/modal-state";
import { v4 as uuid } from "uuid";
import { create } from "zustand";

type ModalStore = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalState: ModalState;
  setModalState: (state: ModalState) => void;
  activeMeal: WeekMeal;
  setActiveMeal: (meal: WeekMeal) => void;
  lastEmptyMeal: EmptyMeal;
  setLastEmptyMeal: (emptyMeal: EmptyMeal) => void;
  prevModalState?: ModalState;
  setPrevModalState: (state: ModalState) => void;
  isBackLinkVisible: boolean;
  showBackLink: () => void;
  hideBackLink: () => void;
  preferences?: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
};

export const useModalStore = create<ModalStore>(set => {
  const baseMeal = {
    id: uuid(),
    empty: true,
    type: "lunch",
    weekDay: "monday",
  } satisfies EmptyMeal;

  return {
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    modalState: "meal",
    setModalState: state => set({ modalState: state }),
    activeMeal: baseMeal,
    setActiveMeal: meal => set({ activeMeal: meal }),
    lastEmptyMeal: baseMeal,
    setLastEmptyMeal: (emptyMeal: EmptyMeal) =>
      set({ lastEmptyMeal: emptyMeal }),
    prevModalState: undefined,
    setPrevModalState: state => set({ prevModalState: state }),
    isBackLinkVisible: false,
    showBackLink: () => set({ isBackLinkVisible: true }),
    hideBackLink: () => set({ isBackLinkVisible: false }),
    preferences: undefined,
    setPreferences: (preferences: UserPreferences) => set({ preferences }),
  };
});
