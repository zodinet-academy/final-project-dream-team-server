import { IFriendNearUser, IOrigin } from "./user-location-entity.interface";
export interface IUserLocationsRepository {
  getFriendNearUser(
    radius: number,
    origin: IOrigin,
    blockedUsers: string[]
  ): Promise<IFriendNearUser[]>;
}
