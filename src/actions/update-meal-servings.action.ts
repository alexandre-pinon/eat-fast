"use server";

import { type DbTransaction, db } from "@/db/client";
import { meals, mealsToIngredients } from "@/db/schema";
import { logError } from "@/logger";
import { revalidatePathIO, toPromise, tryCatchTechnical } from "@/utils";
import { eq, sql } from "drizzle-orm";
import { taskEither } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";

export const updateServingsAction = async (
  mealId: string,
  servings: number,
): Promise<void> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db.transaction(tx =>
          pipe(
            taskEither.Do,
            taskEither.apFirst(updateMealServings(tx)(mealId, servings)),
            taskEither.apFirst(
              updateMealIngredientsQuantities(tx)(mealId, servings),
            ),
            toPromise,
          ),
        ),
      `Error while executing update servings transaction for meal #${mealId}`,
    ),
    taskEither.orElseFirstIOK(logError),
    taskEither.tapIO(() => revalidatePathIO("/meals-of-the-week")),
    taskEither.map(constVoid),
    toPromise,
  );
};

const updateMealServings =
  (tx: DbTransaction) => (mealId: string, servings: number) => {
    return tryCatchTechnical(
      () => tx.update(meals).set({ servings }).where(eq(meals.id, mealId)),
      `Error while updating servings for meal #${mealId}`,
    );
  };

const updateMealIngredientsQuantities =
  (tx: DbTransaction) => (mealId: string, servings: number) => {
    return tryCatchTechnical(
      () =>
        tx
          .update(mealsToIngredients)
          .set({
            quantityWithServings: sql`${mealsToIngredients.quantity} * ${servings}`,
          })
          .where(eq(mealsToIngredients.mealId, mealId)),
      `Error while updating ingredient quantities for meal #${mealId}`,
    );
  };
