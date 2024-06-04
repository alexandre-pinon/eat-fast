export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type MealType = "breakfast" | "lunch" | "diner";

export type WithId<T> = T & { id: string };
