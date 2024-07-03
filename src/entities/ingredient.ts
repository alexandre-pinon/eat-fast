import { quantityUnits } from "@/types/quantity-unit";
import { parseEntity } from "@/valibot";
import * as v from "valibot";

export const IngredientSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid()),
  name: v.pipe(v.string(), v.nonEmpty()),
  quantity: v.number(),
  unit: v.nullable(v.picklist(quantityUnits)),
});
export type Ingredient = v.InferOutput<typeof IngredientSchema>;

export const parseIngredient = parseEntity(IngredientSchema);
