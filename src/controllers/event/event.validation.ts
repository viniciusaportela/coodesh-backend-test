import { body, param } from "express-validator";
import { ErrorCodes } from "../../constants/error-codes";

export class EventValidation {
  static paramVerification = [
    param('eventId')
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isInt()
      .withMessage(ErrorCodes.SHOULD_BE_INT)
  ]

  static insert = [
    body("provider")
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING),
    body("id")
      .optional()
      .isInt()
      .withMessage(ErrorCodes.SHOULD_BE_INT)
  ];
}