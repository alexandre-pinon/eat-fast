import type { WeekMeal } from "@/entities/meal";
import { type MealModalMode, isNormal } from "@/types/meal-modal-state";
import { Skeleton, Textarea } from "@nextui-org/react";
import { useMemo } from "react";
import { useFormStatus } from "react-dom";

type MealInstructionsInputProps = {
  mode: MealModalMode;
  activeMeal: WeekMeal;
};
export const MealInstructionsInput = ({
  mode,
  activeMeal,
}: MealInstructionsInputProps) => {
  const { pending } = useFormStatus();

  const mealRecipe = useMemo(
    () => (activeMeal.empty || !activeMeal.recipe ? "" : activeMeal.recipe),
    [activeMeal],
  );

  return (
    <Skeleton isLoaded={!pending} className="rounded-2xl">
      {isNormal(mode) ? (
        mealRecipe.length > 0 ? (
          <ul className="list-disc list-inside space-y-4">
            {mealRecipe.split("\n").map(instruction => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
        ) : (
          <span className="italic opacity-50">No instructions added</span>
        )
      ) : (
        <Textarea type="text" name="recipe" defaultValue={mealRecipe} />
      )}
    </Skeleton>
  );
};
