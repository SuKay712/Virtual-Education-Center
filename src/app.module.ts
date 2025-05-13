import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './common/config/database.config.module';
import { AccountModule } from './modules/account/account.module';
import { CloudinaryConfig } from './common/config/cloudinary.config';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from './modules/booking/booking.module';
import { FreeTimeModule } from './modules/free-time/free-time.module';
import { PaymentModule } from './modules/payment/payment.module';
import { BillModule } from './modules/bill/bill.module';
import { ClassModule } from './modules/class/class.module';
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    AccountModule,
    BookingModule,
    FreeTimeModule,
    PaymentModule,
    BillModule,
    ClassModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CloudinaryConfig,
  ],
  exports: [CloudinaryConfig],
})
export class AppModule {}
