"use client";
import type { Meal, Nullable, WeekDay } from "@/types";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import { useState } from "react";
import { DayOfTheWeekCard, dispayDndItem } from "./day-of-the-week-card";
import { MealModal } from "./modal/meal-modal";

type LastSwap = {
  lastActiveWeekDay: WeekDay;
  lastActiveIndex: number;
  lastOverWeekDay: WeekDay;
  lastOverIndex: number;
};
type MealData = Record<WeekDay, (Meal | { id: string })[]>;

type MealsOfTheWeekProps = { data: MealData };
export const MealsOfTheWeek = ({ data }: MealsOfTheWeekProps) => {
  const [mealsOfTheWeek, setMealsOfTheWeek] = useState(data);
  const [activeMeal, setActiveMeal] = useState<Nullable<Meal>>(null);
  const [lastSwap, setLastSwap] = useState<Nullable<LastSwap>>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeMeal = Object.values(mealsOfTheWeek)
      .flat()
      .find((meal) => meal.id === event.active.id);

    if (!activeMeal) {
      console.warn({ event, mealsOfTheWeek }, "active meal not found?");
      return;
    }
    if (!(activeMeal as Meal).type) {
      console.warn({ activeMeal }, "active meal has no type");
      return;
    }

    setActiveMeal(activeMeal as Meal);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over || event.over.id === event.active.id) {
      console.log({ event }, "over item is undefined or same as active");
      return;
    }

    let newMealsOfTheWeek = structuredClone(mealsOfTheWeek);

    if (lastSwap) {
      const {
        lastActiveWeekDay,
        lastActiveIndex,
        lastOverWeekDay,
        lastOverIndex,
      } = lastSwap;

      const undoActiveMeals = [...mealsOfTheWeek[lastActiveWeekDay]];
      const undoOverMeals = [...mealsOfTheWeek[lastOverWeekDay]];
      undoActiveMeals[lastActiveIndex] =
        mealsOfTheWeek[lastOverWeekDay][lastOverIndex];
      undoOverMeals[lastOverIndex] =
        mealsOfTheWeek[lastActiveWeekDay][lastActiveIndex];

      newMealsOfTheWeek = {
        ...newMealsOfTheWeek,
        [lastActiveWeekDay]: undoActiveMeals,
        [lastOverWeekDay]: undoOverMeals,
      };
    }

    const activeId = event.active.id.toString();
    const overId = event.over.id.toString();

    const activeWeekDay = findWeekDay(newMealsOfTheWeek, activeId);
    const overWeekDay = findWeekDay(newMealsOfTheWeek, overId);

    if (!activeWeekDay || !overWeekDay) {
      console.warn(
        { event, activeWeekDay, overWeekDay, mealsOfTheWeek, activeId, overId },
        "active/over week day not found?",
      );
      return;
    }
    if (activeWeekDay === overWeekDay) {
      console.log("will be handled by drag end");
      return;
    }

    setMealsOfTheWeek((prevMeals) => {
      const activeMeals = newMealsOfTheWeek[activeWeekDay];
      const overMeals = newMealsOfTheWeek[overWeekDay];

      const activeIndex = activeMeals.findIndex((meal) => meal.id === activeId);
      const overIndex = overMeals.findIndex((meal) => meal.id === overId);

      if (activeIndex === -1 || overIndex === -1) {
        console.log(
          { prevMeals, activeMeals, overMeals, activeId, overId },
          "activeIndex/overIndex not found?",
        );
        return prevMeals;
      }

      const newActiveMeals = [...activeMeals];
      const newOverMeals = [...overMeals];
      newActiveMeals[activeIndex] = overMeals[overIndex];
      newOverMeals[overIndex] = activeMeals[activeIndex];

      newMealsOfTheWeek = {
        ...newMealsOfTheWeek,
        [activeWeekDay]: newActiveMeals,
        [overWeekDay]: newOverMeals,
      };

      // Save the last swap
      setLastSwap({
        lastActiveWeekDay: activeWeekDay,
        lastActiveIndex: activeIndex,
        lastOverWeekDay: overWeekDay,
        lastOverIndex: overIndex,
      });

      return newMealsOfTheWeek;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setLastSwap(null); // Reset the last swap

    if (!event.over || event.over.id === event.active.id) {
      console.log({ event }, "over item is undefined or same as active");
      return;
    }
    const activeId = event.active.id.toString();
    const overId = event.over.id.toString();

    const activeWeekDay = findWeekDay(mealsOfTheWeek, activeId);
    const overWeekDay = findWeekDay(mealsOfTheWeek, overId);

    if (!activeWeekDay || !overWeekDay) {
      console.warn(
        { event, activeWeekDay, overWeekDay },
        "active/over week day not found?",
      );
      return;
    }
    if (activeWeekDay !== overWeekDay) {
      console.log("will be handled by drag over");
      return;
    }

    setMealsOfTheWeek((prevMeals) => {
      const activeMeals = prevMeals[activeWeekDay];
      const overMeals = prevMeals[overWeekDay];

      const activeIndex = activeMeals.findIndex((meal) => meal.id === activeId);
      const overIndex = overMeals.findIndex((meal) => meal.id === overId);

      if (activeIndex === -1 || overIndex === -1) {
        console.log(
          { prevMeals, activeMeals, overMeals, activeId, overId },
          "activeIndex/overIndex not found?",
        );
        return prevMeals;
      }

      return {
        ...prevMeals,
        [activeWeekDay]: arraySwap(activeMeals, activeIndex, overIndex),
      };
    });
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        {Object.entries(mealsOfTheWeek).map(([day, meals]) => (
          <DayOfTheWeekCard key={day} day={day} meals={meals} />
        ))}
        <DragOverlay>
          {activeMeal
            ? dispayDndItem(activeMeal, activeMeal.type, {
                isDragOverlay: true,
              })
            : null}
        </DragOverlay>
      </DndContext>
      <MealModal />
    </>
  );
};

const findWeekDay = (meals: MealData, mealId: string): Nullable<WeekDay> => {
  const [weekDay] = Object.entries(meals).find(([_weekDay, meals]) =>
    meals.map((meal) => meal.id).includes(mealId),
  ) ?? [null, []];

  return weekDay as Nullable<WeekDay>;
};
