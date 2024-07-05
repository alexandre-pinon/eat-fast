import type { Jsonable } from "@/types";
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferIssue,
} from "valibot";
import { BaseError } from "./base.error";

export class ValidationError<
  T extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    // biome-ignore lint/suspicious/noExplicitAny:
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> = any,
> extends BaseError {
  code = "Validation";
  readonly issues: InferIssue<T>[];

  constructor(
    issuesOrErrorMessage: InferIssue<T>[] | string,
    options?: { cause?: Error; context?: Jsonable },
  ) {
    super("Error validating entity", options);

    if (Array.isArray(issuesOrErrorMessage)) {
      this.issues = issuesOrErrorMessage;
    } else {
      this.issues = [
        {
          message: issuesOrErrorMessage,
          type: "string",
          kind: "schema",
          input: "unknown",
          expected: "unknown",
          received: "unknown",
        },
      ];
    }
  }
}
