import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeTime } from '../../entities/free_time.entity';
import { Account } from '../../entities/account.entity';
import { Booking } from '../../entities/booking.entity';
import { FreeTimeService } from './free-time.service';
import { FreeTimeController } from './free-time.controller';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FreeTime, Account, Booking]),
    AccountModule,
  ],
  controllers: [FreeTimeController],
  providers: [FreeTimeService],
  exports: [FreeTimeService],
})
export class FreeTimeModule {}
