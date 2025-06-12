import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassService } from './class.service';
import { Class, Course, Lecture, Account, Booking } from '../../entities';
import { ClassController } from './class.controller';
import { AccountModule } from '../account/account.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Course, Lecture, Account, Booking]), AccountModule, NotificationModule],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
