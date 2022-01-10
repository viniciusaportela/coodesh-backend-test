import { body } from "express-validator";
import { ErrorCodes } from "../../constants/error-codes";

export class ArticleValidation {
  static insert = [
    body("featured")
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isBoolean()
      .withMessage(ErrorCodes.SHOULD_BE_BOOLEAN),
    body("title")
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING),
    body('url')
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING)
      .isURL()
      .withMessage(ErrorCodes.INVALID_URL),
    body('imageUrl')
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING)
      .isURL()
      .withMessage(ErrorCodes.INVALID_URL),
    body('newsSite')
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING),
    body('summary')
      .exists()
      .withMessage(ErrorCodes.MISSING_FIELD)
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING),
    body('publishedAt')
      .optional()
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING)
      .isISO8601()
      .withMessage(ErrorCodes.INVALID_DATE),
    body('events.*')
      .optional()
      .isInt()
      .withMessage(ErrorCodes.SHOULD_BE_INT),
    body('launches.*')
      .optional()
      .isString()
      .withMessage(ErrorCodes.SHOULD_BE_STRING)
  ];
}