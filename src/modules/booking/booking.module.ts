import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, Account, Class } from '../../entities';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { NotificationModule } from '../notification/notification.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Account, Class]),
    NotificationModule,
    AccountModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
