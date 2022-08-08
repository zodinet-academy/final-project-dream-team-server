import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserRoles } from "../constants";
import { JwtPayload } from "../modules/auth/interfaces/jwt-payload.interfact";
import { ResponseToken } from "../modules/auth/interfaces/response-token.interface";

export function getDataSuccess(status: boolean, data: any, message = null) {
  return {
    status,
    message,
    data,
    error_code: null,
  };
}

export function getDataError(
  status: boolean,
  error_code: string,
  data: any,
  message = null
) {
  return {
    status,
    message,
    data,
    error_code: error_code,
  };
}

export async function signToken(
  userId: string,
  phone: string,
  role: UserRoles
): Promise<ResponseToken> {
  const payload: JwtPayload = {
    userId,
    phone,
    role,
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
