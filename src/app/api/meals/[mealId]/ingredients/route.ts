import { getUserIdFromServerSession } from "@/auth";
import { db } from "@/db/client";
import { ingredients, mealsToIngredients } from "@/db/schema";
import {
  type MealIngredient,
  parseMealIngredientAsync,
} from "@/entities/ingredient";
import type { TechnicalError } from "@/errors/technial.error";
import { UnaunthenticatdError } from "@/errors/unauthenticated.error";
import type { ValidationError } from "@/errors/validation.error";
import { logError } from "@/logger";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import { toPromise, tryCatchTechnical } from "@/utils";
import { and, eq } from "drizzle-orm";
import { taskEither } from "fp-ts";
import type { TaskEither } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { type NextRequest, NextResponse } from "next/server";
import { P, match } from "ts-pattern";

type RouteParams = { params: { mealId: string } };
export const GET = async (
  _request: NextRequest,
  { params }: RouteParams,
): Promise<ApiResponse<readonly MealIngredient[]>> => {
  return pipe(
    taskEither.Do,
    taskEither.apS("mealId", taskEither.right(params.mealId)),
    taskEither.apS("userId", getUserIdFromServerSession()),
    taskEither.flatMap(getMealIngredientsByUserId),
    taskEither.map(NextResponse.json),
    taskEither.orElseFirstIOK(logError),
    taskEither.orElseW(error =>
      match(error)
        .returnType<TaskEither<never, NextResponse<ApiErrorResponse>>>()
        .with(P.instanceOf(UnaunthenticatdError), ({ message }) =>
          taskEither.right(NextResponse.json({ message }, { status: 401 })),
        )
        .otherwise(() =>
          taskEither.right(
            NextResponse.json(
              { message: "Internal server error" },
              { status: 500 },
            ),
          ),
        ),
    ),
    toPromise,
  );
};

const getMealIngredientsByUserId = (input: {
  userId: string;
  mealId: string;
}): TaskEither<TechnicalError | ValidationError, readonly MealIngredient[]> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .select({
            id: ingredients.id,
            userId: ingredients.userId,
            name: ingredients.name,
            unit: mealsToIngredients.unit,
            quantity: mealsToIngredients.quantity,
            checked: mealsToIngredients.checked,
          })
          .from(ingredients)
          .innerJoin(
            mealsToIngredients,
            eq(ingredients.id, mealsToIngredients.ingredientId),
          )
          .where(
            and(
              eq(ingredients.userId, input.userId),
              eq(mealsToIngredients.mealId, input.mealId),
            ),
          ),
      "Error while finding meal ingredients by user id",
    ),
    taskEither.flatMap(taskEither.traverseArray(parseMealIngredientAsync)),
  );
};
