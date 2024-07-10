import { getUserIdFromServerSession } from "@/auth";
import { db } from "@/db/client";
import { meals } from "@/db/schema";
import { parseUpdateMealPositionInputAsync } from "@/entities/meal";
import { UnaunthenticatdError } from "@/errors/unauthenticated.error";
import { ValidationError } from "@/errors/validation.error";
import { logError } from "@/logger";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import { toPromise, tryCatchTechnical } from "@/utils";
import { and, eq } from "drizzle-orm";
import { taskEither } from "fp-ts";
import type { TaskEither } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { NextResponse } from "next/server";
import { P, match } from "ts-pattern";

type RouteParams = { params: { mealId: string } };
export const PUT = async (
  request: Request,
  { params }: RouteParams,
): Promise<ApiResponse<Record<never, never>>> => {
  return pipe(
    taskEither.Do,
    taskEither.apS("userId", getUserIdFromServerSession()),
    taskEither.apSW(
      "updateMealPositionInput",
      pipe(
        tryCatchTechnical(() => request.json(), "Error parsing request body"),
        taskEither.flatMap(parseUpdateMealPositionInputAsync),
      ),
    ),
    taskEither.flatMap(({ userId, updateMealPositionInput }) =>
      tryCatchTechnical(
        () =>
          db
            .update(meals)
            .set({
              type: updateMealPositionInput.type,
              weekDay: updateMealPositionInput.weekDay,
            })
            .where(and(eq(meals.id, params.mealId), eq(meals.userId, userId))),
        `Error while updating meal #${params.mealId}`,
      ),
    ),
    taskEither.map(() => NextResponse.json({})),
    taskEither.orElseFirstIOK(logError),
    taskEither.orElseW(error =>
      pipe(
        match(error)
          .returnType<TaskEither<never, NextResponse<ApiErrorResponse>>>()
          .with(P.instanceOf(ValidationError), ({ issues, message }) =>
            taskEither.right(
              NextResponse.json(
                { message, issues: issues.map(issue => issue.message) },
                { status: 400 },
              ),
            ),
          )
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
        NextResponse.json,
        taskEither.right,
      ),
    ),
    toPromise,
  );
};
