import { NotificationEnum } from "../../../constants/enum";

export interface INotificationEntity {
  id?: string;
  type?: NotificationEnum;
  message?: string;
  isRead?: boolean;
  receiverId?: string;
  createAt?: Date;
}
