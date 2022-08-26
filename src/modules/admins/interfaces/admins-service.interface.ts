import { CreateAdminsDto } from "./../dto/create-admins.dto";
import { ResponseDto } from "./../../../common/response.dto";
import { IAdminEntity } from "./admins-entity.interface";
import { UpdateAdminsDto } from "../dto/update-admins.dto";
import { AdminLoginDto } from "../../auth/dto/admin-login.dto";
export interface IAdminsService {
  create(
    CreateAdminsDto: CreateAdminsDto
  ): Promise<ResponseDto<IAdminEntity | string>>;
  findAll(): Promise<ResponseDto<IAdminEntity[] | string>>;
  findOne(id: string): Promise<ResponseDto<IAdminEntity | undefined | string>>;
  update(
    id: string,
    updateAdminsDto: UpdateAdminsDto
  ): Promise<ResponseDto<IAdminEntity | string>>;
  remove(id: string): Promise<ResponseDto<string>>;
  findByUsernameAndPassword(
    adminLoginDto: AdminLoginDto
  ): Promise<IAdminEntity | undefined>;
}
