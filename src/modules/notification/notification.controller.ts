import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(@Request() req) {
    const account = req.currentAccount;
    return this.notificationService.getNotificationsByUserId(account.id);
  }
}
