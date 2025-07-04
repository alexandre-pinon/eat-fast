import { getUserIdFromServerSession } from "@/auth";
import { db } from "@/db/client";
import { ingredients } from "@/db/schema";
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

export const GET = async (): Promise<ApiResponse<readonly Ingredient[]>> => {
  return pipe(
    getUserIdFromServerSession(),
    taskEither.flatMap(getIngredientsByUserId),
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

const getIngredientsByUserId = (
  userId: string,
): TaskEither<TechnicalError | ValidationError, readonly Ingredient[]> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .select({
            id: ingredients.id,
            userId: ingredients.userId,
            name: ingredients.name,
          })
          .from(ingredients)
          .where(eq(ingredients.userId, userId)),
      "Error while finding ingredients by user id",
    ),
    taskEither.flatMap(taskEither.traverseArray(parseIngredientAsync)),
  );
};
