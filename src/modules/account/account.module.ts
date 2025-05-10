import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Booking } from '../../entities';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CloudinaryConfig } from 'src/common/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Booking])],
  providers: [AuthGuard, AccountService, CloudinaryConfig],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
