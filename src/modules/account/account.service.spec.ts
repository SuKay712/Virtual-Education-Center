import { Test, type TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { Repository } from 'typeorm';
import { Account } from '../../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { AccountGenderEnum, AccountRoleEnum } from '../../common';
import type { AccountUpdateDto } from './dtos/accountUpdateDto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { PasswordUpdateDto } from './dtos/passwordUpdateDto';
import * as bcrypt from 'bcrypt';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRepo: Repository<Account>;
  let i18nService: I18nService;
});
