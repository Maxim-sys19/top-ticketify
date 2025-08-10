import {ErrorCode} from "./error_codes";

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.FETCH_ERROR]: 'Failed to fetch data...',
  [ErrorCode.UNAUTHORIZED]: 'Please login again',
  [ErrorCode.BAD_REQUEST]: 'Invalid request. Please check your data',
  [ErrorCode.NOT_FOUND]: 'Not found',
}

export {ERROR_MESSAGES}