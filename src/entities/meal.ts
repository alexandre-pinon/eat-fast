import { mealTypes } from "@/types/meal-type";
import { type WeekDay, weekDays } from "@/types/weekday";
import {
  NonEmptyStringSchema,
  StringToNumberSchema,
  UUIDSchema,
  parseEntity,
  parseEntityAsync,
} from "@/valibot";
import * as v from "valibot";
import type { CreateIngredientInput, MealIngredient } from "./ingredient";

const MealSchema = v.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  name: NonEmptyStringSchema,
  type: v.picklist(mealTypes),
  weekDay: v.picklist(weekDays),
  time: v.number(),
  image: v.nullable(v.string()),
  recipe: v.nullable(v.string()),
  isLeftover: v.boolean(),
  servings: v.number(),
});

const CreateMealSchema = v.object({
  ...MealSchema.entries,
  name: v.pipe(
    v.string("Meal name must be a string"),
    v.nonEmpty("Meal name is required"),
  ),
  time: StringToNumberSchema("time"),
  recipe: v.pipe(
    v.string(),
    v.transform(recipe => (recipe.length === 0 ? null : recipe)),
  ),
});

const UpdateMealPositionSchema = v.object({
  type: v.picklist(mealTypes),
  weekDay: v.picklist(weekDays),
});

export type Meal = v.InferOutput<typeof MealSchema>;
export type CreateMealInput = v.InferOutput<typeof CreateMealSchema>;
export type UpdateMealPositionInput = v.InferOutput<
  typeof UpdateMealPositionSchema
>;

export type EmptyMeal = Pick<
  Meal,
  "id" | "type" | "weekDay" | "isLeftover" | "servings"
> & {
  empty: true;
};
export type NonEmptyMeal = Meal & { empty: false };
export type WeekMeal = EmptyMeal | NonEmptyMeal;
export type WeekMealData = Record<WeekDay, WeekMeal[]>;
export type WeekMealIngredient = Record<WeekDay, MealIngredient[]>;

export type CreateMealWithIngredientsInput = {
  meal: CreateMealInput;
  ingredients: CreateIngredientInput[];
};

export const parseMealAsync = parseEntityAsync(MealSchema);
export const parseCreateMealInput = parseEntity(CreateMealSchema);
export const parseUpdateMealPositionInputAsync = parseEntityAsync(
  UpdateMealPositionSchema,
);
