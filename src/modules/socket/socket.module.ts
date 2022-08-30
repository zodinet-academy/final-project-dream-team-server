import { Module } from "@nestjs/common";

import { SocketGateway } from "./socket.gateway";

import { ChatModule } from "./../chat/chat.module";
import { CloudinaryModule } from "./../cloudinary/cloudinary.module";
import { NotificationsModule } from "./../notifications/notifications.module";

@Module({
  imports: [CloudinaryModule, ChatModule, NotificationsModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
