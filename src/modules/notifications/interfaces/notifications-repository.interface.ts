import { CommonRepository } from "../../../common/repository";
import { NotificationEntity } from "../entities/notification.entity";

export interface INotificationsRepository
  extends CommonRepository<NotificationEntity> {
  getListFriends(id: string): Promise<string[]>;
}
