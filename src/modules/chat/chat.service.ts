import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatbox, Chat, ChatGroup, Account } from '../../entities';
import { Role } from '../../common/enums';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chatbox)
    private chatboxRepository: Repository<Chatbox>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatGroup)
    private chatGroupRepository: Repository<ChatGroup>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async createChatbox(user: Account) {
    // Find or create admin chat group
    let adminGroup = await this.chatGroupRepository.findOne({
      where: { name: 'Admin Group' },
    });

    if (!adminGroup) {
      adminGroup = this.chatGroupRepository.create({
        name: 'Admin Group',
      });
      await this.chatGroupRepository.save(adminGroup);
    }

    // Find an admin user
    const admin = await this.accountRepository.findOne({
      where: { role: Role.Admin },
    });

    if (!admin) {
      throw new NotFoundException('No admin found');
    }

    // Create chatbox
    const chatbox = this.chatboxRepository.create({
      student: user,
      admin: admin,
      chatGroup: adminGroup,
    });

    return this.chatboxRepository.save(chatbox);
  }

  async getOrCreateChatbox(accountId: number) {
    if (!accountId || isNaN(accountId)) {
      throw new Error('Invalid account ID');
    }

    // Find the account
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Find or create chat group for all admins
    let chatGroup = await this.chatGroupRepository.findOne({
      where: { name: 'Admin Group' }
    });

    if (!chatGroup) {
      chatGroup = await this.chatGroupRepository.save({
        name: 'Admin Group',
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    if (account.role === Role.Admin) {
      // For admin, return all chatboxes in the admin group
      return this.chatboxRepository.find({
        where: { chatGroup: { id: chatGroup.id } },
        relations: ['student', 'chats', 'chats.sender'],
        order: {
          updated_at: 'DESC'
        }
      });
    } else {
      // For student, find or create their specific chatbox
      let chatbox = await this.chatboxRepository
        .createQueryBuilder('chatbox')
        .innerJoinAndSelect('chatbox.student', 'student')
        .innerJoinAndSelect('chatbox.chatGroup', 'chatGroup')
        .leftJoinAndSelect('chatbox.chats', 'chats')
        .leftJoinAndSelect('chats.sender', 'sender')
        .where('chatbox.studentId = :accountId', { accountId })
        .andWhere('chatbox.chatGroupId = :chatGroupId', { chatGroupId: chatGroup.id })
        .getOne();

      if (!chatbox) {
        // Get all admin accounts
        const admins = await this.accountRepository.find({
          where: { role: Role.Admin }
        });

        // Create new chatbox for student with admin group
        chatbox = await this.chatboxRepository.save({
          student: account,
          chatGroup: chatGroup,
          created_at: new Date(),
          updated_at: new Date()
        });

        // Create welcome message from each admin
        for (const admin of admins) {
          await this.chatRepository.save({
            content: `Xin chào ${account.name}, tôi là ${admin.name}. Tôi có thể giúp gì cho bạn?`,
            chatbox: chatbox,
            sender: admin,
            receiver: account,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }

      return chatbox;
    }
  }

  async getAdminChatboxes() {
    const chatGroup = await this.chatGroupRepository.findOne({
      where: { name: 'Admin Group' }
    });

    if (!chatGroup) {
      return [];
    }

    return this.chatboxRepository.find({
      where: { chatGroup: { id: chatGroup.id } },
      relations: ['student', 'chats', 'chats.sender'],
    });
  }

  async getStudentChatboxes(userId: number) {
    return this.chatboxRepository.find({
      where: { student: { id: userId } },
      relations: ['student', 'admin', 'chatGroup', 'chats', 'chats.sender'],
      order: {
        chats: {
          created_at: 'DESC',
        },
      },
    });
  }

  async getChatHistory(chatboxId: number) {
    const chatbox = await this.chatboxRepository.findOne({
      where: { id: chatboxId },
      relations: ['chats', 'chats.sender'],
    });

    if (!chatbox) {
      throw new NotFoundException('Chatbox not found');
    }

    return chatbox.chats;
  }

  async sendMessage(chatboxId: number, senderId: number, content: string) {
    console.log('Sending message:', { chatboxId, senderId, content });

    const chatbox = await this.chatboxRepository.findOne({
      where: { id: chatboxId },
      relations: ['student', 'admin', 'chatGroup'],
    });

    if (!chatbox) {
      throw new NotFoundException('Chatbox not found');
    }

    const sender = await this.accountRepository.findOne({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const chat = this.chatRepository.create({
      content,
      sender,
      chatbox,
    });

    const savedChat = await this.chatRepository.save(chat);
    console.log('Message saved:', savedChat);

    // Gửi tin nhắn realtime qua WebSocket
    if (sender.role === Role.Admin) {
      // Nếu người gửi là admin, gửi cho student
      this.chatGateway.sendMessageToUser(chatbox.student.id, savedChat);
    } else if (sender.role === Role.Teacher) {
      // Nếu người gửi là teacher, gửi cho tất cả admin
      const admins = await this.accountRepository.find({
        where: { role: Role.Admin }
      });
      for (const admin of admins) {
        this.chatGateway.sendMessageToUser(admin.id, savedChat);
      }
    } else {
      // Nếu người gửi là student, gửi cho tất cả admin
      const admins = await this.accountRepository.find({
        where: { role: Role.Admin }
      });
      for (const admin of admins) {
        this.chatGateway.sendMessageToUser(admin.id, savedChat);
      }
    }

    // Gửi tin nhắn cho người gửi để confirm
    this.chatGateway.sendMessageToUser(senderId, savedChat);

    return savedChat;
  }
}
