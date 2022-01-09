import { ErrorCodes } from "../constants/errorCodes";
import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  constructor() {
    super();
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.errorCode = ErrorCodes.NOT_FOUND;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}