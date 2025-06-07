import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Theory } from '../../entities';
import { TheoryController } from './theory.controller';
import { TheoryService } from './theory.service';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Theory, Account]), AccountModule],
  controllers: [TheoryController],
  providers: [TheoryService],
  exports: [TheoryService]
})
export class TheoryModule {}
