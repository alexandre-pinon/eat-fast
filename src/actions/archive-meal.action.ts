"use server";

import { db } from "@/db/client";
import { meals } from "@/db/schema";
import { logError } from "@/logger";
import { revalidatePathIO, toPromise, tryCatchTechnical } from "@/utils";
import { eq } from "drizzle-orm";
import { taskEither } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";

export const archiveMealAction = (mealId: string): Promise<void> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db.update(meals).set({ archived: true }).where(eq(meals.id, mealId)),
      `Error while archiving meal #${mealId}`,
    ),
    taskEither.tapIO(() => revalidatePathIO("/meals-of-the-week")),
    taskEither.orElseFirstIOK(logError),
    taskEither.map(constVoid),
    toPromise,
  );
};
