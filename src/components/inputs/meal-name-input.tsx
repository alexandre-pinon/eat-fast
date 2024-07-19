import type { WeekMeal } from "@/entities/meal";
import { type MealModalMode, isNormal } from "@/types/meal-modal-state";
import { Input, Skeleton } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

type MealNameInputProps = {
  mode: MealModalMode;
  activeMeal: WeekMeal;
};
export const MealNameInput = ({ mode, activeMeal }: MealNameInputProps) => {
  const { pending } = useFormStatus();

  return (
    <Skeleton isLoaded={!pending} className="rounded-2xl">
      {isNormal(mode) ? (
        <p className="text-xl font-semibold">
          {activeMeal.empty ? `New ${activeMeal.type}` : activeMeal.name}
          {activeMeal.isLeftover ? " (leftover)" : ""}
        </p>
      ) : (
        <Input
          color="default"
          variant="flat"
          type="text"
          name="name"
          defaultValue={activeMeal.empty ? "" : activeMeal.name}
          placeholder="Meal name"
          size="lg"
          startContent={
            activeMeal.isLeftover ? (
              <span className="opacity-75">(leftover)</span>
            ) : (
              <></>
            )
          }
        />
      )}
    </Skeleton>
  );
};
