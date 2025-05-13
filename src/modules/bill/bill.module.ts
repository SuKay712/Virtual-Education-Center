import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Bill, Course } from '../../entities';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, Course, Account]),
    AccountModule,
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
