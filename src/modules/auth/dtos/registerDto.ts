import { IsDate, IsEmail, isNotEmpty, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Gender, Role } from 'src/common';
import { Match } from 'src/common/decorator';

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
