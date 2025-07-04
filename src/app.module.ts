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
import { CourseModule } from './modules/course/course.module';
import { LectureModule } from './modules/lecture/lecture.module';
import { TheoryModule } from './modules/theory/theory.module';
import { ChatModule } from './modules/chat/chat.module';
import { ContactModule } from './modules/contact/contact.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';

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
    CourseModule,
    LectureModule,
    TheoryModule,
    ChatModule,
    ContactModule,
    RoadmapModule,
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
