export const modalStates = ["meal", "history", "menu"] as const;
export type ModalState = (typeof modalStates)[number];

export const isHistory = (state?: ModalState) => state === "history";
