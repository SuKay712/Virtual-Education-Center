import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entities';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AuthGuard, AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
