import type { WeekMeal } from "@/entities/meal";
import { type MealModalMode, isNormal } from "@/types/meal-modal-state";
import { Input, Skeleton } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

type MealTimeInputProps = {
  mode: MealModalMode;
  activeMeal: WeekMeal;
};
export const MealTimeInput = ({ mode, activeMeal }: MealTimeInputProps) => {
  const { pending } = useFormStatus();

  return (
    <Skeleton isLoaded={!pending} className="rounded-lg">
      {isNormal(mode) ? (
        <div>
          <span className="font-medium">Total time : </span>
          <span>{activeMeal.empty ? 0 : activeMeal.time}min</span>
        </div>
      ) : (
        <Input
          color="default"
          variant="flat"
          label="Total time"
          labelPlacement="outside-left"
          endContent={<span className="text-small">min</span>}
          defaultValue={activeMeal.empty ? "0" : activeMeal.time.toFixed()}
          type="number"
          name="time"
          classNames={{
            mainWrapper: "max-w-24",
            label: "font-medium",
          }}
        />
      )}
    </Skeleton>
  );
};
