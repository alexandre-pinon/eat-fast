import type { Jsonable } from "@/types";
import { BaseError } from "./base.error";

export class UnaunthenticatdError extends BaseError {
  code = "Unauthenticated";

  constructor(options: { cause?: Error; context?: Jsonable } = {}) {
    super("Unauthenticated", options);
  }
}
