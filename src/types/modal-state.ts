export const modalStates = ["meal", "history", "menu", "leftover"] as const;
export type ModalState = (typeof modalStates)[number];

export const isHistory = (state?: ModalState) => state === "history";
export const isLeftover = (state?: ModalState) => state === "leftover";
