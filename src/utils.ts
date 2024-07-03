import { either, taskEither } from "fp-ts";
import type { TaskEither } from "fp-ts/TaskEither";
import { match } from "ts-pattern";
import { TechnicalError } from "./errors/technial.error";
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
    error =>
      new TechnicalError(errorMessage, {
        cause: ensureError(error),
        context,
      }),
  );
};
