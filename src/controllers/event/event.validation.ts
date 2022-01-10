import { body } from "express-validator";
import { ErrorCodes } from "../../constants/errorCodes";

export class EventValidation {
  static insert = [
    body("provider")
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING),
    body("id")
      .optional()
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING)
      .isUUID()
      .withMessage(ErrorCodes.INVALID_UUID),
  ];
}