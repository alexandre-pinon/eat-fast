import { db } from "@/db/client";
import { users } from "@/db/schema";
import type { UserPreferences } from "@/entities/user";
import { TechnicalError } from "@/errors/technial.error";
import { tryCatchTechnical } from "@/utils";
import { eq } from "drizzle-orm";
import { array, taskEither } from "fp-ts";
import type { TaskEither } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

export const getPreferencesByUserId = (
  userId: string,
): TaskEither<TechnicalError, UserPreferences> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .select({
            displayBreakfast: users.displayBreakfast,
          })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1),
      `Error while finding preferences for user #${userId}`,
    ),
    taskEither.map(array.head),
    taskEither.flatMap(
      taskEither.fromOption(
        () => new TechnicalError(`User #${userId} not found`),
      ),
    ),
  );
};
