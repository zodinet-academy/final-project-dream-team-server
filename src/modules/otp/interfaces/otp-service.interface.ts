import { ResponseDto } from "../../../common/response.dto";

export interface IOtpService {
  sendSmsOtp(phone: string): Promise<ResponseDto<string>>;
  confirmOtp(phone: string, code: string): Promise<ResponseDto<string>>;
}
