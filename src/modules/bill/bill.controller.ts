import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { BillRequestDto } from './dtos/billRequestDtos';
import { Account } from '../../entities/account.entity';
import { CurrentAccount } from '../../common/decorator/currentAccount.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createBill(
    @CurrentAccount() account: Account,
    @Body() billRequest: BillRequestDto,
  ) {
    return this.billService.createBill(account, billRequest);
  }
}
