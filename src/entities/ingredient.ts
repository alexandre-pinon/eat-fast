import { quantityUnits } from "@/types/quantity-unit";
import { weekDays } from "@/types/weekday";
import {
  NonEmptyStringSchema,
  StringToNumberSchema,
  UUIDSchema,
  parseEntity,
  parseEntityAsync,
} from "@/valibot";
import * as v from "valibot";

const IngredientSchema = v.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  name: NonEmptyStringSchema,
});

const MealIngredientSchema = v.object({
  ...IngredientSchema.entries,
  quantity: StringToNumberSchema("quantity"),
  unit: v.nullable(v.picklist(quantityUnits)),
});

const AggregatedMealIngredientSchema = v.object({
  ...MealIngredientSchema.entries,
  weekDay: v.picklist(weekDays),
});

const CreateIngredientSchema = v.object({
  ...MealIngredientSchema.entries,
  name: v.pipe(
    v.string("Ingredient name must be a string"),
    v.nonEmpty("Ingredient name is required"),
  ),
  quantity: StringToNumberSchema("quantity"),
  unit: v.pipe(
    v.string(),
    v.transform(unit => (unit.length === 0 ? null : unit)),
    v.nullable(v.picklist(quantityUnits, "Unit is invalid")),
  ),
});

export type Ingredient = v.InferOutput<typeof IngredientSchema>;
export type MealIngredient = v.InferOutput<typeof MealIngredientSchema>;
export type AggregatedMealIngredient = v.InferOutput<
  typeof AggregatedMealIngredientSchema
>;
export type CreateIngredientInput = v.InferOutput<
  typeof CreateIngredientSchema
>;

export const parseIngredientAsync = parseEntityAsync(IngredientSchema);
export const parseMealIngredientAsync = parseEntityAsync(MealIngredientSchema);
export const parseAggregatedMealIngredientAsync = parseEntityAsync(
  AggregatedMealIngredientSchema,
);
export const parseCreateIngredientInput = parseEntity(CreateIngredientSchema);
