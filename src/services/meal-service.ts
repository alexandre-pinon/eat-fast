import type { NonEmptyMeal, UpdateMealPositionInput } from "@/entities/meal";

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
      const json = await res.json();
      console.error({ status: res.status, json });
    }
  } catch (error) {
    console.error(error);
  }
};
