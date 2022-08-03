import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CodeStatus } from "src/constants";
import { JwtPayload } from "src/modules/auth/interfaces/jwt-payload.interfact";
import { ResponseToken } from "src/modules/auth/interfaces/response-token.interface";

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

export async function signToken(
  userId: string,
  phone: string
): Promise<ResponseToken> {
  const payload: JwtPayload = {
    userId,
    phone,
  };
  const config = new ConfigService();
  const jwt = new JwtService();

  const secret = config.get("JWT_SECRET");

  const token = await jwt.signAsync(payload, {
    expiresIn: config.get("JWT_EXPIRATION_TIME"),
    secret: secret,
  });

  const result: ResponseToken = { token };
  return result;
}
