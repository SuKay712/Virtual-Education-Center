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
  Delete,
} from '@nestjs/common';
import { Account, Class, Booking, Course } from '../../entities';
import { AccountService } from './account.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PasswordUpdateDto } from './dtos/passwordUpdateDto';
import { AccountUpdateDto } from './dtos/accountUpdateDto';
import { Role } from '../../common';
import { RoleGuard } from '../../common/guards/role.guard';
import { CreateAccountDto } from './dtos/createAccountDto';
import { AdminUpdateAccountDto } from './dtos/adminUpdateAccountDto';
import { UpdateProfileDto } from './dtos/updateProfileDto';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly cloudinaryConfig: CloudinaryConfig
  ) {}

  @Get('/classes')
  async getClasses(@Req() request: any):Promise<{ classes: Class[], otherCourses: Course[] }> {
    const currentAccount = request.currentAccount; // Lấy thông tin tài khoản hiện tại từ AuthGuard
    return this.accountService.getClassesByAccountId(currentAccount.id);
  }

  @Get('/classes/next-week')
  async getClassesNextWeek(@Req() request: any):Promise<{ classes: Class[], otherCourses: Course[] }> {
    const currentAccount = request.currentAccount;
    return this.accountService.getClassesByAccountIdNextWeek(currentAccount.id);
  }

  @Put('/upload-avatar')
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
  async updatePassword(
    @Req() request: any,
    @Body() passwordUpdateDto: PasswordUpdateDto
  ): Promise<string> {
    const currentAccount = request.currentAccount;
    return this.accountService.updatePassword(currentAccount.id, passwordUpdateDto);
  }

  @Get('/bookings')
  async getBookings(@Req() request: any): Promise<Booking[]> {
    const currentAccount = request.currentAccount;
    return this.accountService.getBookingsByAccountId(currentAccount.id);
  }

  @Get('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  async getAllAccounts(): Promise<Account[]> {
    return this.accountService.getAllAccounts();
  }

  @Post('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  async createAdminAccount(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.createAccount(createAccountDto);
  }

  @Put('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  async updateAdminAccount(
    @Param('id') id: string,
    @Body() adminUpdateAccountDto: AdminUpdateAccountDto
  ): Promise<Account> {
    return this.accountService.updateAccount(id, adminUpdateAccountDto);
  }

  @Put('/admin/:id/upload-avatar')
  @UseGuards(new RoleGuard([Role.Admin]))
  @UseInterceptors(FileInterceptor('file'))
  async uploadAdminAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Account> {
    try {
      const result = await this.accountService.uploadToCloudinary(file);
      return this.accountService.updateAvatarById(id, result.secure_url);
    } catch (error) {
      throw new Error('Failed to upload avatar');
    }
  }

  @Delete('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  async deleteAdminAccount(@Param('id') id: string): Promise<string> {
    return this.accountService.deleteAccount(id);
  }

  @Put('/profile')
  async updateProfile(
    @Req() request: any,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<Account> {
    const currentAccount = request.currentAccount;
    return this.accountService.updateProfile(currentAccount.id, updateProfileDto);
  }
}
