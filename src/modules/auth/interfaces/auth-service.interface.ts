export interface IAuthService {
  sendOtpLoginNormal(phone: string): Promise<boolean>;
}
