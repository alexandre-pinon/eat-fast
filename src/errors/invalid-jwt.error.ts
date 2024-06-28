import { BaseError } from "./base.error";

export class InvalidJwtError extends BaseError {
  code = "Invalid_Jwt";

  constructor() {
    super("Invalid JWT");
  }
}
