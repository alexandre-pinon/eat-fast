"use server";
import { type DbTransaction, type UpsertResult, db } from "@/db/client";
import { ingredients, meals, mealsToIngredients } from "@/db/schema";
import {
  type CreateIngredientInput,
  parseCreateIngredientInput,
} from "@/entities/ingredient";
import {
  type CreateMealInput,
  type CreateMealWithIngredientsInput,
  type Meal,
  parseCreateMealInput,
} from "@/entities/meal";
import { TechnicalError } from "@/errors/technial.error";
import { ValidationError } from "@/errors/validation.error";
import { logDebug, logError } from "@/logger";
import type { MealType } from "@/types/meal-type";
import type { WeekDay } from "@/types/weekday";
import {
  revalidatePathIO,
  toPromise,
  tryCatchTechnical,
  validateLengths,
} from "@/utils";
import { and, eq, notInArray, sql } from "drizzle-orm";
import { array, boolean, either, readonlyArray, taskEither } from "fp-ts";
import type { Either } from "fp-ts/Either";
import type { TaskEither } from "fp-ts/TaskEither";
import { constVoid, pipe } from "fp-ts/function";

type UpsertMealActionData = {
  mealId: string;
  userId: string;
  type: MealType;
  weekDay: WeekDay;
  servings: number;
  isLeftover: boolean;
};
type UpsertMealFormState =
  | { mealUpserted: true; meal: Meal }
  | { mealUpserted: false };

export const upsertMealAction = async (
  additionalData: UpsertMealActionData,
  _prevState: UpsertMealFormState,
  formData: FormData,
): Promise<UpsertMealFormState> => {
  return pipe(
    formData,
    parseFormData(additionalData),
    taskEither.fromEither,
    taskEither.tap(upsertMealWithIngredients(additionalData.servings)),
    taskEither.orElseFirstIOK(logError),
    taskEither.tapIO(() => revalidatePathIO("/meals-of-the-week")),
    taskEither.fold(
      () =>
        taskEither.right<never, UpsertMealFormState>({ mealUpserted: false }),
      ({ meal }) =>
        taskEither.right<never, UpsertMealFormState>({
          mealUpserted: true,
          meal,
        }),
    ),
    toPromise,
  );
};

const upsertMealWithIngredients = (
  servings: number,
): ((
  input: CreateMealWithIngredientsInput,
) => TaskEither<TechnicalError, void>) => {
  return input =>
    tryCatchTechnical(
      () =>
        db.transaction(async tx =>
          pipe(
            input.meal,
            upsertMeal(tx),
            taskEither.apSecond(
              pipe(
                taskEither.of(input.ingredients),
                taskEither.flatMap(
                  taskEither.traverseSeqArray(upsertIngredient(tx)),
                ),
                taskEither.map(
                  readonlyArray.map(({ upsertedId }) => upsertedId),
                ),
                taskEither.map(readonlyArray.toArray),
              ),
            ),
            taskEither.tap(ingredientIds =>
              pipe(
                array.isEmpty(ingredientIds),
                boolean.fold(
                  () =>
                    deleteMealPreviousIngredients(tx)(
                      input.meal.id,
                      ingredientIds,
                    ),
                  () => taskEither.right(constVoid()),
                ),
              ),
            ),
            taskEither.flatMap(ingredientIds =>
              pipe(
                array.zipWith(
                  input.ingredients,
                  ingredientIds,
                  (ingredient, upsertedId) => ({
                    mealId: input.meal.id,
                    ingredientId: upsertedId,
                    quantity: (ingredient.quantity / servings).toString(),
                    unit: ingredient.unit,
                  }),
                ),
                taskEither.of,
                taskEither.flatMap(
                  taskEither.traverseSeqArray(upsertMealIngredient(tx)),
                ),
                taskEither.map(constVoid),
              ),
            ),
            toPromise,
          ),
        ),
      "Error while executing transaction",
      { input },
    );
};

const upsertMeal =
  (tx: DbTransaction) =>
  (meal: CreateMealInput): TaskEither<TechnicalError, void> => {
    return pipe(
      tryCatchTechnical(
        () =>
          tx
            .insert(meals)
            .values(meal)
            .onConflictDoUpdate({
              target: meals.id,
              set: {
                name: meal.name,
                type: meal.type,
                weekDay: meal.weekDay,
                time: meal.time,
                image: meal.image,
                recipe: meal.recipe,
                isLeftover: meal.isLeftover,
              },
            }),
        `Error while upserting meal #${meal.id}`,
      ),
      taskEither.map(constVoid),
    );
  };

