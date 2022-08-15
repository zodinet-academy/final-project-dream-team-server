import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  MessageRepository,
  ConversationRepository,
  SocketDeviceRepository,
} from "./chat.repository";

import { UsersModule } from "../users/users.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      ConversationRepository,
      SocketDeviceRepository,
    ]),
    UsersModule,
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
