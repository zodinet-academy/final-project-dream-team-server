import { EntityRepository, Repository } from "typeorm";
import { PhoneOtpEntity } from "./entities/phone-otp.entity";

@EntityRepository(PhoneOtpEntity)
export class PhoneOtpRepository extends Repository<PhoneOtpEntity> {}
