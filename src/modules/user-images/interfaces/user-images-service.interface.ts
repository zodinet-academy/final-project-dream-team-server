import { UserImagesDto } from "../dto";

export interface IUserImagesService {
  getUserAlbum(
    userId: string,
    isOnlyFavoriteImages: boolean
  ): Promise<UserImagesDto[] | undefined>;
}
