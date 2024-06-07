import { randomUUID } from "node:crypto";
import { MealsOfTheWeek } from "@/components/meals-of-the-week";
import type { Meal, WeekDay } from "@/types";
import { ScrollShadow, Spacer } from "@nextui-org/react";

const data = {
  monday: [
    {
      id: randomUUID(),
      type: "breakfast",
      title: "Eggs & bacon",
      time: 10,
    },
    { id: randomUUID() },
    {
      id: randomUUID(),
      type: "diner",
      title: "Fish soup",
      time: 30,
    },
  ],
  tuesday: [
    { id: randomUUID() },
    {
      id: randomUUID(),
      type: "lunch",
      title: "Steak with fries",
      time: 15,
    },
    {
      id: randomUUID(),
      type: "diner",
      title: "Pasta salad",
      time: 10,
    },
  ],
  wednesday: [
    {
      id: randomUUID(),
      type: "breakfast",
      title: "Cereals",
      time: 0,
    },
    {
      id: randomUUID(),
      type: "lunch",
      title: "Mustard chicken with rice",
      time: 45,
    },
    {
      id: randomUUID(),
      type: "diner",
      title: "Chorizo and mushroom risotto",
      time: 40,
    },
  ],
  thursday: [
    {
      id: randomUUID(),
      type: "breakfast",
      title: "Croissant",
      time: 0,
    },
    {
      id: randomUUID(),
      type: "lunch",
      title: "Carbonara pasta",
      time: 25,
    },
    {
      id: randomUUID(),
      type: "diner",
      title: "Homemade pizza",
      time: 30,
    },
  ],
  friday: [{ id: randomUUID() }, { id: randomUUID() }, { id: randomUUID() }],
  saturday: [{ id: randomUUID() }, { id: randomUUID() }, { id: randomUUID() }],
  sunday: [{ id: randomUUID() }, { id: randomUUID() }, { id: randomUUID() }],
} satisfies Record<WeekDay, (Meal | { id: string })[]>;

export default function MealsOfTheWeekPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold leading-none">Meals of the week</h1>
      <Spacer y={16} />
      <ScrollShadow
        hideScrollBar
        className="flex gap-x-4 flex-nowrap overflow-x-scroll"
      >
        <MealsOfTheWeek data={data} />
      </ScrollShadow>
    </div>
  );
}
