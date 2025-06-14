import { IsDate, IsEmail, isNotEmpty, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Gender, Role } from '../../../common';
import { Match } from '../../../common/decorator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  gender: Gender;

  @IsPhoneNumber()
  phone: string;

  role: Role;

  @IsDate()
  birthday: Date;
}
