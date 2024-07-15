import { getUserIdFromServerSession } from "@/auth";
import { db } from "@/db/client";
import { meals } from "@/db/schema";
import { type Meal, parseMealAsync } from "@/entities/meal";
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
import { NextResponse } from "next/server";
import { P, match } from "ts-pattern";

export const GET = async (): Promise<ApiResponse<readonly Meal[]>> => {
  return pipe(
    getUserIdFromServerSession(),
    taskEither.flatMap(getArchivedMealsByUserId),
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

const getArchivedMealsByUserId = (
  userId: string,
): TaskEither<TechnicalError | ValidationError, readonly Meal[]> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .select()
          .from(meals)
          .where(and(eq(meals.userId, userId), eq(meals.archived, true))),
      "Error while finding archived meals by user id",
    ),
    taskEither.flatMap(taskEither.traverseArray(parseMealAsync)),
  );
};
