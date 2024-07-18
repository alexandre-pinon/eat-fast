"use client";
import type { NonEmptyMeal, WeekMeal, WeekMealData } from "@/entities/meal";
import type { UserPreferences } from "@/entities/user";
import { useModalStore } from "@/hooks/modal-store";
import { updateMealPosition } from "@/services/meal-service";
import type { Nullable } from "@/types";
import type { WeekDay } from "@/types/weekday";
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
import { useEffect, useState } from "react";
import { DayOfTheWeekCard, dispayDndItem } from "./day-of-the-week-card";
import { MealModal } from "./modal/meal-modal";

type LastSwap = {
  lastActiveWeekDay: WeekDay;
  lastActiveIndex: number;
  lastOverWeekDay: WeekDay;
  lastOverIndex: number;
};

type MealsOfTheWeekProps = { data: WeekMealData; preferences: UserPreferences };
export const MealsOfTheWeek = ({ data, preferences }: MealsOfTheWeekProps) => {
  const { setPreferences } = useModalStore();
  const [mealsOfTheWeek, setMealsOfTheWeek] = useState(data);
  const [draggedMeal, setDraggedMeal] = useState<Nullable<NonEmptyMeal>>(null);
  const [lastSwap, setLastSwap] = useState<Nullable<LastSwap>>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  useEffect(() => {
    setMealsOfTheWeek(data);
  }, [data]);

  useEffect(() => {
    setPreferences(preferences);
  }, [preferences]);

  const handleDragStart = (event: DragStartEvent) => {
    const activeMeal = Object.values(mealsOfTheWeek)
      .flat()
      .find(meal => meal.id === event.active.id);

    if (!activeMeal || activeMeal?.empty) {
      console.warn({ event, mealsOfTheWeek }, "active meal not found?");
      return;
    }

    setDraggedMeal(activeMeal);
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

      swapMealTypes(
        undoActiveMeals[lastActiveIndex],
        undoOverMeals[lastOverIndex],
      );
      swapMealWeekDays(
        undoActiveMeals[lastActiveIndex],
        undoOverMeals[lastOverIndex],
      );

      // undo swap
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

    const activeMeals = newMealsOfTheWeek[activeWeekDay];
    const overMeals = newMealsOfTheWeek[overWeekDay];
    const activeIndex = activeMeals.findIndex(meal => meal.id === activeId);
    const overIndex = overMeals.findIndex(meal => meal.id === overId);

    if (activeIndex === -1 || overIndex === -1) {
      console.log(
        { mealsOfTheWeek, activeMeals, overMeals, activeId, overId },
        "activeIndex/overIndex not found?",
      );
      return;
    }

    swapMealTypes(activeMeals[activeIndex], overMeals[overIndex]);
    swapMealWeekDays(activeMeals[activeIndex], overMeals[overIndex]);

    // meal swap
    const newActiveMeals = [...activeMeals];
    const newOverMeals = [...overMeals];
    newActiveMeals[activeIndex] = overMeals[overIndex];
    newOverMeals[overIndex] = activeMeals[activeIndex];

    newMealsOfTheWeek = {
      ...newMealsOfTheWeek,
      [activeWeekDay]: newActiveMeals,
      [overWeekDay]: newOverMeals,
    };

    setMealsOfTheWeek(newMealsOfTheWeek);
    setLastSwap({
      lastActiveWeekDay: activeWeekDay,
      lastActiveIndex: activeIndex,
      lastOverWeekDay: overWeekDay,
      lastOverIndex: overIndex,
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setLastSwap(null); // Reset the last swap

    if (!event.over || event.over.id === event.active.id) {
      console.log({ event }, "over item is undefined or same as active");
      if (lastSwap) {
        const {
          lastActiveWeekDay,
          lastActiveIndex,
          lastOverWeekDay,
          lastOverIndex,
        } = lastSwap;

        const activeMeal = mealsOfTheWeek[lastActiveWeekDay][lastActiveIndex];
        const overMeal = mealsOfTheWeek[lastOverWeekDay][lastOverIndex];

        await updateMealPositions(activeMeal, overMeal);
      }
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

    const activeMeals = mealsOfTheWeek[activeWeekDay];
    const activeIndex = activeMeals.findIndex(meal => meal.id === activeId);
    const overIndex = activeMeals.findIndex(meal => meal.id === overId);
    if (activeIndex === -1 || overIndex === -1) {
      console.log(
        { mealsOfTheWeek, activeMeals, activeId, overId },
        "activeIndex/overIndex not found?",
      );
      return;
    }

    swapMealTypes(activeMeals[activeIndex], activeMeals[overIndex]);

    setMealsOfTheWeek({
      ...mealsOfTheWeek,
      [activeWeekDay]: arraySwap(activeMeals, activeIndex, overIndex),
    });

    await updateMealPositions(activeMeals[activeIndex], activeMeals[overIndex]);
  };

  const updateMealPositions = async (
    activeMeal: WeekMeal,
    overMeal: WeekMeal,
  ): Promise<void> => {
    [activeMeal, overMeal].map(async meal => {
      if (!meal.empty) {
        await updateMealPosition(meal);
      }
    });
  };

  return (
    <>
      <DndContext
        id={"dnd-context-meals"}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        {Object.entries(mealsOfTheWeek).map(([day, meals]) => (
          <DayOfTheWeekCard key={day} day={day as WeekDay} meals={meals} />
        ))}
        <DragOverlay>
          {draggedMeal
            ? dispayDndItem(draggedMeal, { isDragOverlay: true })
            : null}
        </DragOverlay>
      </DndContext>
      <MealModal />
    </>
  );
};

const findWeekDay = (
  meals: WeekMealData,
  mealId: string,
): Nullable<WeekDay> => {
  const [weekDay] = Object.entries(meals).find(([_weekDay, meals]) =>
    meals.map(meal => meal.id).includes(mealId),
  ) ?? [null, []];

  return weekDay as Nullable<WeekDay>;
};

//WARNING: this function has side effects
const swapMealTypes = (meal1: WeekMeal, meal2: WeekMeal): void => {
  const mealType1 = meal1.type;
  const mealType2 = meal2.type;
  meal1.type = mealType2;
  meal2.type = mealType1;
};
//WARNING: this function has side effects
const swapMealWeekDays = (meal1: WeekMeal, meal2: WeekMeal): void => {
  const mealWeekDay1 = meal1.weekDay;
  const mealWeekDay2 = meal2.weekDay;
  meal1.weekDay = mealWeekDay2;
  meal2.weekDay = mealWeekDay1;
};
