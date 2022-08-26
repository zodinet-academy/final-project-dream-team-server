import { Injectable } from "@nestjs/common";

import { responseData } from "../../common/utils";
import { NotificationsRepository } from "./notifications.repository";
import {
  ERROR_DATA_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} from "./../../constants/code-response.constant";
import { NotificationEntity } from "./entities/notification.entity";

import { ResponseDto } from "../../common/response.dto";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto
  ): Promise<ResponseDto<NotificationEntity>> {
    try {
      const notificationEntity = await this.notificationsRepository.save(
        createNotificationDto
      );

      return responseData(notificationEntity);
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }

  async getNotificationByUserId(
    userId: string
  ): Promise<ResponseDto<NotificationEntity[] | null>> {
    try {
      const notificationEntity = await this.notificationsRepository.find({
        where: { receiverId: userId },
      });

      if (notificationEntity.length === 0) {
        return responseData(
          null,
          "Not Found Notification",
          ERROR_DATA_NOT_FOUND
        );
      }

      return responseData(notificationEntity);
    } catch (error) {
      return responseData(null, error.message, ERROR_INTERNAL_SERVER);
    }
  }
}
