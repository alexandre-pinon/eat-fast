import {
  DayOfTheWeekCard,
  type DayOfTheWeekCardProps,
} from "@/components/day-of-the-week-card";
import type { WithId } from "@/types";
import { ScrollShadow, Spacer } from "@nextui-org/react";

const data = [
  {
    id: "0000",
    day: "monday",
    meals: [
      {
        type: "breakfast",
        title: "Eggs & bacon",
        time: 10,
      },
      {
        type: "diner",
        title: "Fish soup",
        time: 30,
      },
    ],
  },
  {
    id: "0001",
    day: "tuesday",
    meals: [
      {
        type: "lunch",
        title: "Steak with fries",
        time: 15,
      },
      {
        type: "diner",
        title: "Pasta salad",
        time: 10,
      },
    ],
  },
  {
    id: "0002",
    day: "wednesday",
    meals: [
      {
        type: "breakfast",
        title: "Cereals",
        time: 0,
      },
      {
        type: "lunch",
        title: "Mustard chicken with rice",
        time: 45,
      },
      {
        type: "diner",
        title: "Chorizo and mushroom risotto",
        time: 40,
      },
    ],
  },
  {
    id: "0003",
    day: "thursday",
    meals: [
      {
        type: "breakfast",
        title: "Croissant",
        time: 0,
      },
      {
        type: "lunch",
        title: "Carbonara pasta",
        time: 25,
      },
      {
        type: "diner",
        title: "Homemade pizza",
        time: 30,
      },
    ],
  },
  {
    id: "0004",
    day: "friday",
    meals: [],
  },
  {
    id: "0005",
    day: "saturday",
    meals: [],
  },
  {
    id: "0006",
    day: "sunday",
    meals: [],
  },
] satisfies WithId<DayOfTheWeekCardProps>[];

export default function MealsOfTheWeekPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold leading-none">Meals of the week</h1>
      <Spacer y={16} />
      <ScrollShadow
        hideScrollBar
        className="flex gap-x-4 flex-nowrap overflow-x-scroll"
      >
        {data.map((d) => (
          <DayOfTheWeekCard key={d.id} day={d.day} meals={d.meals} />
        ))}
      </ScrollShadow>
    </div>
  );
}
