import { ErrorCodes } from "../constants/error-codes";
import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
  constructor(description?: string) {
    super();
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.errorCode = ErrorCodes.NOT_FOUND;
    this.description = description;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}