import { mealType, weekDay } from "@/db/schema";
import type { WeekDay } from "@/types/weekday";
import { parseEntity } from "@/valibot";
import * as v from "valibot";

export const MealSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid()),
  name: v.pipe(v.string(), v.nonEmpty()),
  type: v.picklist(mealType.enumValues),
  weekDay: v.picklist(weekDay.enumValues),
  time: v.number(),
  image: v.nullable(v.string()),
  recipe: v.nullable(v.string()),
});
export type Meal = v.InferOutput<typeof MealSchema>;

export type EmptyMeal = Pick<Meal, "id" | "type"> & { empty: true };
export type NonEmptyMeal = Meal & { empty: false };
export type WeekMeal = EmptyMeal | NonEmptyMeal;

export type WeekMealData = Record<WeekDay, WeekMeal[]>;

export const parseMeal = parseEntity(MealSchema);
