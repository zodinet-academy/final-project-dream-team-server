import { getDataError } from "src/common/utils";
import { getDataSuccess } from "src/common/utils";
import { UserRepository } from "./user.repository";
import { IUserService } from "./interfaces/user-service.interface";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { ResponseDto } from "../../common/response.dto";
import { CodeStatus } from "../../constants";

@Injectable()
export class UsersService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findById(id: string): Promise<ResponseDto<UserEntity>> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user)
        return getDataError(
          CodeStatus.NotFountException,
          "ERROR_USER_NOT_FOUND",
          null
        );
      return getDataSuccess(CodeStatus.Success, user);
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "error_unknow",
        error
      );
    }
  }
  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  async findByEmail(email: string): Promise<ResponseDto<UserEntity>> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      if (!user)
        return getDataError(
          CodeStatus.NotFountException,
          "ERROR_USER_NOT_FOUND",
          null
        );
      return getDataSuccess(CodeStatus.Success, user);
    } catch (error) {
      return getDataError(
        CodeStatus.InternalServerError,
        "error_unknow",
        error
      );
    }
  }
}
