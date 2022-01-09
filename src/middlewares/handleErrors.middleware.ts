import { Request, Response } from "express";
import { ErrorCodes } from "../constants/errorCodes";
import { HttpError } from "../errors/HttpError";
import { ValidationError } from "../errors/ValidationError";

export async function handleErrors(
  err: any,
  _: Request,
  res: Response
) {
  console.error(err);

  res.status(err.statusCode || 500).json(
    err instanceof HttpError
      ? {
          error: err.errorCode || "internal_error",
          code: err.statusCode || 500,
          field: err instanceof ValidationError ? err.field : undefined,
          desc: err.description,
        }
      : { error: ErrorCodes.INTERNAL_ERROR, code: 500 }
  );
}