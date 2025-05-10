import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Class, Booking } from '../../entities';
import { AccountUpdateDto } from './dtos/accountUpdateDto';
import { I18nService } from 'nestjs-i18n';
import { clean, PasswordUtils } from '../../common';
import { log } from 'console';
import { PasswordUpdateDto } from './dtos/passwordUpdateDto';
import { CloudinaryConfig } from 'src/common/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';
import { format } from 'date-fns';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
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

  async getClassesByAccountId(accountId: number): Promise<Class[]> {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
      relations: ['classes', 'classes.lecture', 'classes.lecture.course', 'classes.bookings'],
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return account.classes
  }

  async updatePassword(
    accountId: number,
    passwordUpdateDto: PasswordUpdateDto
  ): Promise<string> {
    const { currentPassword, newPassword, confirmPassword } = passwordUpdateDto;

    const account = await this.accountRepo.findOne({ where: { id: accountId } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const isPasswordValid = PasswordUtils.checkPassword(
      currentPassword,
      account.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    account.password = PasswordUtils.hashPassword(newPassword);
    await this.accountRepo.save(account);

    return 'Password updated successfully';
  }

  async getBookingsByAccountId(accountId: number): Promise<Booking[]> {
    const bookings = await this.bookingRepo.find({
      where: { teacher: { id: accountId } },
      relations: ['classEntity', 'classEntity.lecture', 'classEntity.lecture.course'],
      order: {
        created_at: 'DESC'
      }
    });

    if (!bookings) {
      return [];
    }

    return bookings;
  }
}
