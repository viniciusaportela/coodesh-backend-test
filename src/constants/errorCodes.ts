export enum ErrorCodes {
  INTERNAL_ERROR = 'internal_error',
  MISSING_FIELD = 'missing_field',
  ALREADY_EXISTS = 'already_exists',
  NOT_FOUND = 'not_found',
  VALIDATION_ERROR = 'validation_error',

  SHOULD_BE_STRING = 'should_be_string',

  INVALID_EMAIL = 'invalid_email'
}

export enum ErrorNumberCodes {
  INTERNAL_ERROR = 500,
  NOT_FOUND = 404,
}