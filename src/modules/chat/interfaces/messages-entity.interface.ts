export interface IMessageEntity {
  id?: string;
  sender_id: string;
  conversation_id: string;
  content: string;
  image: string;
  createAt?: Date;
}
