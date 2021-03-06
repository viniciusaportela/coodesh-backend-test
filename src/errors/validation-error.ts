import { ErrorCodes, ErrorNumberCodes } from "../constants/error-codes";
import { ValidationError as ExpressValidationError } from 'express-validator'
import { HttpError } from "./http-error";

interface IValidationErrorItem {
  errorCode: string;
  field: string;
}

export class ValidationError extends HttpError {
  public errors: IValidationErrorItem[];

  constructor(errorList: ExpressValidationError[]) {
    super();

    this.name = "ValidationError";
    this.statusCode = ErrorNumberCodes.UNPROCESSABLE_ENTITY;
    this.errorCode = ErrorCodes.VALIDATION_ERROR;
    this.errors = errorList.map(error => ({
      errorCode: error.msg,
      field: error.param
    }))

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}