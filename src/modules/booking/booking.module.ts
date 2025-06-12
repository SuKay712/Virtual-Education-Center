import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, Account, Class, Notification, FreeTime } from '../../entities';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { NotificationModule } from '../notification/notification.module';
import { AccountModule } from '../account/account.module';
import { FreeTimeModule } from '../free-time/free-time.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Account, Class, Notification, FreeTime]),
    AccountModule,
    NotificationModule,
    FreeTimeModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
