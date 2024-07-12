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
      console.error({ status: res.status, statusText: res.statusText });
    }
  } catch (error) {
    console.error(error);
  }
};
