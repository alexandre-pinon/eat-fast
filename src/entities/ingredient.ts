import { quantityUnits } from "@/types/quantity-unit";
import { NonEmptyStringSchema, UUIDSchema, parseEntity } from "@/valibot";
import * as v from "valibot";

export const IngredientSchema = v.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  name: NonEmptyStringSchema,
  quantity: v.number(),
  unit: v.nullable(v.picklist(quantityUnits)),
});
export type Ingredient = v.InferOutput<typeof IngredientSchema>;

export const CreateIngredientSchema = v.object({
  ...IngredientSchema.entries,
  name: v.pipe(
    v.string("Ingredient name must be a string"),
    v.nonEmpty("Ingredient name is required"),
  ),
  quantity: v.pipe(
    v.string(),
    v.transform(Number),
    v.number("Quantity is not a valid number"),
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

export const parseCreateIngredientInput = parseEntity(CreateIngredientSchema);
