import { body } from "express-validator";
import { ErrorCodes } from "../../constants/errorCodes";

export class ArticleValidation {
  static insert = [
    body("name")
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING),
    body("email")
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING)
      .isEmail()
      .withMessage(ErrorCodes.INVALID_EMAIL),
  ];
}