import type { Ingredient } from "@/entities/ingredient";

export const fetchMealIngredients = async (
  mealId: string,
): Promise<Ingredient[]> => {
  try {
    const res = await fetch(`/api/meals/${mealId}/ingredients`);
    const json = await res.json();
    if (!res.ok) {
      console.error({ status: res.status, json });
      return [];
    }
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
};
