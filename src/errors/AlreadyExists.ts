import { ErrorCodes } from "../constants/errorCodes";
import { HttpError } from "./HttpError";

export class AlreadyExistsError extends HttpError {
  constructor() {
    super();
    this.name = "AlreadyExistsError";
    this.statusCode = 409;
    this.errorCode = ErrorCodes.ALREADY_EXISTS;

    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}