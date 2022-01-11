import { query } from "express-validator";
import { ErrorCodes } from "./error-codes";

export const PAGINATION_VALIDATION_CHAIN = [
  query('limit')
    .optional()
    .isInt()
    .withMessage(ErrorCodes.SHOULD_BE_INT)
    .custom((limitStr) => {
      const limit = parseInt(limitStr);

      if (limit < 1) {
        throw new Error();
      }

      return true;
    })
    .withMessage(ErrorCodes.INVALID_LENGTH),
  query('page')
    .optional()
    .isInt()
    .withMessage(ErrorCodes.SHOULD_BE_INT)
    .custom((limitStr) => {
      const limit = parseInt(limitStr);

      if (limit < 1) {
        throw new Error();
      }

      return true;
    })
    .withMessage(ErrorCodes.INVALID_LENGTH),
]