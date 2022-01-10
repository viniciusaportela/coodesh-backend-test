import { PAGINATION_MAX_LIMIT } from "../constants/config";
import { ErrorCodes, ErrorNumberCodes } from "../constants/error-codes";
import { HttpError } from "./http-error";

export class PassedPaginationLimitError extends HttpError {
  constructor() {
    super();
    this.name = "PassedPaginationLimitError";
    this.statusCode = ErrorNumberCodes.UNPROCESSABLE_ENTITY;
    this.errorCode = ErrorCodes.PASSED_MAX_PAGINATION_LIMIT;
    this.description = `Currently you can't query more than ${PAGINATION_MAX_LIMIT} per page`

    Object.setPrototypeOf(this, PassedPaginationLimitError.prototype);
  }
}