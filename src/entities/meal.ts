import { mealTypes } from "@/types/meal-type";
import { type WeekDay, weekDays } from "@/types/weekday";
import {
  NonEmptyStringSchema,
  UUIDSchema,
  parseEntity,
  parseEntityAsync,
} from "@/valibot";
import * as v from "valibot";
import type { CreateIngredientInput } from "./ingredient";

export const MealSchema = v.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  name: NonEmptyStringSchema,
  type: v.picklist(mealTypes),
  weekDay: v.picklist(weekDays),
  time: v.number(),
  image: v.nullable(v.string()),
  recipe: v.nullable(v.string()),
});
export type Meal = v.InferOutput<typeof MealSchema>;

export const CreateMealSchema = v.object({
  ...MealSchema.entries,
  name: v.pipe(
    v.string("Meal name must be a string"),
    v.nonEmpty("Meal name is required"),
  ),
  time: v.pipe(
    v.string(),
    v.transform(Number),
    v.number("Time is not a valid number"),
  ),
  recipe: v.pipe(
    v.string(),
    v.transform(recipe => (recipe.length === 0 ? null : recipe)),
  ),
});
export type CreateMealInput = v.InferOutput<typeof CreateMealSchema>;
export type CreateMealWithIngredientsInput = {
  meal: CreateMealInput;
  ingredients: CreateIngredientInput[];
};

export type EmptyMeal = Pick<Meal, "id" | "type" | "weekDay"> & { empty: true };
export type NonEmptyMeal = Meal & { empty: false };
export type WeekMeal = EmptyMeal | NonEmptyMeal;

export type WeekMealData = Record<WeekDay, WeekMeal[]>;

export const parseMealAsync = parseEntityAsync(MealSchema);
export const parseCreateMealInput = parseEntity(CreateMealSchema);
