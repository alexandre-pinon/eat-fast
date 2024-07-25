"use server";

import { db } from "@/db/client";
import { mealsToIngredients } from "@/db/schema";
import { logError } from "@/logger";
import type { Nullable } from "@/types";
import type { QuantityUnit } from "@/types/quantity-unit";
import { toPromise, tryCatchTechnical } from "@/utils";
import { and, eq, isNull } from "drizzle-orm";
import { taskEither } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";

export const toggleMealIngredientCheckAction = async (
  ingredientId: string,
  unit: Nullable<QuantityUnit>,
  mealId: Nullable<string>,
  checked: boolean,
): Promise<void> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .update(mealsToIngredients)
          .set({ checked })
          .where(
            and(
              eq(mealsToIngredients.ingredientId, ingredientId),
              mealId ? eq(mealsToIngredients.mealId, mealId) : undefined,
              unit
                ? eq(mealsToIngredients.unit, unit)
                : isNull(mealsToIngredients.unit),
            ),
          ),
      `Error while updating meal ingredient checked to ${checked} for ingredient #${ingredientId}`,
    ),
    taskEither.orElseFirstIOK(logError),
    taskEither.map(constVoid),
    toPromise,
  );
};
