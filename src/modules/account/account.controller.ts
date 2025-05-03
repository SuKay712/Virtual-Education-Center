import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Account } from '../../entities';
import { AccountService } from './account.service';
// import { CurrentAccount } from '../../common/decorator/currentAccount.decorator';
import { Role, CurrentAccount, Lang } from '../../common';
import { RoleGuard } from '../../common/guards/role.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountUpdateDto } from './dtos/accountUpdateDto';
import { LoggingInterceptor } from '../../common/interceptors';
import { FileInterceptor } from '@nestjs/platform-express';
import { PasswordUpdateDto } from './dtos/passwordUpdateDto';

@Controller('accounts')
@UseInterceptors(LoggingInterceptor)
export class AccountController {
  constructor(
    private readonly accountService: AccountService
  ) {}

  @Post()
  async create(@Body() requestBody: any): Promise<Account> {
    return this.accountService.create(requestBody);
  }

}
