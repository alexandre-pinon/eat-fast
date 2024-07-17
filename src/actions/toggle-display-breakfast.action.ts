"use server";

import { db } from "@/db/client";
import { users } from "@/db/schema";
import { logError } from "@/logger";
import { toPromise, tryCatchTechnical } from "@/utils";
import { eq } from "drizzle-orm";
import { taskEither } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";

export const toggleDisplayBreakfastAction = async (
  userId: string,
  displayBreakfast: boolean,
): Promise<void> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .update(users)
          .set({
            displayBreakfast,
          })
          .where(eq(users.id, userId)),
      `Error while updating display breakfast to ${displayBreakfast} for user #${userId}`,
    ),
    taskEither.orElseFirstIOK(logError),
    taskEither.map(constVoid),
    toPromise,
  );
};
