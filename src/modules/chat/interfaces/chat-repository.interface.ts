export interface IConversationMessage {
  conversationId: string;
  friendId: string;
  name: string;
  avatar: string;
  content: string;
  createAt: Date;
  senderId: string;
}

export interface IMessage {
  messageId: string;
  senderId: string;
  content: string;
  image?: string;
  createAt: Date;
}

export interface IConversation {
  id: string;
  messages: IMessage[];
}

export interface IChatRepository {
  getConversationsByUserId(userId: string): Promise<IConversationMessage[]>;
  getMessagesByConversationId(conversationId: string): Promise<IMessage[]>;
}
