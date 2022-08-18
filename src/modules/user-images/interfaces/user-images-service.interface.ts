import { UserImagesDto } from "../dto";

export interface IUserImagesService {
  getUserAlbum(userId: string): Promise<UserImagesDto[] | undefined>;
}
