import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { GetUser } from "../auth/decorator";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../auth/guards";
import {
  GetByConversationIdDto,
  GetConversationByUserIdAndFriendIdDto,
} from "./dto";

@Controller("secure/chat")
@ApiTags("chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/conversations")
  @ApiResponse({ status: 200, description: "List User Friend" })
  @ApiResponse({ status: 204, description: "User Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getConversations(@GetUser("id") userId: string) {
    return await this.chatService.getConversationByUserId(userId);
  }

  @Get("/conversations/:friendId")
  @ApiResponse({ status: 200, description: "Conversation Info" })
  @ApiResponse({ status: 204, description: "Conversation Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getConversation(
    @GetUser("id") userId: string,
    @Param() dto: GetConversationByUserIdAndFriendIdDto
  ) {
    return await this.chatService.getConversationByUserIdAndFriendId(
      userId,
      dto.friendId
    );
  }

  @Get("/message/:conversationId")
  @ApiResponse({ status: 200, description: "List Message" })
  @ApiResponse({ status: 204, description: "Conversation Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getMessage(@Param() dto: GetByConversationIdDto) {
    return await this.chatService.getMessagesByConversationId(
      dto.conversationId
    );
  }
}
