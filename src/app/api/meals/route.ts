import { getUserIdFromServerSession } from "@/auth";
import { db } from "@/db/client";
import { meals } from "@/db/schema";
import { type Meal, parseMealAsync } from "@/entities/meal";
import type { TechnicalError } from "@/errors/technial.error";
import { UnaunthenticatdError } from "@/errors/unauthenticated.error";
import type { ValidationError } from "@/errors/validation.error";
import { logError } from "@/logger";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import { stringToBoolean, toPromise, tryCatchTechnical } from "@/utils";
import { and, eq, ne } from "drizzle-orm";
import { boolean, identity, option, record, taskEither } from "fp-ts";
import type { Option } from "fp-ts/Option";
import type { TaskEither } from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import { type NextRequest, NextResponse } from "next/server";
import { P, match } from "ts-pattern";

export const GET = async (
  request: NextRequest,
): Promise<ApiResponse<readonly Meal[]>> => {
  return pipe(
    parseRequestSearchParams(request.nextUrl.searchParams),
    taskEither.of,
    taskEither.apS("userId", getUserIdFromServerSession()),
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

const parseRequestSearchParams = (
  searchParams: URLSearchParams,
): {
  archived: Option<boolean>;
  displayBreakfast: Option<boolean>;
} => {
  return pipe(
    identity.Do,
    identity.apS("archived", option.fromNullable(searchParams.get("archived"))),
    identity.apS(
      "displayBreakfast",
      option.fromNullable(searchParams.get("displayBreakfast")),
    ),
    identity.map(record.map(option.map(stringToBoolean))),
  );
};

const getArchivedMealsByUserId = (input: {
  userId: string;
  archived: Option<boolean>;
  displayBreakfast: Option<boolean>;
}): TaskEither<TechnicalError | ValidationError, readonly Meal[]> => {
  const archivedCondition = flow(
    option.map((archived: boolean) => eq(meals.archived, archived)),
    option.toUndefined,
  );

  const displayBreakfastCondition = flow(
    option.flatMap(
      boolean.fold(
        () => option.some(ne(meals.type, "breakfast")),
        () => option.none,
      ),
    ),
    option.toUndefined,
  );

  return pipe(
    tryCatchTechnical(
      () =>
        db
          .select()
          .from(meals)
          .where(
            and(
              eq(meals.userId, input.userId),
              archivedCondition(input.archived),
              displayBreakfastCondition(input.displayBreakfast),
            ),
          ),
      "Error while finding archived meals by user id",
    ),
    taskEither.flatMap(taskEither.traverseArray(parseMealAsync)),
  );
};
