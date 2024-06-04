import type { WeekDay } from "@/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { AddMealButton } from "./add-meal-button";
import { MealCard, type MealCardProps } from "./meal-card";

export type DayOfTheWeekCardProps = {
  day: WeekDay;
  meals: MealCardProps[];
};
export const DayOfTheWeekCard = ({ day, meals }: DayOfTheWeekCardProps) => {
  const breakfast = meals.find(({ type }) => type === "breakfast");
  const lunch = meals.find(({ type }) => type === "lunch");
  const diner = meals.find(({ type }) => type === "diner");

  return (
    <Card
      shadow="none"
      className="flex-shrink-0 w-full max-w-xs bg-primary-100 px-4"
    >
      <CardHeader className="justify-center">
        <span className="font-medium text-lg capitalize">{day}</span>
      </CardHeader>
      <CardBody className="grid grid-rows-3 gap-y-4">
        <div className="flex flex-col gap-y-2">
          <span>Breakfast</span>
          {breakfast ? <MealCard {...breakfast} /> : <AddMealButton />}
        </div>
        <div className="flex flex-col gap-y-2">
          <span>Lunch</span>
          {lunch ? <MealCard {...lunch} /> : <AddMealButton />}
        </div>
        <div className="flex flex-col gap-y-2">
          <span>Diner</span>
          {diner ? <MealCard {...diner} /> : <AddMealButton />}
        </div>
      </CardBody>
    </Card>
  );
};
