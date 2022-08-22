import { EntityRepository, Repository } from "typeorm";
import { NotificationEntity } from "./entities/notification.entity";

@EntityRepository(NotificationEntity)
export class NotificationsRepository extends Repository<NotificationEntity> {}
