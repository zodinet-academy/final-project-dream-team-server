export interface IUserFriendsEntity {
  id?: string;
  userId: string;
  friendId: string;
  status: string;
  createAt?: Date;
  updateAt?: Date;
}
