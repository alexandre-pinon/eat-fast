export type MealModalMode = "normal" | "edit" | "add";

export const isEdit = (mode: MealModalMode) => mode === "edit";
export const isNormal = (mode: MealModalMode) => mode === "normal";
export const isAdd = (mode: MealModalMode) => mode === "add";
