import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards";
import { ChatService } from "./chat.service";
import {
  GetConversationsByUserId,
  GetByConversationIdDto,
  GetConversationByUserIdAndFriendIdDto,
} from "./dto";

@Controller("chat")
@ApiTags("chat")
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/conversations")
  @ApiResponse({ status: 200, description: "Conversation Info" })
  @ApiResponse({ status: 204, description: "Conversation Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getConversation(@Query() dto: GetConversationByUserIdAndFriendIdDto) {
    return await this.chatService.getConversationByUserIdAndFriendId(
      dto.userId,
      dto.friendId
    );
  }

  @Get("/conversations/:userId")
  @ApiResponse({ status: 200, description: "List User Friend" })
  @ApiResponse({ status: 204, description: "User Not Found" })
  @ApiResponse({ status: 400, description: "Bad Requests" })
  @ApiResponse({ status: 500, description: "Server Error" })
  async getConversations(@Param() dto: GetConversationsByUserId) {
    return await this.chatService.getConversationByUserId(dto.userId);
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
