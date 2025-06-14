import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from '../../entities/contact.entity';
import { AccountModule } from '../account/account.module';
import { Account } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Account]), AccountModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
