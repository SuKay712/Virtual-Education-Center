import { IsEmail, IsString, IsBoolean, MinLength, Matches, IsEnum } from 'class-validator';
import { Role } from '../../../common/enums';

export class CreateAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  @Matches('password')
  confirmPassword: string;

  @IsBoolean()
  isActived: boolean;

  @IsEnum(Role)
  role: Role;
}
