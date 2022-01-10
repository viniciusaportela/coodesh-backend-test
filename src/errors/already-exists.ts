import { ErrorCodes } from "../constants/error-codes";
import { HttpError } from "./http-error";

export class AlreadyExistsError extends HttpError {
  constructor() {
    super();
    this.name = "AlreadyExistsError";
    this.statusCode = 409;
    this.errorCode = ErrorCodes.ALREADY_EXISTS;

    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}