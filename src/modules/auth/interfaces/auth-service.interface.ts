import { ResponseDto } from "../../../common/response.dto";

export interface IAuthService {
  sendOtpLoginNormal(phone: string): Promise<ResponseDto<string>>;
}
