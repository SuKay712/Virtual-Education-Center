import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../entities';
import { AccountUpdateDto } from './dtos/accountUpdateDto';
import { I18nService } from 'nestjs-i18n';
import { clean, PasswordUtils } from '../../common';
import { log } from 'console';
import { PasswordUpdateDto } from './dtos/passwordUpdateDto';
import { CloudinaryConfig } from 'src/common/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly cloudinaryConfig: CloudinaryConfig
    // private readonly i18n: I18nService
  ) {}

  async create(requestBody: any): Promise<Account> {
    const newAccount = this.accountRepo.create({
      ...requestBody
    });

    return this.accountRepo.save(newAccount)[0];
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Account | null> {
    return this.accountRepo.findOne({ where: { id } });
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result: { secure_url: string }) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(error);
          }
          resolve(result);
        }
      ).end(file.buffer);
    });
  }

  async updateAvatar(accountEmail: string, avatarUrl: string): Promise<Account> {
    const account = await this.findByEmail(accountEmail);
    if (!account) {
      throw new Error('Account not found');
    }

    account.avatar = avatarUrl;
    return this.accountRepo.save(account);
  }
}
