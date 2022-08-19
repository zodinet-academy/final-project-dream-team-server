import { Injectable } from "@nestjs/common";
import { CreateUserBlockDto } from "./dto/create-user-block.dto";
import { UpdateUserBlockDto } from "./dto/update-user-block.dto";

@Injectable()
export class UserBlocksService {
  create(createUserBlockDto: CreateUserBlockDto) {
    return "This action adds a new userBlock";
  }

  findAll() {
    return `This action returns all userBlocks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userBlock`;
  }

  update(id: number, updateUserBlockDto: UpdateUserBlockDto) {
    return `This action updates a #${id} userBlock`;
  }

  remove(id: number) {
    return `This action removes a #${id} userBlock`;
  }
}
