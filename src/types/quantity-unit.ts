export const quantityUnits = [
  "g",
  "kg",
  "ml",
  "cl",
  "l",
  "tsp",
  "tbsp",
] as const;
export type QuantityUnit = (typeof quantityUnits)[number];
