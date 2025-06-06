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
  Class,
  Course,
} from '../../entities';
import { MomoPaymentController } from './momo-payment.controller';
import { MomoPaymentService } from './momo-payment.service';
import { AccountModule } from '../account/account.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { ClassModule } from '../class/class.module';
import { BillModule } from '../bill/bill.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      Account,
      Booking,
      Course,
      Class,
    ]),
    ConfigModule,
    AccountModule,
    ClassModule,
    BillModule,
  ],
  controllers: [MomoPaymentController],
  providers: [
    AuthGuard,
    AccountService,
    MomoPaymentService,
    CloudinaryConfig,
  ],
  exports: [MomoPaymentService],
})
export class PaymentModule {}
