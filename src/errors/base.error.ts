import type { Jsonable } from "@/types";

export abstract class BaseError extends Error {
  protected abstract readonly code: string;
  public readonly context?: Jsonable;

  constructor(
    message: string,
    options: { cause?: Error; context?: Jsonable } = {},
  ) {
    const { cause, context } = options;

    super(message, { cause });
    this.name = this.constructor.name;

    this.context = context;
  }
}
