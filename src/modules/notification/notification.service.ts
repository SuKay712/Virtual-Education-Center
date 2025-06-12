import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(userId: number, content: string): Promise<Notification> {
    const notification = this.notificationRepo.create({
      account: { id: userId },
      content,
    });
    console.log(notification);
    const savedNotification = await this.notificationRepo.save(notification);

    // Gửi thông báo realtime qua WebSocket
    this.notificationGateway.sendNotificationToUser(userId, content);

    return savedNotification;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { account: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }
}
