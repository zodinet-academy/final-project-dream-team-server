export interface IOtpService {
  sendSmsOtp(phone: string): Promise<boolean>;
  confirmOtp(phone: string, code: string): Promise<boolean>;
}
