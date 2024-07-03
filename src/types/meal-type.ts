export const mealTypes = ["breakfast", "lunch", "diner"] as const;
export type MealType = (typeof mealTypes)[number];
