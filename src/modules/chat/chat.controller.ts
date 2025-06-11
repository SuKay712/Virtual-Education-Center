import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentAccount } from '../../common/decorator/currentAccount.decorator';
import { Account } from '../../entities';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('chatbox')
  async getOrCreateChatbox(@Req() request: any) {
    const currentAccount = request.currentAccount;
    return this.chatService.getOrCreateChatbox(currentAccount.id);
  }

  @Get('admin/chatboxes')
  async getAdminChatboxes() {
    return this.chatService.getAdminChatboxes();
  }

  @Get('student/chatboxes')
  async getStudentChatboxes(@Req() request: any) {
    const account = request.currentAccount;
    return this.chatService.getStudentChatboxes(account.id);
  }

  @Get('chatbox/:id/history')
  async getChatHistory(@Param('id') chatboxId: number) {
    return this.chatService.getChatHistory(chatboxId);
  }

  @Post('chatbox/:id/message')
  async sendMessage(
    @Param('id') chatboxId: number,
    @Req() request: any,
    @Body('content') content: string,
  ) {
    const account = request.currentAccount;
    return this.chatService.sendMessage(chatboxId, account.id, content);
  }
}
