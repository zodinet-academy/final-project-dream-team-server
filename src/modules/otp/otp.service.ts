import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { Twilio } from "twilio";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import {
  ERROR_DATA_NOT_FOUND,
  ERROR_USER_NOT_FOUND,
} from "../../constants/code-response.constant";
import { OtpStatusEnum, UserRolesEnum } from "../../constants/enum";
import { IJwtPayloadDreamteam } from "../auth/interfaces/jwt-payload.interface";
import { PhoneOtpService } from "../phone-otp/phone-otp.service";
import { UserEntity } from "../users/entities/user.entity";
import { UsersRepository } from "../users/users.repository";
import { IOtpService } from "./interfaces/otp-service.interface";

@Injectable()
export class OtpService implements IOtpService {
  private twilioClient: Twilio;
  constructor(
    private readonly configService: ConfigService,
    private phoneOtpService: PhoneOtpService,
    private jwtService: JwtService,
    private readonly usersRepository: UsersRepository
  ) {
    const accountSid = configService.get("TWILIO_ACCOUNT_SID");
    const authToken = configService.get("TWILIO_AUTH_TOKEN");

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendSmsOtp(phoneNumber: string): Promise<ResponseDto<string>> {
    const isValidPhone = isValidPhoneNumber(phoneNumber, "VN");

    if (!isValidPhone)
      return responseData(
        null,
        null,
        "PHONE_NOT_CORRECT_FORM"
      ) as ResponseDto<string>;

    const phone = parsePhoneNumber(phoneNumber, "VN");

    const isValidSendOtp = await this.phoneOtpService.isValidToSendOTP(
      "0" + phone.nationalNumber
    );

    if (!isValidSendOtp)
      return responseData(
        null,
        "PLEASE_TRY_AGAIN_AFTER_5_MINUES",
        "SEND_OTP_ERROR"
      ) as ResponseDto<string>;

    if (process.env.NODE_ENV === "local") {
      return responseData("Please fill otp default") as ResponseDto<string>;
    }

    const serviceSid = this.configService.get(
      "TWILIO_VERIFICATION_SERVICE_SID"
    );
    try {
      const response = await this.twilioClient.verify
        .services(serviceSid)
        .verifications.create({
          to: phone.number,
          channel: "sms",
        });

      if (response && response.status === OtpStatusEnum.PENDING) {
        return responseData(null, "Send OTP Successful") as ResponseDto<string>;
      }
    } catch (error) {
      console.log(error);
      return responseData(
        null,
        "PLEASE_TRY_AGAIN_A_FEW_MINUTES",
        "SEND_OTP_ERROR"
      ) as ResponseDto<string>;
    }
  }

  async confirmOtp(
    phoneNumber: string,
    code: string
  ): Promise<ResponseDto<string | boolean | null>> {
    const isValid = isValidPhoneNumber(phoneNumber, "VN");
    if (!isValid)
      return responseData(
        null,
        "Phone not correct form.",
        "PHONE_NOT_CORRECT_FORM"
      ) as ResponseDto<string>;

    const phone = parsePhoneNumber(phoneNumber, "VN");

    if (process.env.NODE_ENV === "local") {
      if (process.env.OTP_DEFAULT === code) {
        const isExistWithPhone = await this.userExistedByPhone(
          "0" + phone.nationalNumber
        );

        // If DB Have User Return Token
        if (isExistWithPhone?.name) {
          const payLoad: IJwtPayloadDreamteam = {
            id: isExistWithPhone.id,
            role: UserRolesEnum.USER,
            phone: isExistWithPhone.phone,
          };

          const token = this.jwtService.sign(payLoad);
          return responseData(token, "Verify OTP success");
        }

        await this.usersRepository.save({
          phone: "0" + phone.nationalNumber,
          isVerify: true,
        });
        return responseData(null, "Verify OTP success") as ResponseDto<string>;
      }

      const timesLimit = this.configService.get("TIME_LIMIT");
      const countTimesWrongOtp = await this.phoneOtpService.numberOfWrongOtp(
        "0" + phone.nationalNumber
      );

      if (countTimesWrongOtp + 1 >= timesLimit) {
        return responseData(
          null,
          "EXCEED_TIMES_WRONG_OTP",
          "EXCEED_TIMES_WRONG_OTP"
        );
      }

      await this.phoneOtpService.addOneTimeWrongOtp("0" + phone.nationalNumber);

      return responseData(
        null,
        "OTP_NOT_VALID",
        "OTP_NOT_VALID"
      ) as ResponseDto<string>;
    }
    const serviceSid = this.configService.get(
      "TWILIO_VERIFICATION_SERVICE_SID"
    );

    try {
      const result = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: phone.number,
          code: code,
        });

      if (!result.valid || result.status !== OtpStatusEnum.APPROVED) {
        const timesLimit = this.configService.get("TIME_LIMIT");
        const countTimesWrongOtp = await this.phoneOtpService.numberOfWrongOtp(
          "0" + phone.nationalNumber
        );

        if (countTimesWrongOtp + 1 >= timesLimit) {
          return responseData(
            null,
            "EXCEED_TIMES_WRONG_OTP",
            "EXCEED_TIMES_WRONG_OTP"
          );
        }

        await this.phoneOtpService.addOneTimeWrongOtp(
          "0" + phone.nationalNumber
        );

        return responseData(
          null,
          "OTP_NOT_VALID",
          "OTP_NOT_VALID"
        ) as ResponseDto<string>;
      }
    } catch (error) {
      console.log(error);
      return responseData(
        null,
        "NO_OTP_FOR_THIS_PHONE",
        "NO_OTP_FOR_THIS_PHONE"
      ) as ResponseDto<string>;
    }

