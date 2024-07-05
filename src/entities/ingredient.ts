import { quantityUnits } from "@/types/quantity-unit";
import {
  NonEmptyStringSchema,
  StringToNumberSchema,
  UUIDSchema,
  parseEntity,
  parseEntityAsync,
} from "@/valibot";
import * as v from "valibot";

export const IngredientSchema = v.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  name: NonEmptyStringSchema,
  quantity: StringToNumberSchema("quantity"),
  unit: v.nullable(v.picklist(quantityUnits)),
});
export type Ingredient = v.InferOutput<typeof IngredientSchema>;

export const CreateIngredientSchema = v.object({
  ...IngredientSchema.entries,
  name: v.pipe(
    v.string("Ingredient name must be a string"),
    v.nonEmpty("Ingredient name is required"),
  ),
  unit: v.pipe(
    v.string(),
    v.transform(unit => (unit.length === 0 ? null : unit)),
    v.nullable(v.picklist(quantityUnits, "Unit is invalid")),
  ),
});
export type CreateIngredientInput = v.InferOutput<
  typeof CreateIngredientSchema
>;

export const parseIngredientAsync = parseEntityAsync(IngredientSchema);
export const parseCreateIngredientInput = parseEntity(CreateIngredientSchema);
