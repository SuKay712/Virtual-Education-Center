import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Booking, Course } from '../../entities';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Booking, Course])],
  providers: [AuthGuard, AccountService, CloudinaryConfig],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
