export type MealType = "breakfast" | "lunch" | "diner";
export type OldMeal = {
  id: string;
  title: string;
  time: number;
  type: MealType;
  image?: string;
};
export type PartialMeal = RequiredBy<PartialEntity<OldMeal>, "type">;

export const units = ["g", "kg", "ml", "cl", "l", "tsp", "tbsp"] as const;
export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit?: (typeof units)[number];
};
export type ModalState = "meal" | "history" | "menu";

export type OrId<T> = T | { id: string };
export type Nullable<T> = T | null;
type PartialEntity<T> = Partial<T> & { id: string };
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };
