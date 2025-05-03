import { IsEmail, IsNotEmpty } from 'class-validator';
import { Gender } from '../../../common';
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
  gender: Gender;
}
