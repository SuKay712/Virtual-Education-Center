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

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    // private readonly i18n: I18nService
  ) {}

  async create(requestBody: any): Promise<Account> {
    const { email, password, name } = requestBody;

    const newAccount = {
      email: email,
      password: password,
      name: name,
    };

    const account = this.accountRepo.create(newAccount);
    return this.accountRepo.save(account);
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Account | null> {
    return this.accountRepo.findOne({ where: { id } });
  }
}
