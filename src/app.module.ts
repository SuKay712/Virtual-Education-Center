import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './common/config/database.config.module';
import { AccountModule } from './modules/account/account.module';
import { CloudinaryConfig } from './common/config/cloudinary.config';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from './modules/booking/booking.module';
@Module({
  imports: [AuthModule, DatabaseModule, AccountModule, BookingModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    AppService,
    CloudinaryConfig,
  ],
  exports: [CloudinaryConfig],
})
export class AppModule {}
