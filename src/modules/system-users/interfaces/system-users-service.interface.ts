import { CreateSystemUserDto } from "./../dto/create-system-user.dto";
import { ResponseDto } from "./../../../common/response.dto";
import { ISystemUserEntity } from "./system-user-entity.interface";
import { UpdateSystemUserDto } from "../dto/update-system-user.dto";
import { AdminLoginDto } from "../../auth/dto/admin-login.dto";
export interface ISystemUsersService {
  create(
    createSystemUserDto: CreateSystemUserDto
  ): Promise<ResponseDto<ISystemUserEntity | string>>;
  findAll(): Promise<ResponseDto<ISystemUserEntity[] | string>>;
  findOne(
    id: string
  ): Promise<ResponseDto<ISystemUserEntity | undefined | string>>;
  update(
    id: string,
    updateSystemUserDto: UpdateSystemUserDto
  ): Promise<ResponseDto<ISystemUserEntity | string>>;
  remove(id: string): Promise<ResponseDto<string>>;
  findByUsernameAndPassword(
    adminLoginDto: AdminLoginDto
  ): Promise<ISystemUserEntity | undefined>;
}
