import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MomoPaymentService } from './momo-payment.service';
import { CurrentAccount, Lang } from '../../common';
import { Account } from '../../entities';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LoggingInterceptor } from '../../common/interceptors';
import { BillRequestDto } from '../bill/dtos/billRequestDtos';

@Controller('momo-payment')
@UseInterceptors(LoggingInterceptor)
export class MomoPaymentController {
  constructor(private momoService: MomoPaymentService) {}
  @Post('/payment')
  @UseGuards(AuthGuard)
  async createPayment(
    @Body() billRequest: BillRequestDto,
    @CurrentAccount() currentAccount: Account
  ) {
    return await this.momoService.createPayment(
      billRequest,
      currentAccount
    );
  }
  @Post('/callback')
  async callback(@Req() req: any) {
    // Truyền request từ @Req() vào service
    return this.momoService.callback(req);
  }
}
