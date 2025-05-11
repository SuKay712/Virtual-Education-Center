import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtMiddleware } from '../../common';
import { AccountService } from '../account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  Bill,
  Booking,
  Course,
} from '../../entities';
import { BillService } from '../bill/bill.service';
import { MomoPaymentController } from './momo-payment.controller';
import { MomoPaymentService } from './momo-payment.service';
import { AccountModule } from '../account/account.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      Account,
      Booking,
      Course,
    ]),
    ConfigModule,
    AccountModule,
  ],
  controllers: [MomoPaymentController],
  providers: [
    AuthGuard,
    AccountService,
    BillService,
    MomoPaymentService,
    CloudinaryConfig,
  ],
  exports: [MomoPaymentService],
})
export class PaymentModule {}
