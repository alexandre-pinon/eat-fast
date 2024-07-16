import { getUserIdFromServerSession } from "@/auth";
import { db } from "@/db/client";
import { meals } from "@/db/schema";
import { type Meal, parseMealAsync } from "@/entities/meal";
import type { TechnicalError } from "@/errors/technial.error";
import { UnaunthenticatdError } from "@/errors/unauthenticated.error";
import type { ValidationError } from "@/errors/validation.error";
import { logDebug, logError } from "@/logger";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import { stringToBoolean, toPromise, tryCatchTechnical } from "@/utils";
import { and, eq } from "drizzle-orm";
import { option, taskEither } from "fp-ts";
import type { Option } from "fp-ts/Option";
import type { TaskEither } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { type NextRequest, NextResponse } from "next/server";
import { P, match } from "ts-pattern";

export const GET = async (
  request: NextRequest,
): Promise<ApiResponse<readonly Meal[]>> => {
  return pipe(
    request.nextUrl.searchParams.get("archived"),
    option.fromNullable,
    option.map(stringToBoolean),
    taskEither.of,
    taskEither.bindTo("archived"),
    taskEither.apS("userId", getUserIdFromServerSession()),
    taskEither.tapIO(logDebug),
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

const getArchivedMealsByUserId = (input: {
  userId: string;
  archived: Option<boolean>;
}): TaskEither<TechnicalError | ValidationError, readonly Meal[]> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .select()
          .from(meals)
          .where(
            and(
              eq(meals.userId, input.userId),
              option.isSome(input.archived)
                ? eq(meals.archived, input.archived.value)
                : undefined,
            ),
          ),
      "Error while finding archived meals by user id",
    ),
    taskEither.flatMap(taskEither.traverseArray(parseMealAsync)),
  );
};
