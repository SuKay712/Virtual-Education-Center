import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Account, Class, Booking, Course } from '../../entities';
import { AccountService } from './account.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PasswordUpdateDto } from './dtos/passwordUpdateDto';
import { AccountUpdateDto } from './dtos/accountUpdateDto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly cloudinaryConfig: CloudinaryConfig
  ) {}

  @Get('/classes')
  @UseGuards(AuthGuard)
  async getClasses(@Req() request: any):Promise<{ classes: Class[], otherCourses: Course[] }> {
    const currentAccount = request.currentAccount; // Lấy thông tin tài khoản hiện tại từ AuthGuard
    return this.accountService.getClassesByAccountId(currentAccount.id);
  }

  @Get('/classes/next-week')
  @UseGuards(AuthGuard)
  async getClassesNextWeek(@Req() request: any):Promise<{ classes: Class[], otherCourses: Course[] }> {
    const currentAccount = request.currentAccount;
    return this.accountService.getClassesByAccountIdNextWeek(currentAccount.id);
  }

  @Put('/upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: any
  ): Promise<Account> {
    try {
      // Upload avatar lên Cloudinary
      const currentAccount = request.currentAccount;
      const result = await this.accountService.uploadToCloudinary(file);
      // // Lưu URL avatar vào cơ sở dữ liệu
      const updatedAccount = await this.accountService.updateAvatar(
        currentAccount.email,
        result.secure_url
      );
      console.log('Cloudinary result:', updatedAccount);

      return updatedAccount;
    } catch (error) {
      throw new Error('Failed to upload avatar');
    }
  }

  @Put('/update-password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Req() request: any,
    @Body() passwordUpdateDto: PasswordUpdateDto
  ): Promise<string> {
    const currentAccount = request.currentAccount;
    return this.accountService.updatePassword(currentAccount.id, passwordUpdateDto);
  }

  @Get('/bookings')
  @UseGuards(AuthGuard)
  async getBookings(@Req() request: any): Promise<Booking[]> {
    const currentAccount = request.currentAccount;
    return this.accountService.getBookingsByAccountId(currentAccount.id);
  }
}
