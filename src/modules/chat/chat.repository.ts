import { EntityRepository, Repository } from "typeorm";
import { MessageEntity } from "./entities/messages.entity";
import { ConversationEntity } from "./entities/conversations.entity";
import { SocketDeviceEntity } from "./entities/socket-devices.entity";

@EntityRepository(ConversationEntity)
export class ConversationRepository extends Repository<ConversationEntity> {}

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {}

@EntityRepository(SocketDeviceEntity)
export class SocketDeviceRepository extends Repository<SocketDeviceEntity> {}
