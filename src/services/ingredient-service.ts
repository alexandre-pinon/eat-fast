import type { Ingredient, MealIngredient } from "@/entities/ingredient";

export const fetchUserIngredients = async (
  _userId: string,
): Promise<Ingredient[]> => {
  try {
    const res = await fetch("/api/ingredients");
    const json = await res.json();
    if (!res.ok) {
      console.error({ status: res.status, statusText: res.statusText, json });
      return [];
    }
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchUserMealIngredients = async (
  mealId: string,
): Promise<MealIngredient[]> => {
  try {
    const res = await fetch(`/api/meals/${mealId}/ingredients`);
    const json = await res.json();
    if (!res.ok) {
      console.error({ status: res.status, statusText: res.statusText, json });
      return [];
    }
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
};
