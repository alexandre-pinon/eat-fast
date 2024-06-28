import { pipe } from "fp-ts/function";
import * as v from "valibot";
import { tryCatchTechnical } from "./utils";

export const parseEntity =
  <
    A extends v.ObjectEntries,
    B extends v.ErrorMessage<v.ObjectIssue> | undefined,
  >(
    schema: v.ObjectSchema<A, B>,
  ) =>
  <T>(entity: T) => {
    return pipe(
      tryCatchTechnical(
        () => v.parseAsync(schema, entity),
        "Error parsing entity",
      ),
    );
  };
