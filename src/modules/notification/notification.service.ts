import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, Account } from '../../entities';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async createNotification(accountId: number, content: string): Promise<Notification> {
    const account = await this.accountRepo.findOne({
      where: { id: accountId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const notification = this.notificationRepo.create({
      account,
      content
    });

    return this.notificationRepo.save(notification);
  }

  async getNotificationsByAccountId(accountId: number): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { account: { id: accountId } },
      order: {
        created_at: 'DESC'
      }
    });
  }
}
