import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../errors/ValidationError";

export function handleValidatorErrors(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorList = errors.array();
    next(new ValidationError(errorList));
  } else {
    next();
  }
}