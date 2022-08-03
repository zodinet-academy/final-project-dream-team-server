export interface IPhoneOtpService {
  numberOfWrongOtp(phone: string): Promise<number>;
  addOneTimeWrongOtp(phone: string): void;
}
