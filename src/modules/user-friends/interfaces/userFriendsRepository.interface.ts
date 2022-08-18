export interface IInfoFriendUser {
  id: string;
  name: string;
  avatar: string;
}

export interface IInfoFriend {
  id: string;
  name: string;
  avatar: string;
  createAt: Date;
}

export interface IUserFriendsRepository {
  getUserFriendsByUserId(userId: string): Promise<IInfoFriendUser[]>;
  getFriendByFriendIdAndFriendId(
    userId: string,
    friendId: string
  ): Promise<IInfoFriend>;
}
