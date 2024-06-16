export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type MealType = "breakfast" | "lunch" | "diner";
export type Meal = {
  id: string;
  title: string;
  time: number;
  type: MealType;
  image?: string;
};
export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit?: "g" | "kg" | "ml" | "cl" | "l" | "tsp" | "tbsp";
};
export type ModalState = "meal" | "history" | "menu";

export type OrId<T> = T | { id: string };
export type Nullable<T> = T | null;
