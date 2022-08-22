import { NotificationEnum } from "./../../constants/enum";
import { Injectable } from "@nestjs/common";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationsRepository } from "./notifications.repository";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) {}
  async create(
    type: NotificationEnum,
    message: string,
    receiverId: string
  ): Promise<NotificationEntity> {
    try {
      return await this.notificationsRepository.save(
        this.notificationsRepository.create({ type, message, receiverId })
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
