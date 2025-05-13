import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Req,
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

  @Get()
  @UseGuards(AuthGuard)
  async getBills(@Req() req) {
    return this.billService.getBillsByAccountId(req.currentAccount.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getBillById(@Param('id') id: number) {
    return this.billService.getBillById(id);
  }
}
