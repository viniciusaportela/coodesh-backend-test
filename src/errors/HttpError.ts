import { ErrorCodes, ErrorNumberCodes } from "../constants/errorCodes";

export class HttpError extends Error {
  public statusCode: ErrorNumberCodes;
  public errorCode: ErrorCodes;
  public description?: string;

  constructor() {
    super("A HttpError ocurred");
    this.name = "HttpError";

    // Recommended by Typescript
    // @see https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}