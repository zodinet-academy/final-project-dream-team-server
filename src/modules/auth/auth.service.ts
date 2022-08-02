import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { InjectRepository } from "@nestjs/typeorm";
import { hashPassword } from "src/common/helper/hash.helper";
import { UserEntity } from "../users/entities/user.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {}
