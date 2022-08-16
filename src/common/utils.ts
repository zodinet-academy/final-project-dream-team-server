import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { UserRolesEnum } from "../constants/enum";

import { JwtPayload } from "../modules/auth/interfaces/jwt-payload.interface";
import { ResponseToken } from "../modules/auth/interfaces/response-token.interface";

import { ResponseDto } from "./response.dto";

export function responseData<T>(
  data: T,
  message = null,
  error_code?: string | number
): ResponseDto<T> {
  return {
    status: error_code ? false : true,
    message,
    data,
    error_code,
  };
}

export async function signToken(
  userId: string,
  phone: string,
  role: UserRolesEnum
): Promise<ResponseToken> {
  const payload = {
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
