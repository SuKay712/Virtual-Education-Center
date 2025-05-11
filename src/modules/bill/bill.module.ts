import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { Bill } from '../../entities/bill.entity';
import { Course } from '../../entities/course.entity';
import { Account } from '../../entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Course, Account])],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