    const isExistWithPhone = await this.userExistedByPhone(
      "0" + phone.nationalNumber
    );

    // If DB Have User Return Token

    if (isExistWithPhone?.name) {
      const payLoad: IJwtPayloadDreamteam = {
        id: isExistWithPhone.id,
        role: UserRolesEnum.USER,
        phone: isExistWithPhone.phone,
      };
      const token = this.jwtService.sign(payLoad);
      return responseData(token, "Verify OTP success");
    }

    await this.usersRepository.save({
      phone: "0" + phone.nationalNumber,
      isVerify: true,
    });
    return responseData(null, "Verify OTP success");
  }

  async confirmOtpWithSocial(
    phoneNumber: string,
    code: string,
    email: string
  ): Promise<ResponseDto<string | boolean | null>> {
    const isValid = isValidPhoneNumber(phoneNumber, "VN");
    if (!isValid)
      return responseData(
        null,
        "PHONE_NOT_CORRECT_FORM",
        "PHONE_NOT_CORRECT_FORM"
      ) as ResponseDto<string>;

    const phone = parsePhoneNumber(phoneNumber, "VN");

    if (process.env.NODE_ENV === "local") {
      if (process.env.OTP_DEFAULT === code) {
        const isExistWithPhone = await this.userExistedByPhone(
          "0" + phone.nationalNumber
        );
        if (isExistWithPhone) {
          if (isExistWithPhone?.email !== email) {
            return responseData(
              null,
              "THIS_PHONE_NUMBER_IS_EXISTED",
              "THIS_PHONE_NUMBER_IS_EXISTED"
            );
          }
        }

        // If User Login With Social

        const userExistedByEmail = await this.userExistedByEmail(email);

        if (!userExistedByEmail) {
          return responseData(null, null, ERROR_DATA_NOT_FOUND);
        }
        const payLoad: IJwtPayloadDreamteam = {
          id: userExistedByEmail.id,
          role: UserRolesEnum.USER,
          phone: userExistedByEmail.phone,
        };
        const token = this.jwtService.sign(payLoad);
        if (!userExistedByEmail?.isVerify) {
          await this.usersRepository.save({
            ...userExistedByEmail,
            phone: "0" + phone.nationalNumber,
            isVerify: true,
          });
        }
        return responseData(token, "Verify OTP success");
      }

      const timesLimit = this.configService.get("TIME_LIMIT");
      const countTimesWrongOtp = await this.phoneOtpService.numberOfWrongOtp(
        "0" + phone.nationalNumber
      );

      if (countTimesWrongOtp + 1 >= timesLimit) {
        return responseData(
          null,
          "EXCEED_TIMES_WRONG_OTP",
          "EXCEED_TIMES_WRONG_OTP"
        );
      }

      await this.phoneOtpService.addOneTimeWrongOtp("0" + phone.nationalNumber);

      return responseData(
        null,
        "OTP_NOT_VALID",
        "OTP_NOT_VALID"
      ) as ResponseDto<string>;
    }
    const serviceSid = this.configService.get(
      "TWILIO_VERIFICATION_SERVICE_SID"
    );

    try {
      const result = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: phone.number,
          code: code,
        });

      if (!result.valid || result.status !== OtpStatusEnum.APPROVED) {
        const timesLimit = this.configService.get("TIME_LIMIT");
        const countTimesWrongOtp = await this.phoneOtpService.numberOfWrongOtp(
          "0" + phone.nationalNumber
        );

        if (countTimesWrongOtp + 1 >= timesLimit) {
          return responseData(
            null,
            "EXCEED_TIMES_WRONG_OTP",
            "EXCEED_TIMES_WRONG_OTP"
          );
        }

        await this.phoneOtpService.addOneTimeWrongOtp(
          "0" + phone.nationalNumber
        );

        return responseData(
          null,
          "OTP_NOT_VALID",
          "OTP_NOT_VALID"
        ) as ResponseDto<string>;
      }
    } catch (error) {
      console.log(error);
      return responseData(
        null,
        "NO_OTP_FOR_THIS_PHONE",
        "NO_OTP_FOR_THIS_PHONE"
      ) as ResponseDto<string>;
    }

    const isExistWithPhone = await this.userExistedByPhone(
      "0" + phone.nationalNumber
    );
    if (isExistWithPhone) {
      if (isExistWithPhone?.email !== email) {
        return responseData(
          null,
          null,
          "This_Phone_Number_Is_Existed_Please_Sign_In_With_Phone_number"
        );
      }
    }

    // If DB Have User Return Token
    const userExistedByEmail = await this.userExistedByEmail(email);

    if (!userExistedByEmail) {
      return responseData(null, null, ERROR_DATA_NOT_FOUND);
    }
    const payLoad: IJwtPayloadDreamteam = {
      id: userExistedByEmail.id,
      role: UserRolesEnum.USER,
      phone: userExistedByEmail.phone,
    };
    const token = this.jwtService.sign(payLoad);
    if (isExistWithPhone?.email === email) {
      return responseData(token, "Verify OTP success");
    }

    if (!userExistedByEmail?.isVerify) {
      await this.usersRepository.save({
        ...userExistedByEmail,
        phone: "0" + phone.nationalNumber,
        isVerify: true,
      });

      return responseData(token, "Verify OTP success");
    }

    await this.usersRepository.save({
      phone: "0" + phone.nationalNumber,
      isVerify: true,
    });
    return responseData(true, "Verify OTP success");
  }

  async userExistedByEmail(email: string): Promise<UserEntity | undefined> {
    const userExisted = await this.usersRepository.findOne({
      where: { email },
    });
    if (!userExisted) return;
    return userExisted;
  }
  async userExistedByPhone(phone: string): Promise<UserEntity | undefined> {
    const userExisted = await this.usersRepository.findOne({
      where: { phone },
    });
    if (!userExisted) return;
    return userExisted;
  }

  async checkUserVerified(email: string) {
    const userVerified = await this.userExistedByEmail(email);
    if (!userVerified?.isVerify) {
      return responseData(null, null, ERROR_USER_NOT_FOUND);
    }
    const isSendOTP = await this.sendSmsOtp(userVerified.phone);
    if (!isSendOTP.status) return isSendOTP;
    return responseData(userVerified.phone, "Send OTP Success");
  }
}
