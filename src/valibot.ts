import { either, taskEither } from "fp-ts";
import type { Either } from "fp-ts/Either";
import { flow, pipe } from "fp-ts/function";
import { match } from "ts-pattern";
import * as v from "valibot";
import { ValidationError } from "./errors/validation.error";

export const parseEntity =
  <
    A extends v.ObjectEntries,
    B extends v.ErrorMessage<v.ObjectIssue> | undefined,
  >(
    schema: v.ObjectSchema<A, B>,
  ) =>
  <T>(entity: T): Either<ValidationError, v.InferOutput<typeof schema>> => {
    return pipe(v.safeParse(schema, entity), result =>
      match(result)
        .with({ success: true }, ({ output }) => either.right(output))
        .with({ success: false }, ({ issues }) =>
          either.left(new ValidationError(issues)),
        )
        .exhaustive(),
    );
  };

export const parseEntityAsync = <
  A extends v.ObjectEntries,
  B extends v.ErrorMessage<v.ObjectIssue> | undefined,
>(
  schema: v.ObjectSchema<A, B>,
) => flow(parseEntity(schema), taskEither.fromEither);

export const UUIDSchema = v.pipe(v.string(), v.uuid());
export const NonEmptyStringSchema = v.pipe(v.string(), v.nonEmpty());
export const StringToNumberSchema = (field?: string) =>
  v.pipe(
    v.string(),
    v.transform(Number),
    v.number(`${field ?? "field"} is not a valid number`),
  );
