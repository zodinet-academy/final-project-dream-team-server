import { NotificationEntity } from "../entities/notification.entity";

import { ResponseDto } from "../../../common/response.dto";
import { CreateNotificationDto } from "../dto";

export interface INotificationService {
  create(
    createNotificationDto: CreateNotificationDto
  ): Promise<ResponseDto<NotificationEntity | null>>;

  getNotificationByUserId(
    userId: string
  ): Promise<ResponseDto<NotificationEntity[] | null>>;
}
