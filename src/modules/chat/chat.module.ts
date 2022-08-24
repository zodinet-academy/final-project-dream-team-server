import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  MessageRepository,
  ConversationRepository,
  SocketDeviceRepository,
} from "./chat.repository";

import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      ConversationRepository,
      SocketDeviceRepository,
    ]),
    CloudinaryModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
