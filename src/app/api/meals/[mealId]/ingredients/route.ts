import { getUserIdFromServerSession } from "@/auth";
import { db } from "@/db/client";
import { ingredients, mealsToIngredients } from "@/db/schema";
import { type Ingredient, parseIngredientAsync } from "@/entities/ingredient";
import type { TechnicalError } from "@/errors/technial.error";
import { UnaunthenticatdError } from "@/errors/unauthenticated.error";
import type { ValidationError } from "@/errors/validation.error";
import { logError } from "@/logger";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import { toPromise, tryCatchTechnical } from "@/utils";
import { eq } from "drizzle-orm";
import { taskEither } from "fp-ts";
import type { TaskEither } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { NextResponse } from "next/server";
import { P, match } from "ts-pattern";

type RouteParams = { params: { mealId: string } };
export const GET = async (
  _request: Request,
  { params }: RouteParams,
): Promise<ApiResponse<readonly Ingredient[]>> => {
  return pipe(
    getUserIdFromServerSession(),
    taskEither.apSecondW(getIngredientsByMealId(params.mealId)),
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

const getIngredientsByMealId = (
  mealId: string,
): TaskEither<TechnicalError | ValidationError, readonly Ingredient[]> => {
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
          })
          .from(mealsToIngredients)
          .innerJoin(
            ingredients,
            eq(mealsToIngredients.ingredientId, ingredients.id),
          )
          .where(eq(mealsToIngredients.mealId, mealId)),
      "Error while finding meals by user id",
    ),
    taskEither.flatMap(taskEither.traverseArray(parseIngredientAsync)),
  );
};
