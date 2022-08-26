import { GetUserHobbiesDto } from "../dto";

export interface IUserHobbiesService {
  getUserHobbies(userId: string): Promise<GetUserHobbiesDto[]>;
}
