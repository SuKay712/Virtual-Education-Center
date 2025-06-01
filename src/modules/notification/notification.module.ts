import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification, Account } from '../../entities';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Account])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
