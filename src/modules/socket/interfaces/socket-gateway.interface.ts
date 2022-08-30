import { ResponseDto } from "../../../common/response.dto";
import { ConversationEntity } from "../../chat/entities/conversations.entity";

export interface ISocketGateway {
  createConversation(
    userId: string,
    friendId: string
  ): Promise<ResponseDto<ConversationEntity | null>>;
}
