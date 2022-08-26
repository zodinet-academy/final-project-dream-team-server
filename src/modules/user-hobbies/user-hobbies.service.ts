import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ResponseDto } from "../../common/response.dto";
import { responseData } from "../../common/utils";
import {
  ERROR_CAN_NOT_DELETE_HOBBY,
  ERROR_CAN_NOT_GET_USER_HOBBIES,
  ERROR_HOBBY_NAME_ALREADY_EXISTED,
  ERROR_HOBBY_NOT_FOUND,
  ERROR_UNKNOWN,
  ERROR_USER_NOT_MATCH_WITH_HOBBY,
} from "../../constants/code-response.constant";
import { GetUserHobbiesDto } from "./dto";
import { UserHobbyEntity } from "./entities/user-hobbies.entity";
import { IUserHobbiesService } from "./interfaces";
import { UserHobbiesRepository } from "./user-hobbies.repository";

@Injectable()
export class UserHobbiesService implements IUserHobbiesService {
  constructor(
    private readonly userHobbiesRepository: UserHobbiesRepository,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async getUserHobbies(userId: string): Promise<GetUserHobbiesDto[]> {
    const hobbies = await this.userHobbiesRepository.find({ userId: userId });
    if (!hobbies) return undefined;

    const userHobbies = this.mapper.mapArray(
      hobbies,
      UserHobbyEntity,
      GetUserHobbiesDto
    );

    return userHobbies;
  }

  async createUserHobby(
    userId: string,
    name: string
  ): Promise<ResponseDto<GetUserHobbiesDto | string>> {
    try {
      const hobbies = await this.getUserHobbies(userId);
      if (!hobbies)
        return responseData(
          null,
          "Can not get user hobbies",
          ERROR_CAN_NOT_GET_USER_HOBBIES
        );

      for (let i = 0; i < hobbies.length; i++) {
        if (hobbies[i].name.toLowerCase() === name.toLowerCase())
          return responseData(
            "",
            "Hobby name already existed.",
            ERROR_HOBBY_NAME_ALREADY_EXISTED
          );
      }

      const res = await this.userHobbiesRepository.save(
        this.userHobbiesRepository.create({
          userId: userId,
          name: name,
        })
      );

      const result: GetUserHobbiesDto = {
        id: res.id,
        name: res.name,
      };

      return responseData(result, "");
    } catch (error) {
      console.log(error);
      return responseData("", "error_unknown", ERROR_UNKNOWN);
    }
  }

  async deleteUserHobby(userId: string, id: string) {
    try {
      const hobby = await this.userHobbiesRepository.findOne({ id: id });
      if (!hobby)
        return responseData("", "hobby_not_found", ERROR_HOBBY_NOT_FOUND);

      if (hobby.userId !== userId)
        return responseData(
          "",
          "User not match with hobby",
          ERROR_USER_NOT_MATCH_WITH_HOBBY
        );
      const { affected } = await this.userHobbiesRepository.delete({ id: id });
      if (affected <= 0)
        return responseData(
          "",
          "can_not_delete_hobby",
          ERROR_CAN_NOT_DELETE_HOBBY
        );
      return responseData(id, "Delete hobby success");
    } catch (error) {
      console.log(error);
      return responseData("", "error_unknown", ERROR_UNKNOWN);
    }
  }

  async deleteUserHobbies(userId: string): Promise<ResponseDto<string>> {
    try {
      const hobbies = await this.userHobbiesRepository.find({ userId: userId });
      if (!hobbies)
        return responseData(
          null,
          "Can not get user hobbies",
          ERROR_CAN_NOT_GET_USER_HOBBIES
        );

      for (let i = 0; i < hobbies.length; i++) {
        await this.userHobbiesRepository.delete({
          id: hobbies[i].id,
        });
      }

      return responseData(null, "Delete user hobbies success.");
    } catch (error) {
      return responseData("", "Can not delete user hobbies", ERROR_UNKNOWN);
    }
  }
}
