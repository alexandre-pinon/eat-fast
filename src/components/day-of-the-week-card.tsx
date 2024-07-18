import type { WeekMeal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import type { WeekDay } from "@/types/weekday";
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { match } from "ts-pattern";
import { AddMealButton } from "./add-meal-button";
import { DroppableItem } from "./droppable-item";
import { MealCard } from "./meal-card";
import { SortableItem } from "./sortable-item";

export type DayOfTheWeekCardProps = {
  day: WeekDay;
  meals: WeekMeal[];
};
export const DayOfTheWeekCard = ({ day, meals }: DayOfTheWeekCardProps) => {
  const { preferences } = useModalStore();
  const [breakfast, lunch, diner] = meals;

  return (
    <SortableContext items={meals} strategy={rectSwappingStrategy}>
      <Card
        shadow="none"
        className="flex-shrink-0 w-full max-w-60 bg-primary-100 px-2"
      >
        <CardHeader className="justify-center">
          <span className="font-medium text-lg capitalize">{day}</span>
        </CardHeader>
        <CardBody
          className={`grid gap-y-4 ${preferences?.displayBreakfast ? "grid-rows-3" : "grid-rows-2"}`}
        >
          {preferences?.displayBreakfast ? (
            <div className="flex flex-col gap-y-2">
              <span>Breakfast</span>
              {dispayDndItem(breakfast)}
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-y-2">
            <span>Lunch</span>
            {dispayDndItem(lunch)}
          </div>
          <div className="flex flex-col gap-y-2">
            <span>Diner</span>
            {dispayDndItem(diner)}
          </div>
        </CardBody>
      </Card>
    </SortableContext>
  );
};

export const dispayDndItem = (
  meal: WeekMeal,
  opts?: { isDragOverlay?: boolean },
) =>
  match(meal)
    .with({ empty: false }, nonEmptyMeal => (
      <SortableItem meal={nonEmptyMeal}>
        <MealCard meal={nonEmptyMeal} isDragOverlay={opts?.isDragOverlay} />
      </SortableItem>
    ))
    .with({ empty: true }, emptyMeal => (
      <DroppableItem
        className="flex-grow flex justify-center items-center"
        id={emptyMeal.id}
      >
        <AddMealButton meal={emptyMeal} />
      </DroppableItem>
    ))
    .exhaustive();
