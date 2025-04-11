import { IsEmail, IsNotEmpty } from 'class-validator';
import { AccountGenderEnum } from '../../../common';
import { Optional } from '@nestjs/common';

export class AccountUpdateDto {
  @Optional()
  name: string;
  @Optional()
  displayName: string;
  @Optional()
  address: string;
  @Optional()
  tel: string;
  @Optional()
  gender: AccountGenderEnum;
}
