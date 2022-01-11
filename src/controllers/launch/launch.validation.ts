import { body, param } from "express-validator";
import { ErrorCodes } from "../../constants/error-codes";

export class LaunchValidation {
  static paramVerification = [
    param('launchId')
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isUUID()
      .withMessage(ErrorCodes.INVALID_UUID)
  ]

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