const upsertIngredient =
  (tx: DbTransaction) =>
  (
    ingredient: CreateIngredientInput,
  ): TaskEither<TechnicalError, UpsertResult> => {
    return pipe(
      tryCatchTechnical(
        () =>
          tx
            .insert(ingredients)
            .values({
              id: ingredient.id,
              userId: ingredient.userId,
              name: ingredient.name.toLowerCase(),
            })
            .onConflictDoUpdate({
              target: [ingredients.userId, ingredients.name],
              set: { id: sql`${ingredients.id}` },
            })
            .returning({ upsertedId: ingredients.id }),
        `Error while upserting ingredient #${ingredient.id}`,
      ),
      taskEither.tapIO(logDebug),
      taskEither.map(array.head),
      taskEither.flatMap(
        taskEither.fromOption(() => new TechnicalError("No upserted result")),
      ),
    );
  };

const deleteMealPreviousIngredients =
  (tx: DbTransaction) =>
  (
    mealId: string,
    ingredientIds: string[],
  ): TaskEither<TechnicalError, void> => {
    return pipe(
      tryCatchTechnical(
        () =>
          tx
            .delete(mealsToIngredients)
            .where(
              and(
                eq(mealsToIngredients.mealId, mealId),
                notInArray(mealsToIngredients.ingredientId, ingredientIds),
              ),
            ),
        `Error while deleting ingredients that are not in ${ingredientIds} for meal #${mealId}`,
      ),
      taskEither.map(constVoid),
    );
  };

const upsertMealIngredient =
  (tx: DbTransaction) =>
  (
    input: typeof mealsToIngredients.$inferInsert,
  ): TaskEither<TechnicalError, void> => {
    return pipe(
      tryCatchTechnical(
        () =>
          tx
            .insert(mealsToIngredients)
            .values(input)
            .onConflictDoUpdate({
              target: [
                mealsToIngredients.mealId,
                mealsToIngredients.ingredientId,
              ],
              set: {
                quantity: input.quantity,
                unit: input.unit,
              },
            }),
        `Error while upserting ingredient #${input.ingredientId} in #${input.mealId}`,
      ),
      taskEither.map(constVoid),
    );
  };

const parseFormData =
  (additionalData: UpsertMealActionData) =>
  (
    formData: FormData,
  ): Either<ValidationError, CreateMealWithIngredientsInput> => {
    return pipe(
      either.Do,
      either.apS("ids", checkFormDataValues(formData, "ingredientId")),
      either.apS("quantities", checkFormDataValues(formData, "quantity")),
      either.apS("units", checkFormDataValues(formData, "unit")),
      either.apS("names", checkFormDataValues(formData, "ingredientName")),
      either.bind(
        "ingredients",
        transformArraysToIngredients(additionalData.userId),
      ),
      either.apS(
        "meal",
        parseCreateMealInput({
          id: additionalData.mealId,
          userId: additionalData.userId,
          type: additionalData.type,
          weekDay: additionalData.weekDay,
          isLeftover: additionalData.isLeftover,
          name: formData.get("name"),
          time: formData.get("time"),
          //FIXME: add image input
          image: null,
          recipe: formData.get("recipe"),
        }),
      ),
      either.map(({ ingredients, meal }) => ({ ingredients, meal })),
    );
  };

const checkFormDataValues = (
  formData: FormData,
  fieldName: string,
): Either<ValidationError, readonly string[]> => {
  return pipe(
    formData.getAll(fieldName),
    array.map(
      either.fromPredicate(
        value => typeof value === "string",
        () =>
          new ValidationError("Not all values are strings", {
            context: { fieldName },
          }),
      ),
    ),
    either.sequenceArray,
  );
};

const transformArraysToIngredients =
  (userId: string) =>
  ({
    ids,
    quantities,
    units,
    names,
  }: {
    ids: readonly string[];
    quantities: readonly string[];
    units: readonly string[];
    names: readonly string[];
  }): Either<ValidationError, CreateIngredientInput[]> => {
    return pipe(
      validateLengths(ids, quantities, units, names),
      either.map(() =>
        pipe(
          ids,
          readonlyArray.mapWithIndex(i => ({
            id: ids[i],
            userId,
            quantity: quantities[i],
            unit: units[i],
            name: names[i],
          })),
        ),
      ),
      either.flatMap(either.traverseArray(parseCreateIngredientInput)),
      either.map(readonlyArray.toArray),
    );
  };
