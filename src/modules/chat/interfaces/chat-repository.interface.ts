export interface IConversationMessage {
  conversationId: string;
  friendId: string;
  name: string;
  avatar: string;
  content: string;
  createAt: Date;
}

export interface IUserFriend {
  userId: string;
  name: string;
  avatar: string;
  createAt: Date;
}

export interface IMessage {
  messageId: string;
  senderId: string;
  content: string;
  image?: string;
  createAt: Date;
}

export interface IChatRepository {
  getConversationsByUserId(userId: string): Promise<IConversationMessage[]>;
  getFriendByConversationId(conversationId: string): Promise<IUserFriend>;
  getMessagesByConversationId(conversationId: string): Promise<IMessage[]>;
}
