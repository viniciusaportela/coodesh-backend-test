import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../constants/error-codes";
import { HttpError } from "../errors/http-error";
import { ValidationError } from "../errors/validation-error";

export async function handleErrors(
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  res.status(error?.statusCode || 500).json(
    error instanceof HttpError
      ? {
          error: error.errorCode || "internal_error",
          code: error.statusCode || 500,
          errors: error instanceof ValidationError ? error.errors : undefined,
          desc: error.description,
        }
      : { error: ErrorCodes.INTERNAL_ERROR, code: 500 }
  );
}