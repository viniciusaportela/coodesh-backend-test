import { ErrorCodes } from "../constants/errorCodes";
import { ValidationError as ExpressValidationError } from 'express-validator'
import { HttpError } from "./HttpError";

export class ValidationError extends HttpError {
  public field: string;

  constructor(errorList: ExpressValidationError[]) {
    super();

    // TODO get first and group

    this.name = "ValidationError";
    this.statusCode = 422;
    // this.errorCode = errorCode;
    // this.field = field;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}