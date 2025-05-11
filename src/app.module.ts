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

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    AccountModule,
    BookingModule,
    FreeTimeModule,
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
