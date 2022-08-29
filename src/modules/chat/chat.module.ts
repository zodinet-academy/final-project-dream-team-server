import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  MessageRepository,
  ConversationRepository,
  SocketDeviceRepository,
} from "./chat.repository";

import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      ConversationRepository,
      SocketDeviceRepository,
    ]),
    CloudinaryModule,
    UsersModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
