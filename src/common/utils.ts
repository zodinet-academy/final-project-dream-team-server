import { CodeStatus } from "src/constants";

/**
 * This function format data json
 * @param message
 * @param data
 */
export function getDataSuccess(code: CodeStatus, data: any, message = null) {
  return {
    code,
    message,
    data,
    error: null,
  };
}

/**
 * This function format data json
 * @param message
 * @param data
 * @param result_code
 */
export function getDataError(
  code: CodeStatus,
  error_code: string,
  message = null,
  data: any
) {
  return {
    code,
    message,
    data,
    error: error_code,
  };
}
