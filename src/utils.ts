import { array, either, taskEither } from "fp-ts";
import type { Either } from "fp-ts/Either";
import type { IO } from "fp-ts/IO";
import type { TaskEither } from "fp-ts/TaskEither";
import { constVoid, flow, pipe } from "fp-ts/function";
import { revalidatePath, revalidateTag } from "next/cache";
import { match } from "ts-pattern";
import { TechnicalError } from "./errors/technial.error";
import { ValidationError } from "./errors/validation.error";
import type { Jsonable } from "./types";
import type { MealType } from "./types/meal-type";

export const getPlaceHolderImageByType = (type: MealType): string =>
  match(type)
    .with("breakfast", () => "/breakfast.jpeg")
    .with("lunch", () => "/lunch.jpeg")
    .with("diner", () => "/diner.jpeg")
    .exhaustive();

export const toPromise = <E, A>(taskEither: TaskEither<E, A>): Promise<A> =>
  new Promise((resolve, reject) => {
    taskEither().then(
      either.fold(
        error => reject(error),
        value => resolve(value),
      ),
      error => reject(error),
    );
  });

export const toPlainObjectPromise = <E, A>(
  taskEither: TaskEither<E, A>,
): Promise<A> =>
  new Promise((resolve, reject) => {
    taskEither().then(
      either.fold(
        error => reject(error),
        value => resolve(JSON.parse(JSON.stringify(value))),
      ),
      error => reject(error),
    );
  });

export const ensureError = (value: unknown): Error => {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`,
  );
  return error;
};

export const tryCatchTechnical = <A>(
  fn: () => Promise<A>,
  errorMessage: string,
  context?: Jsonable,
): TaskEither<TechnicalError, A> => {
  return taskEither.tryCatch(
    () => fn(),
    error => {
      console.error(error);
      return new TechnicalError(errorMessage, {
        cause: ensureError(error),
        context,
      });
    },
  );
};

export const validateLengths = <T extends Jsonable>(
  ...arrays: ReadonlyArray<ReadonlyArray<T>>
): Either<ValidationError, void> => {
  const isSameLengthAsFirst = (len: number) => len === arrays[0].length;

  return pipe(
    arrays.map(arr => arr.length),
    either.fromPredicate(
      flow(array.every(isSameLengthAsFirst)),
      () =>
        new ValidationError("Input arrays must have the same length", {
          context: arrays,
        }),
    ),
    either.map(constVoid),
  );
};

export const revalidatePathIO =
  (path: string): IO<void> =>
  () =>
    revalidatePath(path);

export const revalidateTagIO =
  (tag: string): IO<void> =>
  () =>
    revalidateTag(tag);

export const stringToBoolean = (str: string): boolean =>
  str.toLowerCase() === "true";

export const isOnMobileDevice = (userAgent: string): boolean => {
  return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
};
