import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Class, Booking, Course } from '../../entities';
import { AccountUpdateDto } from './dtos/accountUpdateDto';
import { I18nService } from 'nestjs-i18n';
import { clean, PasswordUtils } from '../../common';
import { log } from 'console';
import { PasswordUpdateDto } from './dtos/passwordUpdateDto';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';
import { format, addDays, startOfWeek, endOfWeek, nextMonday, parse, isSameDay } from 'date-fns';
import { CreateAccountDto } from './dtos/createAccountDto';
import { AdminUpdateAccountDto } from './dtos/adminUpdateAccountDto';
import { Role } from '../../common/enums';
import { UpdateProfileDto } from './dtos/updateProfileDto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
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

  async getClassesByAccountId(accountId: number): Promise<{ classes: Class[], otherCourses: Course[] }> {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
      relations: ['classes', 'classes.lecture.course', 'classes.bookings.teacher', 'classes.student'],
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Get all courses
    const allCourses = await this.courseRepo.find({
      relations: ['lectures'],
    });

    // Get course IDs that the account is enrolled in
    const enrolledCourseIds = account.classes.map(c => c.lecture.course.id);

    // Filter out courses that the account is not enrolled in
    const otherCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.id));

    return {
      classes: account.classes,
      otherCourses
    };
  }

  async getClassesByAccountIdNextWeek(accountId: number): Promise<{ classes: Class[], otherCourses: Course[] }> {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
      relations: ['classes', 'classes.lecture.course', 'classes.bookings.teacher', 'classes.student'],
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Get next Monday
    const nextMondayDate = nextMonday(new Date());

    // Filter classes for next week
    const nextWeekClasses = account.classes.filter(classItem => {
      try {
        // Parse the date string in format "HH:mm dd/MM/yyyy"
        const timeStartStr = String(classItem.time_start);
        const [time, date] = timeStartStr.split(' ');
        const [hours, minutes] = time.split(':');
        const [day, month, year] = date.split('/');

        const classStartDate = new Date(
          parseInt(year),
          parseInt(month) - 1, // Month is 0-based in JavaScript
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );

        // Only include classes that start from next Monday
        return classStartDate >= nextMondayDate;
      } catch (error) {
        console.error('Error parsing date:', error);
        return false;
      }
    });

    // Get all courses
    const allCourses = await this.courseRepo.find({
      relations: ['lectures'],
    });

    // Get course IDs that the account is enrolled in
    const enrolledCourseIds = nextWeekClasses.map(c => c.lecture.course.id);

    // Filter out courses that the account is not enrolled in
    const otherCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.id));

    return {
      classes: nextWeekClasses,
      otherCourses
    };
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
      relations: ['teacher' ,'classEntity', 'classEntity.lecture.theories', 'classEntity.bookings', 'classEntity.bookings.teacher', 'classEntity.lecture.course', 'classEntity.student'],
      order: {
        created_at: 'DESC'
      }
    });

    if (!bookings) {
      return [];
    }

    return bookings;
  }

  async getAllAccounts(): Promise<Account[]> {
    return this.accountRepo.find({
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        birthday: true,
        phone: true,
        avatar: true,
        address: true,
        isActived: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    });
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { email, password, confirmPassword, isActived, role } = createAccountDto;

    // Check if email already exists
    const existingAccount = await this.findByEmail(email);
    if (existingAccount) {
      throw new BadRequestException('Email already exists');
    }

    // Validate password match
    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    const newAccount = this.accountRepo.create({
      email,
      password: PasswordUtils.hashPassword(password),
      isActived,
      role
    });

    return this.accountRepo.save(newAccount);
  }

  async updateAccount(id: string, adminUpdateAccountDto: AdminUpdateAccountDto): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { id: parseInt(id) } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Update only the fields that are provided
    Object.assign(account, adminUpdateAccountDto);
    return this.accountRepo.save(account);
  }

  async updateAvatarById(id: string, avatarUrl: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { id: parseInt(id) } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.avatar = avatarUrl;
    return this.accountRepo.save(account);
  }

  async deleteAccount(id: string): Promise<string> {
    const account = await this.accountRepo.findOne({ where: { id: parseInt(id) } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.accountRepo.remove(account);
    return 'Account deleted successfully';
  }

  async updateProfile(accountId: number, updateProfileDto: UpdateProfileDto): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { id: accountId } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if email is being updated and is unique
    if (updateProfileDto.email && updateProfileDto.email !== account.email) {
      const existingAccount = await this.findByEmail(updateProfileDto.email);
      if (existingAccount) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Check if phone is being updated and is unique
    if (updateProfileDto.phone && updateProfileDto.phone !== account.phone) {
      const existingAccount = await this.accountRepo.findOne({
        where: { phone: updateProfileDto.phone }
      });
      if (existingAccount) {
        throw new BadRequestException('Phone number already exists');
      }
    }

    // Update account with new information
    Object.assign(account, updateProfileDto);

    // Save and return updated account
    const updatedAccount = await this.accountRepo.save(account);

    // Remove sensitive information before returning
    delete updatedAccount.password;

    return updatedAccount;
  }
}
