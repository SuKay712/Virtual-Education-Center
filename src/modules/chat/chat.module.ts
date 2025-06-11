import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatbox, Chat, ChatGroup, Account } from '../../entities';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chatbox, Chat, ChatGroup, Account]), AccountModule],
  providers: [ChatService, AuthGuard],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
