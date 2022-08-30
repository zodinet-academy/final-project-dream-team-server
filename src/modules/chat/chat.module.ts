import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MessageRepository, ConversationRepository } from "./chat.repository";

import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository, ConversationRepository]),
    CloudinaryModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
