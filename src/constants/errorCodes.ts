export enum ErrorCodes {
  INTERNAL_ERROR = 'internal_error',
  MISSING_FIELD = 'missing_field',
  ALREADY_EXISTS = 'already_exists',
  NOT_FOUND = 'not_found',
  VALIDATION_ERROR = 'validation_error',
  PASSED_MAX_PAGINATION_LIMIT = 'passed_max_pagination_limit',

  SHOULD_BE_STRING = 'should_be_string',
  SHOULD_BE_BOOLEAN = 'should_be_boolean',
  EXCEED_MAX_LENGTH = 'exceed_max_length',

  INVALID_URL = 'invalid_url',
  INVALID_DATE = 'invalid_date',
  INVALID_UUID = 'invalid_uuid'
}

export enum ErrorNumberCodes {
  INTERNAL_ERROR = 500,
  NOT_FOUND = 404,
}