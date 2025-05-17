import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Bill, Class, Course } from '../../entities';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { AccountModule } from '../account/account.module';
import { ClassModule } from '../class/class.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, Course, Account, Class]),
    AccountModule,
    ClassModule,
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
