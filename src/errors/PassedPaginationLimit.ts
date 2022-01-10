import { PAGINATION_MAX_LIMIT } from "../constants/config";
import { ErrorCodes } from "../constants/errorCodes";
import { HttpError } from "./HttpError";

export class PassedPaginationLimitError extends HttpError {
  constructor() {
    super();
    this.name = "PassedPaginationLimitError";
    this.statusCode = 404;
    this.errorCode = ErrorCodes.PASSED_MAX_PAGINATION_LIMIT;
    this.description = `Currently you can't query more than ${PAGINATION_MAX_LIMIT} per page`

    Object.setPrototypeOf(this, PassedPaginationLimitError.prototype);
  }
}