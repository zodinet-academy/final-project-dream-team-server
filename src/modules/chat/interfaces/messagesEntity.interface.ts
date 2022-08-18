export interface IMessageEntity {
  id?: string;
  senderId: string;
  conversationId: string;
  content: string;
  image: string;
  createAt?: Date;
}
