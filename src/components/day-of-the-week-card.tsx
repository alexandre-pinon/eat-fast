import type { Meal, MealType, OrId } from "@/types";
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { P, match } from "ts-pattern";
import { AddMealButton } from "./add-meal-button";
import { DroppableItem } from "./droppable-item";
import { MealCard } from "./meal-card";
import { SortableItem } from "./sortable-item";

export type DayOfTheWeekCardProps = {
  day: string;
  meals: OrId<Meal>[];
};
export const DayOfTheWeekCard = ({ day, meals }: DayOfTheWeekCardProps) => {
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
        <CardBody className="grid grid-rows-3 gap-y-4">
          <div className="flex flex-col gap-y-2">
            <span>Breakfast</span>
            {dispayDndItem(breakfast, "breakfast")}
          </div>
          <div className="flex flex-col gap-y-2">
            <span>Lunch</span>
            {dispayDndItem(lunch, "lunch")}
          </div>
          <div className="flex flex-col gap-y-2">
            <span>Diner</span>
            {dispayDndItem(diner, "diner")}
          </div>
        </CardBody>
      </Card>
    </SortableContext>
  );
};

export const dispayDndItem = (
  mealOrId: OrId<Meal>,
  type: MealType,
  opts?: { isDragOverlay?: boolean },
) =>
  match(mealOrId)
    .with({ type: P.nonNullable }, (meal) => (
      <SortableItem meal={meal}>
        <MealCard
          type={type}
          title={meal.title}
          time={meal.time}
          image={meal.image}
          isDragOverlay={opts?.isDragOverlay}
        />
      </SortableItem>
    ))
    .otherwise(({ id }) => (
      <DroppableItem
        className="flex-grow flex justify-center items-center"
        id={id}
      >
        <AddMealButton id={id} type={type} />
      </DroppableItem>
    ));
