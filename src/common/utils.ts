import { CodeStatus } from "../constants/codeStatus.enum";

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
  data: any,
  message = null
) {
  return {
    code,
    message,
    data,
    error: error_code,
  };
}
