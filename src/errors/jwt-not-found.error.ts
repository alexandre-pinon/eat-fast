import { BaseError } from "./base.error";

export class JwtNotFoundError extends BaseError {
  code = "Jwt_NotFound";

  constructor() {
    super("Jwt not found");
  }
}
