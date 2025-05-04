import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Account, Class } from '../../entities';
import { AccountService } from './account.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly cloudinaryConfig: CloudinaryConfig
  ) {}

  @Get('/classes')
  @UseGuards(AuthGuard)
  async getClasses(@Req() request: any): Promise<Class[]> {
    const currentAccount = request.currentaccount; // Lấy thông tin tài khoản hiện tại từ AuthGuard
    return this.accountService.getClassesByAccountId(currentAccount.id);
  }

  @Put('/upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() requestBody: any
  ): Promise<Account> {
    try {
      console.log(1)
      // Upload avatar lên Cloudinary
      const result = await this.accountService.uploadToCloudinary(file);

      // // Lưu URL avatar vào cơ sở dữ liệu
      const updatedAccount = await this.accountService.updateAvatar(
        requestBody.email,
        result.secure_url
      );

      return updatedAccount;
    } catch (error) {
      throw new Error('Failed to upload avatar');
    }
  }
}
