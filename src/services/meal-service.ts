import type {
  Meal,
  NonEmptyMeal,
  UpdateMealPositionInput,
} from "@/entities/meal";

type MealSearchParams = {
  archived?: string;
};
export const getMeals = async (params?: MealSearchParams): Promise<Meal[]> => {
  try {
    const url = new URL("/api/meals", window.location.origin);
    const search = new URLSearchParams(params);
    url.search = search.toString();

    const res = await fetch(url);
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

export const updateMealPosition = async (meal: NonEmptyMeal): Promise<void> => {
  const body = {
    type: meal.type,
    weekDay: meal.weekDay,
  } satisfies UpdateMealPositionInput;

  try {
    const res = await fetch(`/api/meals/${meal.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error({ status: res.status, statusText: res.statusText });
    }
  } catch (error) {
    console.error(error);
  }
};
